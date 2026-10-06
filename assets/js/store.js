/* SIAKAD YP79 — mock DB + localStorage */
(function(){
const KEY='siakad_yp79_db_v1';
const uid=(p)=>(p||'id')+'_'+Math.random().toString(36).slice(2,8);
function seed(){
return {
users:[
 {id:'u-siswa',role:'siswa',nama:'Ahmad Siswa',email:'siswa@siswa.yp79',password:'siswa123',nis:'2425001',kelas:'X TKJ 1',jurusan:'TKJ'},
 {id:'u-ortu',role:'ortu',nama:'Bpk. Orang Tua',email:'ortu@ortu.yp79',password:'ortu123',anak_nis:'2425001'},
 {id:'u-guru',role:'guru',nama:'Ibu Siti Guru',email:'guru@guru.yp79',password:'guru123',mapel:'Produktif TKJ'},
 {id:'u-wali',role:'wali',nama:'Pak Wali Kelas',email:'wali@wali.yp79',password:'wali123',kelas:'X TKJ 1'},
 {id:'u-tu',role:'tu',nama:'Staff TU',email:'tu@tu.yp79',password:'tu123'},
 {id:'u-bendahara',role:'bendahara',nama:'Bendahara Sekolah',email:'bendahara@bendahara.yp79',password:'bendahara123'},
 {id:'u-bk',role:'bk',nama:'Guru BK',email:'bk@bk.yp79',password:'bk123'},
 {id:'u-kepsek',role:'kepsek',nama:'Kepala Sekolah',email:'kepsek@kepsek.yp79',password:'kepsek123'},
 {id:'u-perpus',role:'perpus',nama:'Pustakawan',email:'perpus@perpus.yp79',password:'perpus123'},
 {id:'u-sarpas',role:'sarpas',nama:'Staff Sarpas',email:'sarpas@sarpas.yp79',password:'sarpas123'},
 {id:'u-operator',role:'operator',nama:'Operator Dapodik',email:'operator@operator.yp79',password:'operator123'},
 {id:'u-admin',role:'admin',nama:'Admin Sekolah',email:'admin@admin.yp79',password:'admin123'},
 {id:'u-super',role:'superadmin',nama:'Super Admin',email:'superadmin@super.yp79',password:'super123'},
 {id:'u-dev',role:'developer',nama:'Developer Schoolix',email:'dev@dev.yp79',password:'dev123'},
 {id:'u-ppdb',role:'ppdb',nama:'Calon Siswa Demo',email:'calon@ppdb.yp79',password:'ppdb123',no_pendaftaran:'PPDB-2026-0001'}
],
ppdb:[
 {id:'p1',no:'PPDB-2026-0001',nama:'Calon Siswa Demo',email:'calon@ppdb.yp79',password:'ppdb123',nik:'3201010101010001',ttl:'Bandung, 01-01-2010',jk:'Laki-laki',alamat:'Jl. Merdeka No.1',asal_sekolah:'SMPN 1 Majalaya',jurusan:'TKJ',no_hp:'083822770152',nama_ortu:'Bpk. Demo',status:'Menunggu Pengumuman',berkas:'kk.pdf, ijazah.pdf',tanggal:'2026-06-01'}
],
announcements:[
 {id:'a1',judul:'PPDB 2026/2027 Dibuka',isi:'Pendaftaran siswa baru dibuka 1 Juni – 12 Juli 2026. Jurusan: TSM, AKL, TKJ.',tanggal:'2026-06-01',target:'semua'},
 {id:'a2',judul:'Pengumuman Kelulusan PPDB Gelombang 1',isi:'Peserta dengan status LULUS otomatis menjadi siswa dan dapat mencetak Kartu Pelajar.',tanggal:'2026-07-15',target:'ppdb'},
 {id:'a3',judul:'Pembayaran SPP Juli 2026',isi:'SPP dapat dibayar via transfer / QRIS / tunai ke bendahara. Denda Rp5.000/hari setelah tgl 10.',tanggal:'2026-07-01',target:'semua'}
],
jadwal:[
 {id:'j1',kelas:'X TKJ 1',hari:'Senin',jam:'07:00-08:30',mapel:'Produktif TKJ',guru:'Ibu Siti Guru',ruang:'Lab TKJ'},
 {id:'j2',kelas:'X TKJ 1',hari:'Senin',jam:'08:30-10:00',mapel:'Matematika',guru:'Pak Budi',ruang:'R-03'},
 {id:'j3',kelas:'XI AKL 1',hari:'Selasa',jam:'07:00-08:30',mapel:'Akuntansi Dasar',guru:'Ibu Rina',ruang:'R-05'},
 {id:'j4',kelas:'X TSM 1',hari:'Rabu',jam:'10:00-11:30',mapel:'Otomotif Dasar',guru:'Pak Dedi',ruang:'Bengkel TSM'}
],
absensi:[
 {id:'ab1',tanggal:'2026-10-05',kelas:'X TKJ 1',nis:'2425001',nama:'Ahmad Siswa',status:'Hadir'},
 {id:'ab2',tanggal:'2026-10-05',kelas:'X TKJ 1',nis:'2425002',nama:'Budi Santoso',status:'Izin'}
],
materi:[
 {id:'m1',mapel:'Produktif TKJ',judul:'Dasar Jaringan Komputer',deskripsi:'Topologi, IP Address, Subnetting',file:'materi-jaringan.pdf',tanggal:'2026-09-20'},
 {id:'m2',mapel:'Matematika',judul:'Persamaan Linear',deskripsi:'SPLDV dan penerapannya',file:'materi-mtk.pdf',tanggal:'2026-09-22'}
],
tugas:[
 {id:'t1',mapel:'Produktif TKJ',judul:'Konfigurasi IP Static',deadline:'2026-10-12',deskripsi:'Konfigurasi 2 PC dengan kabel straight',status:'Aktif'},
 {id:'t2',mapel:'Matematika',judul:'Latihan SPLDV',deadline:'2026-10-10',deskripsi:'Kerjakan 10 soal halaman 45',status:'Aktif'}
],
ujian:[
 {id:'u1',mapel:'Produktif TKJ',judul:'UTS Semester Ganjil',tanggal:'2026-10-20',jam:'08:00-10:00',ruang:'Lab TKJ',jenis:'UTS'},
 {id:'u2',mapel:'Matematika',judul:'Ulangan Harian 3',tanggal:'2026-10-14',jam:'10:00-11:00',ruang:'R-03',jenis:'UH'}
],
nilai:[
 {id:'n1',nis:'2425001',nama:'Ahmad Siswa',mapel:'Produktif TKJ',tugas:85,uts:88,uas:90,akhir:88,predikat:'A'},
 {id:'n2',nis:'2425001',nama:'Ahmad Siswa',mapel:'Matematika',tugas:78,uts:80,uas:82,akhir:80,predikat:'B'},
 {id:'n3',nis:'2425002',nama:'Budi Santoso',mapel:'Produktif TKJ',tugas:75,uts:70,uas:78,akhir:74,predikat:'C'}
],
invoices:[
 {id:'inv1',nis:'2425001',nama:'Ahmad Siswa',jenis:'SPP Juli 2026',jumlah:250000,status:'Lunas',tanggal:'2026-07-05',metode:'QRIS'},
 {id:'inv2',nis:'2425001',nama:'Ahmad Siswa',jenis:'SPP Agustus 2026',jumlah:250000,status:'Belum Bayar',tanggal:'2026-08-01',metode:'-'},
 {id:'inv3',nis:'2425002',nama:'Budi Santoso',jenis:'SPP Juli 2026',jumlah:250000,status:'Belum Bayar',tanggal:'2026-07-01',metode:'-'}
],
wallet:[
 {id:'w1',nis:'2425001',jenis:'TopUp',jumlah:100000,keterangan:'TopUp via QRIS',tanggal:'2026-10-01',saldo_akhir:100000},
 {id:'w2',nis:'2425001',jenis:'Jajan Kantin',jumlah:-15000,keterangan:'QR Kantin',tanggal:'2026-10-03',saldo_akhir:85000}
],
books:[
 {id:'b1',judul:'Pemrograman Dasar',pengarang:'Andi',stok:12,kategori:'TKJ',kode:'BK-001'},
 {id:'b2',judul:'Akuntansi Keuangan',pengarang:'Sari',stok:8,kategori:'AKL',kode:'BK-002'},
 {id:'b3',judul:'Teknik Sepeda Motor',pengarang:'Dedi',stok:5,kategori:'TSM',kode:'BK-003'}
],
loans:[
 {id:'l1',nis:'2425001',nama:'Ahmad Siswa',buku:'Pemrograman Dasar',pinjam:'2026-10-01',kembali:'2026-10-08',status:'Dipinjam',denda:0}
],
bk_cases:[
 {id:'bk1',nis:'2425002',nama:'Budi Santoso',kategori:'Kedisiplinan',catatan:'Terlambat 3x dalam seminggu',tindak_lanjut:'Pemanggilan orang tua',status:'Proses',tanggal:'2026-10-02',privat:true}
],
sarpras:[
 {id:'s1',nama:'Komputer Lab TKJ-01',lab:'TKJ',kondisi:'Baik',jumlah:1,lokasi:'Lab TKJ',terakhir_cek:'2026-09-01'},
 {id:'s2',nama:'Unit Motor Praktik',lab:'TSM',kondisi:'Perlu Servis',jumlah:4,lokasi:'Bengkel TSM',terakhir_cek:'2026-08-20'},
 {id:'s3',nama:'Kalkulator Akuntansi',lab:'AKL',kondisi:'Baik',jumlah:20,lokasi:'R-AKL',terakhir_cek:'2026-09-10'}
],
messages:[
 {id:'mg1',dari:'Wali Kelas',judul:'Rapat Orang Tua',isi:'Rapat pembagian raport Jumat 10 Okt pkl 09.00',tanggal:'2026-10-04',target:'semua'},
 {id:'mg2',dari:'Bendahara',judul:'Reminder SPP',isi:'SPP Agustus mohon segera dilunasi.',tanggal:'2026-10-05',target:'ortu'}
],
approvals:[
 {id:'ap1',jenis:'Izin Siswa',pemohon:'Ahmad Siswa (2425001)',detail:'Izin sakit 6 Okt, surat dokter terlampir',status:'Menunggu',tanggal:'2026-10-06'},
 {id:'ap2',jenis:'Pengajuan Barang',pemohon:'Lab TKJ',detail:'Pengadaan 5 kabel LAN + switch hub',status:'Menunggu',tanggal:'2026-10-05'}
],
audit:[
 {id:'ad1',waktu:'2026-10-06 08:00',user:'admin@admin.yp79',aksi:'Login',detail:'Login berhasil dari 127.0.0.1'}
],
features:[
 {id:'f1',nama:'PPDB Online',status:true},{id:'f2',nama:'Wallet & QRIS',status:true},{id:'f3',nama:'Face Recognition',status:false},{id:'f4',nama:'Notifikasi WA',status:true}
]
};
}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw){const d=seed();localStorage.setItem(KEY,JSON.stringify(d));return d;}return JSON.parse(raw);}catch(e){const d=seed();return d;}}
let db=load();
function save(){localStorage.setItem(KEY,JSON.stringify(db));}
window.Store={
 get db(){return db;},
 save:save,
 all(col){return db[col]||[];},
 add(col,item){item.id=item.id||uid(col);db[col]=db[col]||[];db[col].unshift(item);save();return item;},
 update(col,id,data){const i=(db[col]||[]).findIndex(x=>x.id===id);if(i>=0){db[col][i]={...db[col][i],...data};save();return true;}return false;},
 remove(col,id){db[col]=(db[col]||[]).filter(x=>x.id!==id);save();},
 reset(){db=seed();save();},
 exportCSV(col){const rows=db[col]||[];if(!rows.length)return '';const h=Object.keys(rows[0]);const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return h.join(',')+'\n'+rows.map(r=>h.map(k=>esc(r[k])).join(',')).join('\n');},
 log(user,aksi,detail){db.audit.unshift({id:uid('ad'),waktu:new Date().toLocaleString('id-ID'),user:user||'-',aksi:aksi,detail:detail||''});save();}
};
})();
