-- SIAKAD SMK YP.79 — Skema Supabase (jalankan di SQL Editor)
-- Sengaja sederhana (demo sekolah). Password masih plaintext agar sama
-- dengan demo localStorage; untuk produksi ganti ke Supabase Auth + hash.

create table if not exists users (
  id text primary key,
  role text not null,
  nama text not null,
  email text unique not null,
  password text not null,
  nis text,
  kelas text,
  jurusan text,
  anak_nis text,
  mapel text,
  no_pendaftaran text,
  created_at timestamptz default now()
);

create table if not exists ppdb (
  id text primary key,
  no text unique not null,
  nama text not null,
  email text,
  password text,
  nik text, ttl text, jk text, alamat text,
  asal_sekolah text, jurusan text, no_hp text, nama_ortu text,
  status text default 'Menunggu Pengumuman',
  berkas text, tanggal text,
  created_at timestamptz default now()
);

create table if not exists announcements (
  id text primary key, judul text, isi text, tanggal text, target text default 'semua'
);
create table if not exists jadwal (
  id text primary key, kelas text, hari text, jam text, mapel text, guru text, ruang text
);
create table if not exists absensi (
  id text primary key, tanggal text, kelas text, nis text, nama text, status text
);
create table if not exists materi (
  id text primary key, mapel text, judul text, deskripsi text, file text, tanggal text
);
create table if not exists tugas (
  id text primary key, mapel text, judul text, deadline text, deskripsi text, status text default 'Aktif'
);
create table if not exists ujian (
  id text primary key, mapel text, judul text, tanggal text, jam text, ruang text, jenis text
);
create table if not exists nilai (
  id text primary key, nis text, nama text, mapel text,
  tugas int default 0, uts int default 0, uas int default 0,
  akhir int default 0, predikat text
);
create table if not exists invoices (
  id text primary key, nis text, nama text, jenis text, jumlah int default 0,
  status text default 'Belum Bayar', tanggal text, metode text default '-'
);
create table if not exists wallet_tx (
  id text primary key, nis text, jenis text, jumlah int default 0,
  keterangan text, tanggal text, saldo_akhir int default 0
);
create table if not exists books (
  id text primary key, judul text, pengarang text, stok int default 0, kategori text, kode text
);
create table if not exists loans (
  id text primary key, nis text, nama text, buku text,
  pinjam text, kembali text, status text default 'Dipinjam', denda int default 0
);
create table if not exists bk_cases (
  id text primary key, nis text, nama text, kategori text, catatan text,
  tindak_lanjut text, status text default 'Proses', tanggal text, privat boolean default true
);
create table if not exists sarpras (
  id text primary key, nama text, lab text, kondisi text, jumlah int default 1,
  lokasi text, terakhir_cek text
);
create table if not exists messages (
  id text primary key, dari text, judul text, isi text, tanggal text, target text default 'semua'
);
create table if not exists approvals (
  id text primary key, jenis text, pemohon text, detail text,
  status text default 'Menunggu', tanggal text
);
create table if not exists audit_log (
  id text primary key, waktu text, "user" text, aksi text, detail text,
  created_at timestamptz default now()
);
create table if not exists features (
  id text primary key, nama text, status boolean default true
);

-- Aktifkan RLS + policy demo terbuka (anon bisa baca/tulis).
-- Untuk produksi: batasi per role / pakai Supabase Auth.
alter table users enable row level security;
alter table ppdb enable row level security;
alter table announcements enable row level security;
alter table jadwal enable row level security;
alter table absensi enable row level security;
alter table materi enable row level security;
alter table tugas enable row level security;
alter table ujian enable row level security;
alter table nilai enable row level security;
alter table invoices enable row level security;
alter table wallet_tx enable row level security;
alter table books enable row level security;
alter table loans enable row level security;
alter table bk_cases enable row level security;
alter table sarpras enable row level security;
alter table messages enable row level security;
alter table approvals enable row level security;
alter table audit_log enable row level security;
alter table features enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'users','ppdb','announcements','jadwal','absensi','materi','tugas',
    'ujian','nilai','invoices','wallet_tx','books','loans','bk_cases',
    'sarpras','messages','approvals','audit_log','features']
  loop
    execute format('drop policy if exists demo_all on %I', t);
    execute format('create policy demo_all on %I for all using (true) with check (true)', t);
  end loop;
end $$;
