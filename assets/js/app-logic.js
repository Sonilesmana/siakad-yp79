/* SIAKAD YP79 — app logic SPA */
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MENUS={
 siswa:[['home','🏠 Dashboard'],['akademik','📚 Akademik & LMS'],['keuangan','💳 SPP & Tagihan'],['wallet','👛 Wallet'],['perpus','📖 Perpustakaan'],['komunikasi','💬 Pengumuman'],['kartu','🪪 Kartu Pelajar'],['profil','👤 Profil']],
 ortu:[['home','🏠 Dashboard'],['akademik','📊 Nilai & Raport Anak'],['keuangan','💳 Tagihan SPP'],['wallet','👛 Wallet Anak'],['komunikasi','💬 Pengumuman'],['profil','👤 Profil']],
 guru:[['home','🏠 Dashboard'],['akademik','📚 Jadwal & Akademik'],['komunikasi','💬 Komunikasi'],['workflow','✅ Approval'],['profil','👤 Profil']],
 wali:[['home','🏠 Dashboard'],['akademik','📚 Akademik Kelas'],['bk','🧠 BK Kelas'],['workflow','✅ Approval'],['komunikasi','💬 Komunikasi'],['profil','👤 Profil']],
 tu:[['home','🏠 Dashboard'],['ppdb','📝 PPDB'],['pengumuman','📢 Pengumuman PPDB'],['akademik','📚 Akademik'],['keuangan','💳 Keuangan'],['workflow','✅ Workflow'],['komunikasi','💬 Komunikasi'],['profil','👤 Profil']],
 bendahara:[['home','🏠 Dashboard'],['keuangan','💳 Keuangan & SPP'],['wallet','👛 Wallet'],['analytics','📈 Laporan'],['profil','👤 Profil']],
 bk:[['home','🏠 Dashboard'],['bk','🧠 BK & Konseling'],['workflow','✅ Approval'],['komunikasi','💬 Komunikasi'],['profil','👤 Profil']],
 kepsek:[['home','🏠 Dashboard'],['analytics','📈 Analytics'],['workflow','✅ Approval'],['akademik','📚 Akademik'],['keuangan','💳 Keuangan'],['keamanan','🔒 Audit Log'],['profil','👤 Profil']],
 perpus:[['home','🏠 Dashboard'],['perpus','📖 Perpustakaan'],['profil','👤 Profil']],
 sarpas:[['home','🏠 Dashboard'],['sarpras','🔧 Sarpras Lab'],['workflow','✅ Pengajuan'],['profil','👤 Profil']],
 operator:[['home','🏠 Dashboard'],['ppdb','📝 PPDB'],['akademik','📚 Akademik'],['kartu','🪪 Kartu Pelajar'],['komunikasi','💬 Komunikasi'],['profil','👤 Profil']],
 admin:[['home','🏠 Dashboard'],['ppdb','📝 PPDB'],['pengumuman','📢 Pengumuman'],['akademik','📚 Akademik'],['keuangan','💳 Keuangan'],['wallet','👛 Wallet'],['perpus','📖 Perpus'],['bk','🧠 BK'],['sarpras','🔧 Sarpras'],['komunikasi','💬 Komunikasi'],['workflow','✅ Workflow'],['analytics','📈 Analytics'],['keamanan','🔒 Keamanan'],['kartu','🪪 Kartu'],['roles','🛡️ Role'],['profil','👤 Profil']],
 superadmin:[['home','🏠 Dashboard'],['ppdb','📝 PPDB'],['akademik','📚 Akademik'],['keuangan','💳 Keuangan'],['wallet','👛 Wallet'],['perpus','📖 Perpus'],['bk','🧠 BK'],['sarpras','🔧 Sarpras'],['komunikasi','💬 Komunikasi'],['workflow','✅ Workflow'],['analytics','📈 Analytics'],['keamanan','🔒 Keamanan'],['roles','🛡️ Role & Permission'],['kartu','🪪 Kartu'],['profil','👤 Profil']],
 developer:[['home','🏠 Dashboard'],['devpanel','🧑‍💻 Developer Panel'],['roles','🛡️ Roles & Flags'],['analytics','📈 Monitor'],['keamanan','🔒 Audit Log'],['komunikasi','💬 Notifikasi'],['profil','👤 Profil']],
 ppdb:[['home','🏠 Dashboard'],['ppdb','📝 Form PPDB'],['pengumuman','📢 Pengumuman'],['kartu','🪪 Kartu Saya'],['profil','👤 Profil']]
};
const ROLE_NAME={siswa:'Siswa',ortu:'Orang Tua',guru:'Guru',wali:'Wali Kelas',tu:'Tata Usaha',bendahara:'Bendahara',bk:'BK',kepsek:'Kepala Sekolah',perpus:'Perpustakaan',sarpas:'Sarpas',operator:'Operator',admin:'Admin Sekolah',superadmin:'Super Admin',developer:'Developer',ppdb:'Calon Siswa'};
let cur=null, route='home';
window.AppInit=function(user){cur=user;route='home';renderShell();nav('home');};
function nav(r){route=r;document.querySelectorAll('.sidebar-link').forEach(a=>a.classList.toggle('active',a.dataset.nav===r));renderContent();}
function renderShell(){
 const menus=MENUS[cur.role]||MENUS.siswa;
 $('#userBox').innerHTML=`<div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center font-bold">${esc(cur.nama[0])}</div><div><div class="font-semibold text-sm">${esc(cur.nama)}</div><div class="text-xs text-cyan-300">${ROLE_NAME[cur.role]||cur.role} • ${esc(cur.email)}</div></div>`;
 $('#sideNav').innerHTML=menus.map(([k,l])=>`<div class="sidebar-link ${k===route?'active':''}" data-nav="${k}">${l}</div>`).join('');
 document.querySelectorAll('.sidebar-link').forEach(a=>a.onclick=()=>nav(a.dataset.nav));
}
function tbl(headers,rows,actions){return `<div class="overflow-x-auto glass rounded-xl"><table class="w-full text-sm table-dark min-w-[640px]"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}${actions?'<th>Aksi</th>':''}</tr></thead><tbody>${rows||'<tr><td colspan="20" class="text-center text-slate-400 py-6">Belum ada data</td></tr>'}</tbody></table></div>`;}
function downloadCSV(col){const csv=Store.exportCSV(col);const b=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=col+'.csv';a.click();}
function walletBalance(nis){return Store.all('wallet').filter(w=>w.nis===nis).reduce((s,w)=>s+Number(w.jumlah),0);}
function myNIS(){if(cur.role==='siswa')return cur.nis||'2425001';if(cur.role==='ortu')return cur.anak_nis||'2425001';if(cur.role==='ppdb'){const p=Store.all('ppdb').find(x=>x.email===cur.email);return p?p.no:p?.no;}return null;}

function renderContent(){
 const el=$('#content');const R=cur.role;const nis=myNIS();
 const wrap=(t,h)=>`<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">${t}</h2><div class="flex gap-2 no-print">${h||''}</div></div>`;
 if(route==='home'){
  const totalSiswa=Store.all('users').filter(u=>u.role==='siswa').length+Store.all('ppdb').length;
  const tunggakan=Store.all('invoices').filter(i=>i.status!=='Lunas').reduce((s,i)=>s+Number(i.jumlah),0);
  const kasMasuk=Store.all('invoices').filter(i=>i.status==='Lunas').reduce((s,i)=>s+Number(i.jumlah),0);
  const pinjam=Store.all('loans').filter(l=>l.status==='Dipinjam').length;
  el.innerHTML=`${wrap('Dashboard '+esc(ROLE_NAME[R]||R),`<button onclick="window.print()" class="glass px-4 py-2 rounded-lg text-sm">🖨 Export PDF</button>`)}
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
   ${[['👥 Siswa / PPDB',totalSiswa],['💰 Kas Masuk','Rp'+kasMasuk.toLocaleString('id-ID')],['⚠️ Tunggakan','Rp'+tunggakan.toLocaleString('id-ID')],['📖 Dipinjam',pinjam]].map(([a,b])=>`<div class="glass rounded-2xl p-5 card-hover"><div class="text-sm text-slate-300">${a}</div><div class="text-2xl font-extrabold grad-text font-display">${b}</div></div>`).join('')}
  </div>
  <div class="grid md:grid-cols-2 gap-4">
   <div class="glass rounded-2xl p-5"><h3 class="font-bold mb-3">📢 Pengumuman Terbaru</h3>${Store.all('announcements').slice(0,3).map(a=>`<div class="border-b border-white/10 py-2"><div class="font-semibold text-sm">${esc(a.judul)}</div><div class="text-xs text-slate-400">${esc(a.isi.slice(0,120))}…</div></div>`).join('')}</div>
   <div class="glass rounded-2xl p-5"><h3 class="font-bold mb-3">⏳ Perlu Persetujuan</h3>${Store.all('approvals').filter(a=>a.status==='Menunggu').map(a=>`<div class="text-sm py-2 border-b border-white/10"><b>${esc(a.jenis)}</b> — ${esc(a.pemohon)}<br><span class="text-slate-400">${esc(a.detail)}</span></div>`).join('')||'<p class="text-sm text-slate-400">Tidak ada antrian.</p>'}</div>
  </div>
  ${nis&&R==='siswa'?`<div class="glass rounded-2xl p-5 mt-4">Saldo Wallet: <b class="text-cyan-300">Rp${walletBalance(nis).toLocaleString('id-ID')}</b> • <button data-go="wallet" class="text-cyan-300 underline text-sm">Kelola</button></div>`:''}`;
  el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>nav(b.dataset.go));
 }
 else if(route==='ppdb'){el.innerHTML=viewPPDB();bindPPDB(el);}
 else if(route==='pengumuman'){el.innerHTML=viewPengumuman();bindPengumuman(el);}
 else if(route==='akademik'){el.innerHTML=viewAkademik(R);bindAkademik(el,R);}
 else if(route==='keuangan'){el.innerHTML=viewKeuangan(nis,R);bindKeuangan(el);}
 else if(route==='wallet'){el.innerHTML=viewWallet(nis);bindWallet(el,nis);}
 else if(route==='perpus'){el.innerHTML=viewPerpus();bindPerpus(el);}
 else if(route==='bk'){el.innerHTML=viewBK();bindBK(el);}
 else if(route==='sarpras'){el.innerHTML=viewSarpras();bindSarpras(el);}
 else if(route==='komunikasi'){el.innerHTML=viewKomunikasi();bindKomunikasi(el);}
 else if(route==='workflow'){el.innerHTML=viewWorkflow();bindWorkflow(el);}
 else if(route==='analytics'){el.innerHTML=viewAnalytics();bindAnalytics(el);}
 else if(route==='keamanan'){el.innerHTML=viewKeamanan();bindKeamanan(el);}
 else if(route==='roles'){el.innerHTML=viewRoles();bindRoles(el);}
 else if(route==='devpanel'){el.innerHTML=viewDev();bindDev(el);}
 else if(route==='kartu'){el.innerHTML=viewKartu(cur);bindKartu(el);}
 else if(route==='profil'){const sbc=(window.SB?SB.getConfig():{});el.innerHTML=`${wrap('Profil Saya')}<div class="glass rounded-2xl p-6 max-w-lg"><div class="text-2xl font-bold">${esc(cur.nama)}</div><div class="text-cyan-300 text-sm mb-4">${ROLE_NAME[cur.role]} • ${esc(cur.email)}</div><label class="text-xs text-slate-400">Nama</label><input id="pfNama" class="input mb-3" value="${esc(cur.nama)}"><button id="pfSave" class="btn-glow px-5 py-2 rounded-lg text-sm font-semibold">Simpan</button> <button onclick="Store.reset();location.reload()" class="glass px-4 py-2 rounded-lg text-sm">Reset Demo Data</button><hr class="my-5 border-white/10"><h4 class="font-bold text-sm">Supabase (Online DB)</h4><p class="text-xs text-slate-400">Status: ${window.SB&&SB.isConfigured()?'<b class="text-green-300">Terhubung</b>':'<b class="text-yellow-300">Lokal saja</b> — isi URL + anon key untuk online'}</p><label class="text-xs text-slate-400 mt-2 block">Supabase URL</label><input id="sbUrl" class="input font-mono text-xs" placeholder="https://xyz.supabase.co" value="${esc(sbc.url||'')}"><label class="text-xs text-slate-400 mt-2 block">Anon Key</label><input id="sbKey" type="password" class="input font-mono text-xs" placeholder="eyJ..." value="${esc(sbc.key||'')}"><div class="flex flex-wrap gap-2 mt-3"><button id="sbSave" class="btn-glow px-4 py-2 rounded-lg text-xs font-bold">Simpan Koneksi</button><button id="sbSync" class="glass px-4 py-2 rounded-lg text-xs">Sync ke Supabase</button><button id="sbPull" class="glass px-4 py-2 rounded-lg text-xs">Tarik dari Supabase</button></div><p id="sbMsg" class="text-xs text-slate-300 mt-2"></p></div>`;el.querySelector('#pfSave').onclick=()=>{Store.update('users',cur.id,{nama:el.querySelector('#pfNama').value});cur.nama=el.querySelector('#pfNama').value;renderShell();alert('Profil disimpan');};
   el.querySelector('#sbSave').onclick=()=>{SB.saveConfig(el.querySelector('#sbUrl').value.trim(),el.querySelector('#sbKey').value.trim());el.querySelector('#sbMsg').textContent='Tersimpan. Reload untuk mengaktifkan.';};
   el.querySelector('#sbSync').onclick=async()=>{el.querySelector('#sbMsg').textContent='Mengirim...';try{const r=await SB.syncAll();el.querySelector('#sbMsg').textContent='Berhasil: '+r.join(' | ');}catch(e){el.querySelector('#sbMsg').textContent='Gagal: '+e.message;}};
   el.querySelector('#sbPull').onclick=async()=>{el.querySelector('#sbMsg').textContent='Menarik...';try{await SB.pullAll();el.querySelector('#sbMsg').textContent='Berhasil ditarik. Reload halaman.';}catch(e){el.querySelector('#sbMsg').textContent='Gagal: '+e.message;}};}
 window.scrollTo(0,0);
}
window.navGo=nav;

/* ---- PPDB ---- */
function viewPPDB(){
 const list=Store.all('ppdb');
 const rows=list.map(p=>`<tr><td class="font-mono text-cyan-300">${esc(p.no)}</td><td>${esc(p.nama)}</td><td>${esc(p.jurusan)}</td><td><span class="badge ${p.status.includes('LULUS')?'bg-green-500/20 text-green-300':p.status.includes('TIDAK')?'bg-red-500/20 text-red-300':'bg-yellow-500/20 text-yellow-300'}">${esc(p.status)}</span></td><td class="no-print"><button data-kartu="${p.id}" class="text-cyan-300 text-xs underline">Kartu</button> <button data-hapus="${p.id}" class="text-red-300 text-xs underline">Hapus</button></td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">📝 PPDB — Pendaftaran Siswa Baru</h2><span class="badge bg-cyan-500/20 text-cyan-300">Gelombang 2026/2027 dibuka</span></div>
 <div class="grid lg:grid-cols-2 gap-4">
 <div class="glass rounded-2xl p-5"><h3 class="font-bold mb-3">Formulir Pendaftaran + Upload Berkas</h3>
 <div class="grid grid-cols-2 gap-2">
 <input id="f_nama" class="input col-span-2" placeholder="Nama lengkap*"><input id="f_nik" class="input" placeholder="NIK*"><input id="f_ttl" class="input" placeholder="TTL (Bandung, 01-01-2010)">
 <select id="f_jk" class="input"><option>Laki-laki</option><option>Perempuan</option></select><input id="f_hp" class="input" placeholder="No HP/WA*">
 <input id="f_asal" class="input" placeholder="Asal sekolah*"><select id="f_jurusan" class="input"><option>TKJ</option><option>TSM</option><option>AKL</option></select>
 <input id="f_ortu" class="input" placeholder="Nama orang tua"><input id="f_email" class="input" placeholder="Email login*"><input id="f_pass" type="password" class="input" placeholder="Password login*"><input id="f_alamat" class="input col-span-2" placeholder="Alamat lengkap">
 <label class="col-span-2 text-xs text-slate-300">Upload berkas (KK / KTP / Surat Kelulusan — simulasi, tersimpan sebagai nama file)<input id="f_berkas" type="file" multiple class="input mt-1"></label>
 </div><button id="f_submit" class="btn-glow w-full mt-3 py-2.5 rounded-xl font-bold">Kirim & Terbitkan Kartu PPDB</button><p id="f_msg" class="text-sm mt-2 text-green-300"></p></div>
 <div><h3 class="font-bold mb-2">Data Pendaftar (${list.length})</h3>${tbl(['No. Daftar','Nama','Jurusan','Status',''],rows,true)}</div></div>
 <div id="kartuArea"></div>`;
}
function bindPPDB(el){
 el.querySelector('#f_submit').onclick=()=>{
  const v=id=>el.querySelector(id).value.trim();
  const nama=v('#f_nama'),email=v('#f_email'),pass=v('#f_pass');
  if(!nama||!email||!pass){alert('Nama, email, password wajib diisi');return;}
  const files=el.querySelector('#f_berkas').files;let berkas=[...files].map(f=>f.name).join(', ')||'kk.pdf (simulasi)';
  const no='PPDB-2026-'+String(Math.floor(1000+Math.random()*9000));
  const rec={no,nama,email,password:pass,nik:v('#f_nik'),ttl:v('#f_ttl'),jk:v('#f_jk'),no_hp:v('#f_hp'),asal_sekolah:v('#f_asal'),jurusan:v('#f_jurusan'),nama_ortu:v('#f_ortu'),alamat:v('#f_alamat'),berkas,status:'Menunggu Pengumuman',tanggal:new Date().toISOString().slice(0,10)};
  Store.add('ppdb',rec);
  if(!Store.db.users.find(u=>u.email===email))Store.add('users',{role:'ppdb',nama,email,password:pass,no_pendaftaran:no});
  Store.log(cur.email,'PPDB Baru',no+' '+nama);
  el.querySelector('#f_msg').textContent='Berhasil! No. Pendaftaran: '+no+' — gunakan email/no tersebut untuk login calon siswa.';
  renderContent();
 };
 el.querySelectorAll('[data-hapus]').forEach(b=>b.onclick=()=>{if(confirm('Hapus pendaftar?')){Store.remove('ppdb',b.dataset.hapus);renderContent();}});
 el.querySelectorAll('[data-kartu]').forEach(b=>b.onclick=()=>{const p=Store.all('ppdb').find(x=>x.id===b.dataset.kartu);el.querySelector('#kartuArea').innerHTML=kartuPPDB(p);});
}
function kartuPPDB(p){return `<div class="print-card mt-4 rounded-2xl p-6 text-slate-900" style="max-width:520px"><div class="flex items-center gap-3 border-b-2 border-slate-800 pb-3 mb-3"><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center text-white font-extrabold">YP</div><div><div class="font-extrabold">KARTU PPDB — SMK YP.79 MAJALAYA</div><div class="text-xs">No: ${esc(p.no)} • ${esc(p.tanggal)}</div></div></div><table class="text-sm"><tr><td class="pr-4 text-slate-500">Nama</td><td><b>${esc(p.nama)}</b></td></tr><tr><td class="pr-4 text-slate-500">Jurusan</td><td>${esc(p.jurusan)}</td></tr><tr><td class="pr-4 text-slate-500">Asal Sekolah</td><td>${esc(p.asal_sekolah)}</td></tr><tr><td class="pr-4 text-slate-500">Status</td><td><b>${esc(p.status)}</b></td></tr></table><div class="mt-3 no-print flex gap-2"><button onclick="window.print()" class="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">🖨 Cetak</button></div></div>`;}

/* ---- Pengumuman kelulusan ---- */
function viewPengumuman(){
 const rows=Store.all('ppdb').map(p=>`<tr><td class="font-mono text-cyan-300">${esc(p.no)}</td><td>${esc(p.nama)}</td><td>${esc(p.jurusan)}</td><td><span class="badge ${p.status.includes('LULUS')?'bg-green-500/20 text-green-300':'bg-yellow-500/20 text-yellow-300'}">${esc(p.status)}</span></td><td class="no-print">${['tu','operator','admin','superadmin'].includes(cur.role)?`<button data-lulus="${p.id}" class="text-green-300 text-xs underline">Luluskan</button> <button data-gagal="${p.id}" class="text-red-300 text-xs underline">Tidak Lulus</button>`:''}</td></tr>`).join('');
 const info=Store.all('announcements').map(a=>`<div class="glass rounded-xl p-4"><div class="font-bold text-sm">${esc(a.judul)} <span class="text-xs text-slate-400">• ${esc(a.tanggal)}</span></div><div class="text-sm text-slate-300">${esc(a.isi)}</div></div>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">📢 Pengumuman PPDB</h2><button onclick="window.print()" class="glass px-4 py-2 rounded-lg text-sm no-print">🖨 Export PDF</button></div><div class="grid gap-3 mb-4">${info}</div><h3 class="font-bold mb-2">Hasil Seleksi</h3>${tbl(['No','Nama','Jurusan','Status','Aksi'],rows,true)}<p class="text-xs text-slate-400 mt-2">Peserta LULUS otomatis menjadi siswa (akun siswa dibuat) dan dapat mencetak Kartu Pelajar di menu Kartu.</p>`;
}
function bindPengumuman(el){
 el.querySelectorAll('[data-lulus]').forEach(b=>b.onclick=()=>{
  const p=Store.all('ppdb').find(x=>x.id===b.dataset.lulus);Store.update('ppdb',p.id,{status:'LULUS — Diterima'});
  if(!Store.db.users.find(u=>u.email===p.email)){const nis='2425'+String(Math.floor(100+Math.random()*900));Store.add('users',{role:'siswa',nama:p.nama,email:p.email,password:p.password,nis,kelas:'X '+p.jurusan+' 1',jurusan:p.jurusan});Store.add('users',{role:'ortu',nama:'Ortu '+p.nama,email:'ortu-'+p.email,password:'ortu123',anak_nis:nis});}
  Store.log(cur.email,'Kelulusan',p.no+' LULUS');renderContent();});
 el.querySelectorAll('[data-gagal]').forEach(b=>b.onclick=()=>{Store.update('ppdb',b.dataset.gagal,{status:'TIDAK LULUS'});renderContent();});
}

/* ---- Akademik ---- */
function viewAkademik(R){
 const j=Store.all('jadwal').map(x=>`<tr><td>${esc(x.kelas)}</td><td>${esc(x.hari)}</td><td>${esc(x.jam)}</td><td>${esc(x.mapel)}</td><td>${esc(x.guru)}</td><td>${esc(x.ruang)}</td><td class="no-print"><button data-dj="${x.id}" class="text-red-300 text-xs">✕</button></td></tr>`).join('');
 const ab=Store.all('absensi').map(x=>`<tr><td>${esc(x.tanggal)}</td><td>${esc(x.nis)}</td><td>${esc(x.nama)}</td><td>${esc(x.status)}</td><td class="no-print"><button data-da="${x.id}" class="text-red-300 text-xs">✕</button></td></tr>`).join('');
 const mt=Store.all('materi').map(x=>`<tr><td>${esc(x.mapel)}</td><td><b>${esc(x.judul)}</b><br><span class="text-xs text-slate-400">${esc(x.deskripsi)}</span></td><td>${esc(x.file)}</td><td class="no-print"><button data-dm="${x.id}" class="text-red-300 text-xs">✕</button></td></tr>`).join('');
 const tg=Store.all('tugas').map(x=>`<tr><td>${esc(x.mapel)}</td><td><b>${esc(x.judul)}</b><br><span class="text-xs text-slate-400">${esc(x.deskripsi)}</span></td><td>${esc(x.deadline)}</td><td class="no-print"><button data-dt="${x.id}" class="text-red-300 text-xs">✕</button></td></tr>`).join('');
 const uj=Store.all('ujian').map(x=>`<tr><td>${esc(x.jenis)}</td><td>${esc(x.mapel)}</td><td>${esc(x.judul)}</td><td>${esc(x.tanggal)} ${esc(x.jam)}</td><td>${esc(x.ruang)}</td></tr>`).join('');
 let nis=myNIS();let nil=Store.all('nilai');if(nis&&['siswa','ortu'].includes(R))nil=nil.filter(n=>n.nis===nis);
 const nl=nil.map(x=>`<tr><td>${esc(x.nis)}</td><td>${esc(x.nama)}</td><td>${esc(x.mapel)}</td><td>${x.tugas}</td><td>${x.uts}</td><td>${x.uas}</td><td><b>${x.akhir}</b> (${esc(x.predikat)})</td><td class="no-print"><button data-dn="${x.id}" class="text-red-300 text-xs">✕</button> <button data-rapor="${x.nis}" class="text-cyan-300 text-xs underline">Raport</button></td></tr>`).join('');
 const canEdit=['guru','wali','operator','admin','superadmin','tu'].includes(R);
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">📚 Akademik / Jadwal / Absensi / LMS</h2><div class="flex gap-2 no-print"><button id="expCsv" class="glass px-4 py-2 rounded-lg text-sm">⬇ CSV Nilai</button><button onclick="window.print()" class="glass px-4 py-2 rounded-lg text-sm">🖨 PDF</button></div></div>
 ${canEdit?`<div class="glass rounded-2xl p-4 mb-4 no-print"><div class="font-bold text-sm mb-2">+ Tambah Jadwal / Nilai / Absensi</div><div class="grid md:grid-cols-6 gap-2"><input id="nj_kelas" class="input" placeholder="Kelas"><input id="nj_hari" class="input" placeholder="Hari"><input id="nj_jam" class="input" placeholder="Jam"><input id="nj_mapel" class="input" placeholder="Mapel"><input id="nj_guru" class="input" placeholder="Guru"><button id="nj_add" class="btn-glow rounded-lg text-sm font-bold">+ Jadwal</button></div><div class="grid md:grid-cols-6 gap-2 mt-2"><input id="nn_nis" class="input" placeholder="NIS"><input id="nn_nama" class="input" placeholder="Nama"><input id="nn_mapel" class="input" placeholder="Mapel"><input id="nn_t" class="input" placeholder="Tugas" type="number"><input id="nn_u" class="input" placeholder="UTS" type="number"><button id="nn_add" class="btn-glow rounded-lg text-sm font-bold">+ Nilai</button></div><div class="grid md:grid-cols-6 gap-2 mt-2"><input id="na_nis" class="input" placeholder="NIS absen"><input id="na_nama" class="input" placeholder="Nama"><select id="na_st" class="input"><option>Hadir</option><option>Izin</option><option>Sakit</option><option>Alpa</option></select><button id="na_add" class="btn-glow rounded-lg text-sm font-bold col-span-2">+ Absensi Hari Ini</button></div></div>`:''}
 <div class="grid gap-4"><div><h3 class="font-bold mb-2">🗓 Jadwal Pelajaran</h3>${tbl(['Kelas','Hari','Jam','Mapel','Guru','Ruang'],j,true)}</div>
 <div class="grid lg:grid-cols-2 gap-4"><div><h3 class="font-bold mb-2">✅ Absensi</h3>${tbl(['Tanggal','NIS','Nama','Status'],ab,true)}</div><div><h3 class="font-bold mb-2">📝 Tugas</h3>${tbl(['Mapel','Tugas','Deadline'],tg,true)}</div></div>
 <div><h3 class="font-bold mb-2">📖 Materi LMS</h3>${tbl(['Mapel','Materi','File'],mt,true)}</div>
 <div><h3 class="font-bold mb-2">🎓 Ujian & Kalender Akademik</h3>${tbl(['Jenis','Mapel','Judul','Waktu','Ruang'],uj,false)}</div>
 <div><h3 class="font-bold mb-2">🏆 Nilai & Raport</h3>${tbl(['NIS','Nama','Mapel','Tgs','UTS','UAS','Akhir'],nl,true)}<div id="raporArea"></div></div></div>`;
}
function bindAkademik(el,R){
 el.querySelector('#expCsv')&&(el.querySelector('#expCsv').onclick=()=>downloadCSV('nilai'));
 const del=(sel,col)=>el.querySelectorAll(sel).forEach(b=>b.onclick=()=>{Store.remove(col,b.dataset.dj||b.dataset.da||b.dataset.dm||b.dataset.dt||b.dataset.dn);renderContent();});
 del('[data-dj]','jadwal');del('[data-da]','absensi');del('[data-dm]','materi');del('[data-dt]','tugas');del('[data-dn]','nilai');
 el.querySelectorAll('[data-rapor]').forEach(b=>b.onclick=()=>{const rows=Store.all('nilai').filter(n=>n.nis===b.dataset.rapor);el.querySelector('#raporArea').innerHTML=`<div class="print-card rounded-2xl p-6 mt-3 text-slate-900" style="max-width:640px"><h3 class="font-extrabold text-center">RAPORT SEMESTER — SMK YP.79</h3><p class="text-center text-sm mb-3">NIS: ${esc(b.dataset.rapor)}</p>${tbl(['Mapel','Tugas','UTS','UAS','Akhir'],rows.map(n=>`<tr><td>${esc(n.mapel)}</td><td>${n.tugas}</td><td>${n.uts}</td><td>${n.uas}</td><td><b>${n.akhir}</b></td></tr>`).join(''),false)}<div class="no-print mt-2"><button onclick="window.print()" class="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">🖨 Cetak Raport</button></div></div>`;});
 const q=id=>el.querySelector(id);if(!q('#nj_add'))return;
 q('#nj_add').onclick=()=>{Store.add('jadwal',{kelas:q('#nj_kelas').value||'X TKJ 1',hari:q('#nj_hari').value||'Senin',jam:q('#nj_jam').value||'07:00',mapel:q('#nj_mapel').value||'Mapel',guru:q('#nj_guru').value||cur.nama,ruang:'R-01'});renderContent();};
 q('#nn_add').onclick=()=>{const t=+q('#nn_t').value||0,u=+q('#nn_u').value||0;const ak=Math.round((t+u+u)/3);Store.add('nilai',{nis:q('#nn_nis').value||'2425001',nama:q('#nn_nama').value||'Siswa',mapel:q('#nn_mapel').value||'Mapel',tugas:t,uts:u,uas:u,akhir:ak,predikat:ak>=85?'A':ak>=75?'B':'C'});renderContent();};
 q('#na_add').onclick=()=>{Store.add('absensi',{tanggal:new Date().toISOString().slice(0,10),kelas:'-',nis:q('#na_nis').value||'2425001',nama:q('#na_nama').value||'Siswa',status:q('#na_st').value});renderContent();};
}

/* ---- Keuangan ---- */
function viewKeuangan(nis,R){
 let inv=Store.all('invoices');if(nis&&['siswa','ortu'].includes(R))inv=inv.filter(i=>i.nis===nis);
 const rows=inv.map(i=>`<tr><td>${esc(i.nis)}</td><td>${esc(i.nama)}</td><td>${esc(i.jenis)}</td><td>Rp${Number(i.jumlah).toLocaleString('id-ID')}</td><td><span class="badge ${i.status==='Lunas'?'bg-green-500/20 text-green-300':'bg-red-500/20 text-red-300'}">${esc(i.status)}</span></td><td class="no-print">${i.status!=='Lunas'?`<button data-bayar="${i.id}" class="text-cyan-300 text-xs underline">Bayar</button> `:''}<button data-inv="${i.id}" class="text-slate-300 text-xs underline">Invoice</button> ${['bendahara','admin','superadmin','tu'].includes(R)?`<button data-delinv="${i.id}" class="text-red-300 text-xs">✕</button>`:''}</td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">💳 Keuangan & SPP</h2><div class="flex gap-2 no-print"><button id="kCsv" class="glass px-4 py-2 rounded-lg text-sm">⬇ CSV</button><button onclick="window.print()" class="glass px-4 py-2 rounded-lg text-sm">🖨 PDF</button></div></div>
 ${['bendahara','admin','superadmin','tu'].includes(R)?`<div class="glass rounded-2xl p-4 mb-4 no-print grid md:grid-cols-5 gap-2"><input id="k_nis" class="input" placeholder="NIS"><input id="k_nama" class="input" placeholder="Nama"><input id="k_jenis" class="input" placeholder="Jenis (SPP …)"><input id="k_jml" class="input" type="number" placeholder="Jumlah"><button id="k_add" class="btn-glow rounded-lg text-sm font-bold">+ Tagihan</button></div>`:''}
 ${tbl(['NIS','Nama','Jenis','Jumlah','Status',''],rows,true)}<div id="invArea"></div>`;
}
function bindKeuangan(el){
 el.querySelector('#kCsv').onclick=()=>downloadCSV('invoices');
 el.querySelectorAll('[data-delinv]').forEach(b=>b.onclick=()=>{Store.remove('invoices',b.dataset.delinv);renderContent();});
 el.querySelectorAll('[data-bayar]').forEach(b=>b.onclick=()=>{Store.update('invoices',b.dataset.bayar,{status:'Lunas',metode:'QRIS / Transfer',tanggal:new Date().toISOString().slice(0,10)});Store.log(cur.email,'Bayar SPP',b.dataset.bayar);alert('Pembayaran berhasil (simulasi QRIS/Bank). Invoice Lunas.');renderContent();});
 el.querySelectorAll('[data-inv]').forEach(b=>b.onclick=()=>{const i=Store.all('invoices').find(x=>x.id===b.dataset.inv);el.querySelector('#invArea').innerHTML=`<div class="print-card rounded-2xl p-6 mt-3 text-slate-900" style="max-width:520px"><h3 class="font-extrabold">INVOICE — SMK YP.79</h3><p class="text-sm">ID: ${esc(i.id)} • ${esc(i.tanggal)}</p><hr class="my-2"><p><b>${esc(i.nama)}</b> (${esc(i.nis)})</p><p>${esc(i.jenis)} — <b>Rp${Number(i.jumlah).toLocaleString('id-ID')}</b></p><p>Status: <b>${esc(i.status)}</b> • ${esc(i.metode)}</p><div class="no-print mt-2"><button onclick="window.print()" class="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">🖨 Cetak Invoice</button></div></div>`;});
 const add=el.querySelector('#k_add');if(add)add.onclick=()=>{const g=id=>el.querySelector(id).value;Store.add('invoices',{nis:g('#k_nis')||'2425001',nama:g('#k_nama')||'Siswa',jenis:g('#k_jenis')||'SPP',jumlah:+g('#k_jml')||250000,status:'Belum Bayar',tanggal:new Date().toISOString().slice(0,10),metode:'-'});renderContent();};
}

/* ---- Wallet ---- */
function viewWallet(nis){
 nis=nis||'2425001';
 const tx=Store.all('wallet').filter(w=>!nis||w.nis===nis);
 const saldo=tx.reduce((s,w)=>s+Number(w.jumlah),0);
 const rows=tx.map(w=>`<tr><td>${esc(w.tanggal)}</td><td>${esc(w.jenis)}</td><td class="${Number(w.jumlah)>=0?'text-green-300':'text-red-300'}">${Number(w.jumlah)>=0?'+':''}Rp${Number(w.jumlah).toLocaleString('id-ID')}</td><td>${esc(w.keterangan)}</td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">👛 Wallet Siswa & Orang Tua</h2><span class="glass px-4 py-2 rounded-xl">Saldo: <b class="text-cyan-300">Rp${saldo.toLocaleString('id-ID')}</b> (${esc(nis)})</span></div>
 <div class="glass rounded-2xl p-4 mb-4 no-print grid md:grid-cols-4 gap-2"><input id="w_jml" type="number" class="input" placeholder="Nominal TopUp"><input id="w_ket" class="input" placeholder="Keterangan"><button id="w_top" class="btn-glow rounded-lg text-sm font-bold">+ TopUp (QRIS/Bank)</button><button id="w_belanja" class="glass rounded-lg text-sm">− Transaksi Kantin Rp15rb</button></div>
 ${tbl(['Tanggal','Jenis','Jumlah','Keterangan'],rows,false)}`;
}
function bindWallet(el,nis){nis=nis||'2425001';
 el.querySelector('#w_top').onclick=()=>{const j=+el.querySelector('#w_jml').value||50000;Store.add('wallet',{nis,jenis:'TopUp',jumlah:j,keterangan:el.querySelector('#w_ket').value||'TopUp QRIS',tanggal:new Date().toISOString().slice(0,10),saldo_akhir:0});Store.log(cur.email,'TopUp',nis+' '+j);renderContent();};
 el.querySelector('#w_belanja').onclick=()=>{Store.add('wallet',{nis,jenis:'Jajan Kantin',jumlah:-15000,keterangan:'QR Kantin',tanggal:new Date().toISOString().slice(0,10)});renderContent();};
}

/* ---- Perpus ---- */
function viewPerpus(){
 const b=Store.all('books').map(x=>`<tr><td class="font-mono">${esc(x.kode)}</td><td><b>${esc(x.judul)}</b><br><span class="text-xs text-slate-400">${esc(x.pengarang)} • ${esc(x.kategori)}</span></td><td>${x.stok}</td><td class="no-print"><button data-pinjam="${x.id}" class="text-cyan-300 text-xs underline">Pinjam</button> <button data-delb="${x.id}" class="text-red-300 text-xs">✕</button></td></tr>`).join('');
 const l=Store.all('loans').map(x=>`<tr><td>${esc(x.nis)}</td><td>${esc(x.nama)}</td><td>${esc(x.buku)}</td><td>${esc(x.pinjam)} → ${esc(x.kembali)}</td><td>${esc(x.status)}${x.denda?' (Rp'+x.denda+')':''}</td><td class="no-print"><button data-kembali="${x.id}" class="text-green-300 text-xs underline">Kembalikan</button></td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">📖 Perpustakaan</h2><button onclick="window.print()" class="glass px-4 py-2 rounded-lg text-sm no-print">🖨 PDF</button></div>
 <div class="glass rounded-2xl p-4 mb-4 no-print grid md:grid-cols-5 gap-2"><input id="b_judul" class="input" placeholder="Judul"><input id="b_peng" class="input" placeholder="Pengarang"><input id="b_kat" class="input" placeholder="Kategori"><input id="b_stok" type="number" class="input" placeholder="Stok"><button id="b_add" class="btn-glow rounded-lg text-sm font-bold">+ Buku</button></div>
 <div class="grid lg:grid-cols-2 gap-4"><div><h3 class="font-bold mb-2">📚 Katalog</h3>${tbl(['Kode','Buku','Stok',''],b,true)}</div><div><h3 class="font-bold mb-2">🔄 Peminjaman & Denda</h3>${tbl(['NIS','Nama','Buku','Periode','Status'],l,true)}</div></div>`;
}
function bindPerpus(el){
 el.querySelector('#b_add').onclick=()=>{const g=id=>el.querySelector(id).value;Store.add('books',{kode:'BK-'+Math.floor(Math.random()*900+100),judul:g('#b_judul')||'Buku Baru',pengarang:g('#b_peng')||'-',kategori:g('#b_kat')||'Umum',stok:+g('#b_stok')||5});renderContent();};
 el.querySelectorAll('[data-delb]').forEach(x=>x.onclick=()=>{Store.remove('books',x.dataset.delb);renderContent();});
 el.querySelectorAll('[data-pinjam]').forEach(x=>x.onclick=()=>{const bk=Store.all('books').find(b=>b.id===x.dataset.pinjam);if(bk.stok<=0){alert('Stok habis');return;}Store.update('books',bk.id,{stok:bk.stok-1});Store.add('loans',{nis:myNIS()||cur.nis||'2425001',nama:cur.nama,buku:bk.judul,pinjam:new Date().toISOString().slice(0,10),kembali:'2026-10-13',status:'Dipinjam',denda:0});renderContent();});
 el.querySelectorAll('[data-kembali]').forEach(x=>x.onclick=()=>{Store.update('loans',x.dataset.kembali,{status:'Kembali'});renderContent();});
}

/* ---- BK ---- */
function viewBK(){
 const rows=Store.all('bk_cases').map(x=>`<tr><td>${esc(x.tanggal)}</td><td>${esc(x.nis)}<br>${esc(x.nama)}</td><td>${esc(x.kategori)}</td><td>${esc(x.catatan)}<br><span class="text-cyan-300 text-xs">↳ ${esc(x.tindak_lanjut)}</span></td><td>${esc(x.status)}</td><td class="no-print"><button data-bkselesai="${x.id}" class="text-green-300 text-xs underline">Selesai</button> <button data-bkdel="${x.id}" class="text-red-300 text-xs">✕</button></td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">🧠 BK & Konseling (Akses Terbatas)</h2><span class="badge bg-violet-500/20 text-violet-200">🔒 Privat & Terenkripsi</span></div>
 <div class="glass rounded-2xl p-4 mb-4 no-print grid md:grid-cols-5 gap-2"><input id="bk_nis" class="input" placeholder="NIS"><input id="bk_nama" class="input" placeholder="Nama"><input id="bk_kat" class="input" placeholder="Kategori"><input id="bk_cat" class="input" placeholder="Catatan"><button id="bk_add" class="btn-glow rounded-lg text-sm font-bold">+ Catatan BK</button></div>
 ${tbl(['Tanggal','Siswa','Kategori','Catatan','Status',''],rows,true)}`;
}
function bindBK(el){
 el.querySelector('#bk_add').onclick=()=>{const g=id=>el.querySelector(id).value;Store.add('bk_cases',{nis:g('#bk_nis')||'2425002',nama:g('#bk_nama')||'Siswa',kategori:g('#bk_kat')||'Konseling',catatan:g('#bk_cat')||'-',tindak_lanjut:'Jadwal konseling',status:'Proses',tanggal:new Date().toISOString().slice(0,10),privat:true});renderContent();};
 el.querySelectorAll('[data-bkselesai]').forEach(x=>x.onclick=()=>{Store.update('bk_cases',x.dataset.bkselesai,{status:'Selesai'});renderContent();});
 el.querySelectorAll('[data-bkdel]').forEach(x=>x.onclick=()=>{Store.remove('bk_cases',x.dataset.bkdel);renderContent();});
}

/* ---- Sarpras ---- */
function viewSarpras(){
 const rows=Store.all('sarpras').map(x=>`<tr><td><b>${esc(x.nama)}</b><br><span class="text-xs text-slate-400">${esc(x.lokasi)}</span></td><td><span class="badge bg-cyan-500/20 text-cyan-300">Lab ${esc(x.lab)}</span></td><td>${x.jumlah}</td><td>${esc(x.kondisi)}</td><td class="no-print"><button data-sdel="${x.id}" class="text-red-300 text-xs">✕</button></td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">🔧 Sarpras & Inventaris (TSM / AKL / TKJ)</h2><button onclick="window.print()" class="glass px-4 py-2 rounded-lg text-sm no-print">🖨 PDF</button></div>
 <div class="glass rounded-2xl p-4 mb-4 no-print grid md:grid-cols-5 gap-2"><input id="s_nama" class="input" placeholder="Nama barang"><select id="s_lab" class="input"><option>TSM</option><option>AKL</option><option>TKJ</option><option>Umum</option></select><input id="s_jml" type="number" class="input" placeholder="Jumlah"><input id="s_kon" class="input" placeholder="Kondisi"><button id="s_add" class="btn-glow rounded-lg text-sm font-bold">+ Barang</button></div>
 ${tbl(['Barang','Lab','Jumlah','Kondisi',''],rows,true)}`;
}
function bindSarpras(el){
 el.querySelector('#s_add').onclick=()=>{const g=id=>el.querySelector(id).value;Store.add('sarpras',{nama:g('#s_nama')||'Barang baru',lab:g('#s_lab'),jumlah:+g('#s_jml')||1,lokasi:'Gudang',kondisi:g('#s_kon')||'Baik',terakhir_cek:new Date().toISOString().slice(0,10)});renderContent();};
 el.querySelectorAll('[data-sdel]').forEach(x=>x.onclick=()=>{Store.remove('sarpras',x.dataset.sdel);renderContent();});
}

/* ---- Komunikasi ---- */
function viewKomunikasi(){
 const m=Store.all('messages').map(x=>`<tr><td>${esc(x.tanggal)}</td><td>${esc(x.dari)}</td><td><b>${esc(x.judul)}</b><br><span class="text-slate-300 text-xs">${esc(x.isi)}</span></td><td class="no-print"><button data-mdel="${x.id}" class="text-red-300 text-xs">✕</button> <button data-wa="${x.id}" class="text-green-300 text-xs underline">WA</button></td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">💬 Komunikasi & Notifikasi</h2><span class="badge bg-green-500/20 text-green-300">WA • Email • SMS • Push</span></div>
 <div class="glass rounded-2xl p-4 mb-4 no-print grid md:grid-cols-4 gap-2"><input id="m_judul" class="input" placeholder="Judul pengumuman"><input id="m_isi" class="input col-span-2" placeholder="Isi pesan…"><button id="m_add" class="btn-glow rounded-lg text-sm font-bold">+ Kirim Pengumuman</button></div>
 ${tbl(['Tanggal','Dari','Pesan',''],m,true)}`;
}
function bindKomunikasi(el){
 el.querySelector('#m_add').onclick=()=>{Store.add('messages',{dari:ROLE_NAME[cur.role]||cur.role,judul:el.querySelector('#m_judul').value||'Info',isi:el.querySelector('#m_isi').value||'-',tanggal:new Date().toISOString().slice(0,10),target:'semua'});Store.add('announcements',{judul:el.querySelector('#m_judul').value||'Info',isi:el.querySelector('#m_isi').value||'-',tanggal:new Date().toISOString().slice(0,10),target:'semua'});renderContent();};
 el.querySelectorAll('[data-mdel]').forEach(x=>x.onclick=()=>{Store.remove('messages',x.dataset.mdel);renderContent();});
 el.querySelectorAll('[data-wa]').forEach(x=>x.onclick=()=>{window.open('https://wa.me/6283822770152?text='+encodeURIComponent('Info SIAKAD YP79'),'blank');});
}

/* ---- Workflow ---- */
function viewWorkflow(){
 const rows=Store.all('approvals').map(x=>`<tr><td>${esc(x.tanggal)}</td><td>${esc(x.jenis)}</td><td>${esc(x.pemohon)}<br><span class="text-xs text-slate-400">${esc(x.detail)}</span></td><td><span class="badge ${x.status==='Disetujui'?'bg-green-500/20 text-green-300':x.status==='Ditolak'?'bg-red-500/20 text-red-300':'bg-yellow-500/20 text-yellow-300'}">${esc(x.status)}</span></td><td class="no-print"><button data-ok="${x.id}" class="text-green-300 text-xs underline">Setujui</button> <button data-no="${x.id}" class="text-red-300 text-xs underline">Tolak</button></td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">✅ Workflow & Approval</h2></div>
 <div class="glass rounded-2xl p-4 mb-4 no-print grid md:grid-cols-4 gap-2"><input id="a_jenis" class="input" placeholder="Jenis (Izin/Barang/…)"><input id="a_det" class="input col-span-2" placeholder="Detail pengajuan…"><button id="a_add" class="btn-glow rounded-lg text-sm font-bold">+ Ajukan</button></div>
 ${tbl(['Tanggal','Jenis','Pemohon & Detail','Status',''],rows,true)}`;
}
function bindWorkflow(el){
 el.querySelector('#a_add').onclick=()=>{Store.add('approvals',{jenis:el.querySelector('#a_jenis').value||'Izin',pemohon:cur.nama,detail:el.querySelector('#a_det').value||'-',status:'Menunggu',tanggal:new Date().toISOString().slice(0,10)});renderContent();};
 el.querySelectorAll('[data-ok]').forEach(x=>x.onclick=()=>{Store.update('approvals',x.dataset.ok,{status:'Disetujui'});renderContent();});
 el.querySelectorAll('[data-no]').forEach(x=>x.onclick=()=>{Store.update('approvals',x.dataset.no,{status:'Ditolak'});renderContent();});
}

/* ---- Analytics / Roles / Keamanan / Dev / Kartu ---- */
function viewAnalytics(){
 const masuk=Store.all('invoices').filter(i=>i.status==='Lunas').reduce((s,i)=>s+ +i.jumlah,0);
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">📈 Analytics & Reports</h2><div class="flex gap-2 no-print"><button id="anCsv" class="glass px-4 py-2 rounded-lg text-sm">⬇ Export Excel (CSV)</button><button onclick="window.print()" class="glass px-4 py-2 rounded-lg text-sm">🖨 Export PDF</button></div></div>
 <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">${[['Siswa',Store.all('users').filter(u=>u.role==='siswa').length],['PPDB',Store.all('ppdb').length],['Kas Masuk','Rp'+masuk.toLocaleString('id-ID')],['Buku',Store.all('books').length]].map(([a,b])=>`<div class="glass rounded-2xl p-5"><div class="text-sm text-slate-300">${a}</div><div class="text-2xl font-extrabold grad-text">${b}</div><div class="h-2 mt-3 rounded-full bg-white/10"><div class="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600" style="width:${40+Math.random()*50}%"></div></div></div>`).join('')}</div>
 <div class="glass rounded-2xl p-5"><h3 class="font-bold mb-2">Dashboard Eksekutif</h3><p class="text-sm text-slate-300">Rekonsiliasi keuangan, tren PPDB, kehadiran, dan sirkulasi perpus terangkum otomatis dari data live di atas. Gunakan Export untuk laporan rapat yayasan / dinas.</p></div>`;
}
function bindAnalytics(el){el.querySelector('#anCsv').onclick=()=>downloadCSV('invoices');}
function viewRoles(){
 const roles=['siswa','ortu','guru','wali','tu','bendahara','bk','kepsek','perpus','sarpas','operator','admin','superadmin','developer','ppdb'];
 const rows=roles.map(r=>{const n=Store.all('users').filter(u=>u.role===r).length;const mods=(MENUS[r]||[]).map(m=>m[1]).join(', ');return `<tr><td><b>${r}</b></td><td>${n} akun</td><td class="text-xs text-slate-300">${esc(mods)}</td></tr>`;}).join('');
 const feats=Store.all('features').map(f=>`<label class="glass rounded-xl px-4 py-3 flex items-center justify-between text-sm"><span>${esc(f.nama)}</span><input type="checkbox" data-feat="${f.id}" ${f.status?'checked':''} class="w-5 h-5 accent-cyan-400"></label>`).join('');
 return `<div class="mb-4"><h2 class="text-xl font-bold font-display">🛡️ Role & Permission Dinamis</h2></div>${tbl(['Role','Akun','Scope Modul'],rows,false)}<h3 class="font-bold mt-4 mb-2">🚩 Feature Flags</h3><div class="grid md:grid-cols-2 gap-2 no-print">${feats}</div>`;
}
function bindRoles(el){el.querySelectorAll('[data-feat]').forEach(c=>c.onchange=()=>{Store.update('features',c.dataset.feat,{status:c.checked});Store.log(cur.email,'FeatureFlag',c.dataset.feat+'='+c.checked);});}
function viewKeamanan(){
 const rows=Store.all('audit').slice(0,50).map(a=>`<tr><td>${esc(a.waktu)}</td><td>${esc(a.user)}</td><td>${esc(a.aksi)}</td><td>${esc(a.detail)}</td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">🔒 Keamanan: 2FA & Audit Log</h2><button id="tfa" class="glass px-4 py-2 rounded-lg text-sm no-print">Aktifkan Simulasi 2FA</button></div>
 <div class="glass rounded-2xl p-4 mb-4 text-sm">Enkripsi data (simulasi AES), multi-tenant per sekolah, dan setiap aksi penting tercatat di bawah. <span class="text-cyan-300">2FA: OTP dikirim via WA 083822770152 (simulasi).</span></div>${tbl(['Waktu','User','Aksi','Detail'],rows,false)}`;
}
function bindKeamanan(el){el.querySelector('#tfa').onclick=()=>{const otp=Math.floor(100000+Math.random()*900000);Store.log(cur.email,'2FA','OTP '+otp+' dikirim');alert('Kode OTP (simulasi): '+otp+' — 2FA aktif!');renderContent();};}
function viewDev(){
 const feats=Store.all('features').map(f=>`<tr><td>${esc(f.nama)}</td><td>${f.status?'🟢 ON':'🔴 OFF'}</td><td class="no-print"><button data-tgl="${f.id}" class="text-cyan-300 text-xs underline">Toggle</button></td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-bold font-display">🧑‍💻 Developer Control Panel</h2><div class="flex gap-2 no-print"><label class="glass px-3 py-2 rounded-lg text-xs flex items-center gap-2">Preview Mode <input type="checkbox" checked class="accent-cyan-400"></label><button id="rollback" class="glass px-4 py-2 rounded-lg text-sm">↩ Versioning & Rollback</button></div></div>
 <div class="grid md:grid-cols-3 gap-3 mb-4">${['Portal Manager','Menu Builder','Dashboard Builder','Form Builder','Workflow Builder','Notification Builder','Theme & Branding','API & Webhook','System Monitor'].map(x=>`<div class="glass rounded-2xl p-4 card-hover"><div class="font-bold text-sm">${x}</div><div class="text-xs text-slate-400">Integrasi: Payment Gateway • WA • Email • SMS • RFID • QR • Face • QRIS/Bank</div><button data-mod="${x}" class="mt-2 text-cyan-300 text-xs underline">Buka Builder</button></div>`).join('')}</div>
 <h3 class="font-bold mb-2">Integrasi & Ekosistem</h3><div class="flex flex-wrap gap-2 mb-4">${['Payment Gateway','WhatsApp Gateway','Email Service','SMS Gateway','RFID','QR Code','Face Recognition','Bank / QRIS','API & Webhook'].map(x=>`<span class="glass px-3 py-1.5 rounded-full text-xs">🔌 ${x} <b class="text-green-300">●</b></span>`).join('')}</div>
 <h3 class="font-bold mb-2">Feature Flags</h3>${tbl(['Fitur','Status',''],feats,true)}`;
}
function bindDev(el){
 el.querySelectorAll('[data-mod]').forEach(b=>b.onclick=()=>alert(b.dataset.mod+' (simulasi builder): drag-and-drop config tersimpan ke localStorage.'));
 el.querySelectorAll('[data-tgl]').forEach(b=>b.onclick=()=>{const f=Store.all('features').find(x=>x.id===b.dataset.tgl);Store.update('features',f.id,{status:!f.status});renderContent();});
 el.querySelector('#rollback').onclick=()=>{if(confirm('Rollback ke seed awal?')){Store.reset();location.reload();}};
}
function viewKartu(u){
 let p=null;
 if(u.role==='ppdb')p=Store.all('ppdb').find(x=>x.email===u.email);
 else if(u.role==='siswa'){const pp=Store.all('ppdb').find(x=>x.email===u.email);p=pp||{no:'PPDB- lama',nama:u.nama,jurusan:u.jurusan||'TKJ',status:'LULUS',tanggal:'-'};}
 else p=Store.all('ppdb')[0];
 const pelajar={nis:u.nis||'2425001',nama:u.nama||(p&&p.nama)||'-',kelas:u.kelas||'X',jurusan:(p&&p.jurusan)||u.jurusan||'TKJ'};
 return `<div class="mb-4"><h2 class="text-xl font-bold font-display">🪪 Kartu PPDB & Kartu Pelajar</h2></div>
 <div class="grid md:grid-cols-2 gap-4">
 <div class="print-card rounded-2xl p-6 text-slate-900"><div class="font-extrabold text-center">KARTU PPDB<br><span class="text-sm font-normal">SMK YP.79 MAJALAYA</span></div><hr class="my-2">Nama: <b>${esc(p?p.nama:'-')}</b><br>No: <b>${esc(p?p.no:'-')}</b><br>Status: <b>${esc(p?p.status:'-')}</b><div class="no-print mt-3"><button onclick="window.print()" class="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">🖨 Cetak Kartu PPDB</button></div></div>
 <div class="rounded-2xl p-6 text-white" style="background:linear-gradient(135deg,#0ea5e9,#7928ca)"><div class="font-extrabold text-center">KARTU PELAJAR<br><span class="text-sm font-normal">SMK YP.79 • NIS ${esc(pelajar.nis)}</span></div><hr class="my-2 border-white/30"><div class="flex gap-4 items-center"><div class="w-16 h-20 bg-white/20 rounded-lg flex items-center justify-center text-3xl">🧑</div><div>Nama: <b>${esc(pelajar.nama)}</b><br>Kelas: ${esc(pelajar.kelas)} • ${esc(pelajar.jurusan)}<br><span class="font-mono text-xs">QR: YP79-${esc(pelajar.nis)}</span></div></div><div class="no-print mt-3"><button onclick="window.print()" class="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold">🖨 Cetak Kartu Pelajar</button>${['tu','operator','admin','superadmin'].includes(u.role)?' <span class="text-xs">+ pendaftaran kartu susulan tersedia via menu PPDB</span>':''}</div></div>
 </div>`;
}
function bindKartu(){}
})();
