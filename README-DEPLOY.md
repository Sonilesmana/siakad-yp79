# Deploy Online — GitHub + Vercel + Supabase

Web ini static (HTML/Tailwind CDN/JS) jadi langsung bisa online.
DB default = localStorage (demo langsung jalan). Supabase = opsional untuk DB online.

## 1. Supabase (5 menit)
1. Buat project di https://supabase.com → dapat **Project URL** + **anon key**
   (Settings → API).
2. Buka **SQL Editor** → jalankan isi file `supabase/schema.sql`.
3. Buka web hasil deploy → login → menu **Profil** → isi Supabase URL + anon key
   → **Simpan Koneksi** → **Sync ke Supabase**.
4. Data lain bisa **Tarik dari Supabase** di perangkat lain.

Catatan: policy RLS di `schema.sql` sengaja terbuka untuk demo sekolah.
Untuk produksi, batasi dengan Supabase Auth.

## 2. GitHub
```powershell
git init; git add -A; git commit -m "siakad yp79 online"
gh repo create siakad-yp79 --public --source=. --push
```

## 3. Vercel
- Via web: https://vercel.com/new → Import repo `siakad-yp79` → Deploy
  (tanpa build command, output = root).
- Via CLI: `vercel --prod` di folder ini.

File `vercel.json` sudah disiapkan (cleanUrls, static).
