# Kebijakan Anti-Cheat — Ujian Secure

## 1. Aturan 3 pelanggaran (3-strike)

| Strike | Pemicu (contoh) | Aksi sistem | Aksi manusia |
|---|---|---|---|
| 1 | Keluar fullscreen sekali, blur/tab-switch, resize kecil, shortcut diblokir | Warning overlay + log | Pengawas menegur lisan |
| 2 | Pelanggaran berulang (total 2) | Warning keras + log, timer tetap jalan | Pengawas mendatangi meja |
| 3 | Pelanggaran ke-3 | **Auto-submit + kunci layar + flag `CHEAT_SUSPECT`** | Peserta dihentikan; berita acara |

Pelanggaran yang **langsung strike-3** (tanpa toleransi): terdeteksi screen-record
native, USB debugging aktif + bypass, token dipakai 2 device.

## 2. Daftar aplikasi / perilaku terlarang selama ujian

1. Browser (Chrome, Firefox, dsb.) di luar WebView ujian.
2. Asisten AI / chatbot / mesin pencari (ChatGPT, Gemini, Copilot, dsb.).
3. Screen recorder, screenshot tool, screen-mirroring/casting.
4. Floating window / split-screen / picture-in-picture.
5. Overlay / screen-reader yang menutupi soal (kecuali aksesibilitas yang disetujui).
6. Remote-access (TeamViewer, AnyDesk), emulator/root-bypass, DevTools.
7. HP kedua, catatan kertas, komunikasi dengan peserta lain.

## 3. Prosedur remedial

1. Flag `CHEAT_SUSPECT` ≠ vonis. Komite (wali kelas + pengawas + admin) memeriksa
   violation-log + berita acara dalam 3 hari kerja.
2. Ringan (1–2 strike, submit manual): nilai tetap sah, pembinaan tertulis.
3. Berat (≥3 strike / auto-submit paksa): ujian dibatalkan → remedial terjadwal
   dengan soal cadangan + pengawasan 1:5.
4. Peserta berhak banding 1x dengan bukti (mis. HP hang dibuktikan log `RESIZE_SPLIT`
   tanpa `BLUR` susulan — indikasi rotasi layar, bukan nyontek).

## 4. Privasi & persetujuan (wajib dibaca peserta)

- Data yang dikumpulkan: token ujian, jawaban, **event pelanggaran**
  (jenis + waktu, mis. `FULLSCREEN_EXIT`), status submit. **Bukan** isi layar,
  foto wajah, atau isi app lain — kecuali modul face-check diaktifkan dan
  disetujui tertulis terpisah.
- Face-check di build ini **placeholder** (status `NOT_ENFORCED`, lihat `exam.js`).
  Jangan klaim ada verifikasi wajah sampai modul resmi + consent ditandatangani.
- Watermark identitas di layar bertujuan mencegah foto; tidak merekam.
- Retensi: log dihapus / anonimasi maksimal 1 semester setelah nilai final.
- Persetujuan: menekan "Mulai Ujian" = menyetujui kebijakan ini + bersedia
  auto-submit bila 3x melanggar.

## 5. Tanggung jawab pengawas

Lihat checklist di `README.md`. Intinya: verifikasi APK resmi, pastikan
Developer Options mati, awasi fisik (HP kedua tidak terdeteksi teknis apa pun),
arsipkan berita acara untuk setiap `CHEAT_SUSPECT`.
