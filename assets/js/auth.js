/* Auth multi-role + PPDB login */
(function(){
const SKEY='siakad_yp79_session';
window.Auth={
 login(email,password){
  const u=Store.db.users.find(x=>x.email.toLowerCase()===String(email).toLowerCase().trim()&&x.password===password);
  if(u){localStorage.setItem(SKEY,JSON.stringify({uid:u.id}));Store.log(u.email,'Login',u.role+' login berhasil');return {ok:true,user:u};}
  // allow PPDB login via No.Pendaftaran
  const p=(Store.db.ppdb||[]).find(x=>x.no.toLowerCase()===String(email).toLowerCase().trim()&&x.password===password);
  if(p){let user=Store.db.users.find(x=>x.email===p.email);if(!user){user={id:'u-'+p.no,role:'ppdb',nama:p.nama,email:p.email,password:p.password,no_pendaftaran:p.no};Store.db.users.push(user);Store.save();}localStorage.setItem(SKEY,JSON.stringify({uid:user.id}));Store.log(p.email,'Login PPDB',p.no);return {ok:true,user:user};}
  return {ok:false,msg:'Email / No. Pendaftaran atau password salah.'};
 },
 registerPPDB(data){return data;},
 logout(){try{const c=this.current();if(c)Store.log(c.email,'Logout','');}catch(e){}localStorage.removeItem(SKEY);location.href='app.html';},
 current(){try{const s=JSON.parse(localStorage.getItem(SKEY));if(!s)return null;return Store.db.users.find(x=>x.id===s.uid)||null;}catch(e){return null;}}
};
window.DEMO_ACCOUNTS=[
 ['Siswa','siswa@siswa.yp79','siswa123'],['Orang Tua','ortu@ortu.yp79','ortu123'],
 ['Guru','guru@guru.yp79','guru123'],['Wali Kelas','wali@wali.yp79','wali123'],
 ['TU','tu@tu.yp79','tu123'],['Bendahara','bendahara@bendahara.yp79','bendahara123'],
 ['BK','bk@bk.yp79','bk123'],['Kepala Sekolah','kepsek@kepsek.yp79','kepsek123'],
 ['Perpustakaan','perpus@perpus.yp79','perpus123'],['Sarpas','sarpas@sarpas.yp79','sarpas123'],
 ['Operator','operator@operator.yp79','operator123'],['Admin Sekolah','admin@admin.yp79','admin123'],
 ['Super Admin','superadmin@super.yp79','super123'],['Developer','dev@dev.yp79','dev123'],
 ['Calon Siswa PPDB','calon@ppdb.yp79 / PPDB-2026-0001','ppdb123']
];
})();
