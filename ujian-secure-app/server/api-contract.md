# Kontrak API Server Ujian ↔ SIAKAD

Base URL contoh: `https://ujian.sekolah.ac.id`
Auth antar-server: header `X-Server-Key: <EXAM_SERVER_KEY>` (jangan taruh di APK).
Auth peserta: header `Authorization: Bearer <exam_token>` (JWT sekali pakai).

## Prinsip yang tidak boleh dilanggar

1. **Kunci jawaban tidak pernah dikirim ke client.** Endpoint soal hanya kirim
   `id, nomor, teks, opsi[]` (tanpa `kunci`, tanpa `pembahasan`, tanpa `bobot`).
2. **Penilaian 100% server-side** saat `POST /api/exam/submit`.
3. **Token sekali pakai + device binding.** Token terikat `exam_id + NIM + device_id`.
   Dipakai dari device lain → `409 DEVICE_MISMATCH` + violation.
4. **Time-window ditegakkan server.** `start_at / end_at` dari server; submit di luar
   window → `403 EXAM_CLOSED`, kecuali antre offline dengan `client_saved_at` di dalam
   window (tetap divalidasi + flag `LATE_SYNC`).
5. **Timer client hanya display.** Sisa waktu resmi = `server_now` vs `end_at`.

---

## 1. POST /api/exam/token — terbitkan token (dipanggil SIAKAD, server-to-server)

Request:
```http
POST /api/exam/token
X-Server-Key: <secret>
Content-Type: application/json

{
  "nim": "2024001",
  "nama": "Siti Aminah",
  "exam_id": "UTS-MTK-7A-2026",
  "device_id": "fp-9f2c… (opsional saat pra-registrasi)",
  "ttl_seconds": 300
}
```

Response `200`:
```json
{
  "exam_token": "eyJhbGciOiJIUzI1NiIs…",
  "exam_id": "UTS-MTK-7A-2026",
  "expires_at": "2026-10-06T08:05:00Z",
  "server_now": "2026-10-06T08:00:00Z"
}
```

Error: `401 BAD_SERVER_KEY`, `404 EXAM_NOT_FOUND`, `403 EXAM_NOT_OPEN`.

## 2. GET /api/exam/questions — ambil soal (tanpa kunci)

```http
GET /api/exam/questions?exam_id=UTS-MTK-7A-2026
Authorization: Bearer <exam_token>
X-Device-Id: <device_id>
```

Response `200`:
```json
{
  "exam": {
    "exam_id": "UTS-MTK-7A-2026",
    "title": "UTS Matematika 7A",
    "duration_seconds": 3600,
    "start_at": "2026-10-06T08:00:00Z",
    "end_at": "2026-10-06T09:00:00Z",
    "server_now": "2026-10-06T08:00:10Z",
    "total": 3
  },
  "questions": [
    { "id": "q1", "teks": "Hasil dari 12 × 8 − 20 adalah…", "opsi": ["76", "86", "96", "106"] },
    { "id": "q2", "teks": "FPB dari 24 dan 36 adalah…", "opsi": ["6", "12", "18", "24"] },
    { "id": "q3", "teks": "Luas persegi sisi 9 cm adalah… cm²", "opsi": ["72", "81", "90", "99"] }
  ]
}
```

> Client WAJIB mengacak ulang urutan soal & opsi secara lokal (seed dari token)
> agar tiap peserta berbeda — lihat `web/exam.js` (`shuffle()`).

Error: `401 TOKEN_INVALID`, `410 TOKEN_USED`, `409 DEVICE_MISMATCH`, `403 EXAM_CLOSED`.

## 3. POST /api/exam/submit — kumpulkan jawaban

```http
POST /api/exam/submit
Authorization: Bearer <exam_token>
X-Device-Id: <device_id>
Content-Type: application/json

{
  "exam_id": "UTS-MTK-7A-2026",
  "client_saved_at": "2026-10-06T08:59:40Z",
  "auto_submit": false,
  "violation_count": 1,
  "answers": [
    { "question_id": "q1", "option_index_shown": 2, "option_label": "96" },
    { "question_id": "q2", "option_index_shown": 1, "option_label": "12" },
    { "question_id": "q3", "option_index_shown": null, "option_label": null }
  ]
}
```

Catatan: client mengirim `option_label` (teks opsi yang tampil) karena urutan
opsi diacak per device; server memetakan label → benar/salah.

Response `200`:
```json
{
  "status": "submitted",
  "score": null,
  "message": "Jawaban diterima. Nilai diumumkan via SIAKAD.",
  "server_now": "2026-10-06T08:59:41Z"
}
```

> `score: null` — nilai tidak dikembalikan ke HP peserta (mencegah kebocoran kunci
> via brute-force submit). Nilai hanya via SIAKAD setelah jendela ditutup.

Error: `403 EXAM_CLOSED`, `409 ALREADY_SUBMITTED`, `422 BAD_PAYLOAD`.

## 4. POST /api/exam/violation-log — lapor pelanggaran

Bisa dikirim berkala (beacon) maupun dibundel saat submit. Client juga simpan di
`localStorage` sebagai bukti bila offline.

```http
POST /api/exam/violation-log
Authorization: Bearer <exam_token>
Content-Type: application/json

{
  "exam_id": "UTS-MTK-7A-2026",
  "events": [
    { "type": "FULLSCREEN_EXIT", "at": "2026-10-06T08:12:01Z", "detail": "count=1" },
    { "type": "BLUR", "at": "2026-10-06T08:12:02Z", "detail": "visibilitychange:hidden" },
    { "type": "SHORTCUT_BLOCKED", "at": "2026-10-06T08:15:44Z", "detail": "ctrl+c" }
  ]
}
```

Response: `{ "logged": 3, "strike": 1, "server_now": "…" }`.
Tipe event valid: `FULLSCREEN_EXIT`, `BLUR`, `FOCUS_LOSS`, `RESIZE_SPLIT`,
`CONTEXTMENU_BLOCKED`, `SHORTCUT_BLOCKED`, `COPY_ATTEMPT`, `DEVTOOLS_ATTEMPT`,
`OFFLINE_QUEUE`, `AUTO_SUBMIT`, `FACE_ABSENT` (placeholder).

## 5. Sinkron nilai ke SIAKAD (server-to-server, setelah koreksi)

```
POST {SIAKAD_BASE}/api/nilai/import
X-Server-Key: <SIAKAD_KEY>

{ "exam_id": "UTS-MTK-7A-2026",
  "grades": [{ "nim": "2024001", "nilai": 85, "status": "BERSIH" }] }
```

`status`: `BERSIH` | `CURANG_RINGAN` (1–2 strike) | `CHEAT_SUSPECT` (≥3 strike / auto-submit paksa).
Keputusan remedial ikut `security-policy.md`, bukan otomatis dari app.
