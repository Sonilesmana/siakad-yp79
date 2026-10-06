/* Supabase client opsional — localStorage tetap default agar demo langsung jalan.
   Isi URL + anon key via menu Profil → Pengaturan Supabase (tersimpan di localStorage).
   Jika terisi, tombol "Sync ke Supabase" mengirim seluruh DB lokal ke tabel Supabase (upsert). */
(function () {
  var LS_KEY = 'siakad_sb_config';
  function cfg() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      if (window.__ENV) {
        s.url = s.url || window.__ENV.SUPABASE_URL;
        s.key = s.key || window.__ENV.SUPABASE_ANON_KEY;
      }
      return s;
    } catch (e) { return {}; }
  }
  function saveCfg(url, key) { localStorage.setItem(LS_KEY, JSON.stringify({ url: url, key: key })); }
  function client() {
    var c = cfg();
    if (!c.url || !c.key || !window.supabase) return null;
    if (!window._sb || window._sbUrl !== c.url) {
      window._sb = window.supabase.createClient(c.url, c.key);
      window._sbUrl = c.url;
    }
    return window._sb;
  }
  var MAP = { wallet: 'wallet_tx', audit: 'audit_log' };
  var COLS = ['users','ppdb','announcements','jadwal','absensi','materi','tugas','ujian',
    'nilai','invoices','wallet','books','loans','bk_cases','sarpras','messages','approvals','audit','features'];
  function table(col) { return MAP[col] || col; }
  window.SB = {
    isConfigured: function () { var c = cfg(); return !!(c.url && c.key); },
    getConfig: cfg, saveConfig: saveCfg, client: client,
    async syncAll() {
      var sb = client();
      if (!sb) throw new Error('Supabase belum dikonfigurasi.');
      var report = [];
      for (var i = 0; i < COLS.length; i++) {
        var col = COLS[i], rows = (Store.db[col] || []).slice();
        if (!rows.length) { report.push(col + ': 0 (kosong)'); continue; }
        // kirim per batch 100
        for (var s = 0; s < rows.length; s += 100) {
          var batch = rows.slice(s, s + 100).map(function (r) {
            var c = Object.assign({}, r);
            if (col === 'audit') { c.user = r.user; }
            return c;
          });
          var res = await sb.from(table(col)).upsert(batch, { onConflict: 'id' });
          if (res.error) throw new Error(col + ': ' + res.error.message);
        }
        report.push(col + ': ' + rows.length + ' OK');
      }
      return report;
    },
    async pullAll() {
      var sb = client();
      if (!sb) throw new Error('Supabase belum dikonfigurasi.');
      for (var i = 0; i < COLS.length; i++) {
        var col = COLS[i];
        var res = await sb.from(table(col)).select('*').limit(2000);
        if (res.error) throw new Error(col + ': ' + res.error.message);
        var rows = res.data || [];
        // kembalikan nama kolom audit.user
        Store.db[col] = rows;
      }
      Store.save();
      return true;
    }
  };
})();
