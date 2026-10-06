# Ujian Secure App — Exam Lockdown (Anti-Nyontek / AI / Browsing / Screenshot)

Aplikasi ujian online dengan **keamanan berlapis (defense in depth)**:

```
┌─────────────────────────────────────────────────┐
│ L1: Web client hardening (JS)                   │  ← menaikkan biaya nyontek
│ L2: Capacitor wrapper (native bridge)           │
│ L3: Android native hardening (Kotlin)           │  ← blokir screenshot/recording
│ L4: Server enforcement (token, timing, grading) │  ← sumber kebenaran final
│ L5: Prosedur pengawas (manusia)                 │
└─────────────────────────────────────────────────┘
```

> Prinsip: **semua yang di client bisa diakali.** Keputusan kelulusan / flag curang yang sah
> hanya dari server (waktu server, kunci jawaban tidak pernah dikirim ke client).

## Struktur folder

```
ujian-secure-app/
├── README.md
├── capacitor.config.json
├── package.json
├── web/
│   ├── index.html
│   ├── exam.js
│   └── style.css
├── android-secure/
│   ├── MainActivity.kt.snippet
│   └── AndroidManifest.xml.snippet
├── server/
│   └── api-contract.md
└── security-policy.md
```

## 1. Arsitektur keamanan berlapis

| Lapisan | Mekanisme | File |
|---|---|---|
| Web JS | fullscreen wajib, 3x pelanggaran = auto-submit, blokir klik kanan/shortcut, blur/visibility detection, resize/split-screen detection, watermark bergerak, acak soal+opsi, timer server-synced, offline queue, violation-log | `web/exam.js` |
| Native Android | `FLAG_SECURE` (blokir screenshot & screen-record), LockTask/screen-pinning, blokir split-screen & PiP, blokir overlay tapjacking, deteksi Developer Options/USB debugging, `allowBackup=false`, noHistory | `android-secure/*` |
| Server | token sekali pakai + device binding, kunci jawaban tidak pernah ke client, time-window, grading server-side, violation log dinilai server | `server/api-contract.md` |
| Prosedur | aturan 3 pelanggaran, daftar app terlarang, remedial, privasi | `security-policy.md` |

## 2. Keterbatasan: Web vs Native (jujur)

| Ancaman | Web murni (browser) | + Capacitor Native (APK ini) |
|---|---|---|
| Screenshot / screen-record | ❌ Tidak bisa diblokir penuh (API browser tidak mengizinkan) | ✅ `FLAG_SECURE` → layar hitam di screenshot/recorder |
| Split-screen / floating window | ⚠️ Hanya bisa dideteksi (resize), tidak dicegah | ✅ Bisa dicegah (`resizeableActivity=false`, blokir PiP/multi-window) |
| Copy-paste / DevTools / View-source | ✅ Bisa diblokir/dipersulit | ✅ Sama + WebView hardening |
| Buka tab/app lain (browser, ChatGPT) | ⚠️ Hanya terdeteksi (blur/visibilitychange) | ✅ LockTask/pinning + `excludeFromRecents` mempersulit keluar |
| Foto layar pakai HP kedua | ❌ Tidak bisa dicegah teknis | ⚠️ Dipersulit watermark identitas bergerak |
| USB debugging / overlay / tapjacking | ❌ Tidak terlihat dari web | ✅ Terdeteksi/diblokir native |

**Kesimpulan:** browser = deteksi + flag. APK + `FLAG_SECURE` + pinning = pencegahan nyata
untuk screenshot, recorder, split-screen, overlay. Foto HP kedua dan AI eksternal tetap
butuh pengawas manusia.

## 3. Cara build APK

### Prasyarat
1. Node.js 18+ (`node -v`)
2. Java JDK 17 (`java -version`)
3. Android Studio (termasuk Android SDK + Platform-Tools)
4. Set `ANDROID_HOME` / `ANDROID_SDK_ROOT` dan tambahkan `platform-tools` ke PATH.

### Langkah build
```bash
cd ujian-secure-app

# 1. Install dependency
npm install

# 2. Copy web asset ke Capacitor (tanpa framework build step)
npx cap sync android

# 3. Buka di Android Studio
npx cap open android
```

Di Android Studio:
1. Tempel isi `android-secure/MainActivity.kt.snippet` ke
   `android/app/src/main/java/<paket>/MainActivity.kt`.
2. Gabungkan `android-secure/AndroidManifest.xml.snippet` ke
   `android/app/src/main/AndroidManifest.xml` (jangan overwrite penuh —
   sesuaikan `package`).
3. Sync Gradle → Run di emulator / device → **Build > Build APK(s)**.
4. APK ada di `android/app/build/outputs/apk/debug/app-debug.apk`.

Untuk APK rilis: buat keystore → Signing Config → Build Signed APK/AAB.
Jangan pernah rilis APK debug ke peserta.

### Tanpa Android SDK?
Source ini tetap lengkap dan siap build. Tanpa JDK/SDK kamu **tidak bisa**
menghasilkan `.apk` dari mesin ini — harus build di mesin yang ada
Android Studio-nya (atau CI, mis. GitHub Actions `android` workflow).

## 4. Cara hubungkan ke SIAKAD

Kontrak lengkap: `server/api-contract.md`.

1. SIAKAD menerbitkan token ujian sekali pakai:
   `POST /api/exam/token` → `{ NIM, exam_id, device_id }` → `exam_token` (JWT, 5 menit).
2. App login pakai token (`web/index.html` → kolom token). App mengikat `device_id`
   (Capacitor Device ID / Web fingerprint fallback) dan mengirimkannya di tiap request.
3. Soal diambil: `GET /api/exam/questions` — **tanpa `kunci` / `pembahasan`**.
4. Jawaban + violation-log dikirim: `POST /api/exam/submit` dan
   `POST /api/exam/violation-log` (atau antre offline lalu flush).
5. Nilai dihitung **server-side**. Client tidak pernah menilai.
6. Sinkron nilai ke SIAKAD: server ujian → `POST {SIAKAD_BASE}/api/nilai/import`
   dengan server-key (bukan dari HP peserta).

Contoh env di SIAKAD backend:
```
EXAM_SERVER_BASE=https://ujian.sekolah.ac.id
EXAM_SERVER_KEY=<rahasia-antar-server>
EXAM_TOKEN_TTL=300
```

## 5. Checklist pengawas

- [ ] Semua HP dalam mode pesawat + WiFi ujian saja (atau sesuai kebijakan).
- [ ] Peserta install APK resmi (cek hash / versionName). Tolak APK mod.
- [ ] Aktifkan screen-pinning sebelum mulai (atau LockTask via Device Owner bila ada MDM).
- [ ] Matikan split-screen & floating window (dicegah native, verifikasi di 1 sampel HP).
- [ ] Pastikan Developer Options / USB debugging MATI (app memberi warning; pengawas menolak yang menyala).
- [ ] Cek tidak ada screen-recorder / browser mengambang (app diblokir overlay).
- [ ] Catat 3-strike: pelanggaran ke-3 = auto-submit + flag `CHEAT_SUSPECT`, peserta tidak boleh lanjut tanpa izin.
- [ ] Setelah waktu habis: pastikan submit sukses (cek status `submitted`, bukan antre offline).
- [ ] Arsipkan violation-log per peserta untuk komite remedial.

## 6. Kebijakan & privasi

Lihat `security-policy.md`. Intinya: inform consent, data minim (token, jawaban,
violation event — bukan isi layar/foto tanpa izin tertulis), retensi 1 semester,
jalur banding remedial.
