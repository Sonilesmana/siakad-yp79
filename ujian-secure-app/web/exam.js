/* =====================================================================
 * Ujian Secure — exam.js (semua anti-cheat AKTIF, terhubung violation-log)
 * =====================================================================
 * Blokir aktif: klik kanan, copy/cut/paste, Ctrl+C/V/X/P/S/U, F12,
 * Ctrl+Shift+I/J/K, Alt+Tab deteksi (blur+visibilitychange),
 * fullscreen-exit (max 3x = auto-submit), resize/split-screen,
 * watermark bergerak, timer server-synced, acak soal+opsi,
 * offline queue (localStorage), violation-log (localStorage + POST).
 * Face-check: PLACEHOLDER jujur (status NOT_ENFORCED).
 * ===================================================================== */
(function () {
  'use strict';

  var MAX_VIOLATIONS = 3;
  var LS = { viol: 'us_violations', ans: 'us_answers', exam: 'us_exam', queue: 'us_queue' };

  var state = {
    serverBase: '', token: '', identity: '', deviceId: '',
    exam: null, questions: [], order: [], answers: {},
    current: 0, violations: [], submitted: false, started: false,
    serverOffsetMs: 0, timerId: null, wmId: null, faceTimer: null
  };

  /* ---------- util ---------- */
  function $(id) { return document.getElementById(id); }
  function nowISO() { return new Date().toISOString(); }
  function load(k, fb) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function shuffle(a) {
    // Fisher-Yates dengan Math.random (acak tampilan; penilaian via label di server)
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function deviceId() {
    var d = load('us_device', null);
    if (!d) {
      d = 'web-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      save('us_device', d);
    }
    return d;
  }
  function msg(t) { $('login-msg').textContent = t || ''; }

  /* ---------- violation log: localStorage + siap POST ---------- */
  function logViolation(type, detail) {
    if (state.submitted) return;
    var ev = { type: type, at: nowISO(), detail: String(detail || '') };
    state.violations.push(ev);
    save(LS.viol, state.violations);
    updateBadge();
    flushViolations(false); // best-effort POST, gagal = tetap di localStorage
    var n = state.violations.length;
    if (n === 1) warn('⚠️ Pelanggaran 1/3: ' + type + '. Kembali ke ujian!');
    else if (n === 2) warn('⛔ Pelanggaran 2/3: ' + type + '. Satu lagi = OTOMATIS DIKUMPULKAN.');
    else if (n >= MAX_VIOLATIONS) autoSubmit('CHEAT_SUSPECT: ' + type);
  }
  function updateBadge() {
    $('viol-badge').textContent = '⚠️ ' + state.violations.length + '/' + MAX_VIOLATIONS;
  }
  function flushViolations(force) {
    if (!state.serverBase || !state.token) return;
    if (!navigator.onLine && !force) return;
    if (!state.violations.length) return;
    // Kirim salinan; server yang menilai strike resmi. Local copy tetap disimpan.
    fetch(state.serverBase.replace(/\/$/, '') + '/api/exam/violation-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.token },
      body: JSON.stringify({ exam_id: state.exam ? state.exam.exam_id : null, events: state.violations })
    }).catch(function () { /* offline: tetap di localStorage */ });
  }

  var warnTimer = null;
  function warn(t) {
    var n = $('q-number'); if (!n) return;
    var d = document.createElement('div');
    d.className = 'warn-toast'; d.textContent = t;
    d.style.cssText = 'background:#7c2d12;color:#fff;padding:10px;border-radius:8px;margin-bottom:10px;font-weight:700;';
    n.parentNode.insertBefore(d, n.nextSibling);
    clearTimeout(warnTimer);
    warnTimer = setTimeout(function () { d.remove(); }, 4000);
  }

  /* ---------- fullscreen wajib ---------- */
  function enterFullscreen() {
    var el = document.documentElement;
    try {
      if (el.requestFullscreen) return el.requestFullscreen();
      if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    } catch (e) {}
    return Promise.resolve();
  }
  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  document.addEventListener('fullscreenchange', function () {
    if (!state.started || state.submitted) return;
    if (!isFullscreen()) logViolation('FULLSCREEN_EXIT', 'count=' + (state.violations.length + 1));
  });

  /* ---------- deteksi keluar / tab-switch / split-screen ---------- */
  document.addEventListener('visibilitychange', function () {
    if (!state.started || state.submitted) return;
    if (document.hidden) logViolation('BLUR', 'visibilitychange:hidden');
  });
  window.addEventListener('blur', function () {
    if (!state.started || state.submitted) return;
    logViolation('FOCUS_LOSS', 'window.blur (Alt+Tab / pindah app)');
  });
  // Split-screen / resize / rotate tiba-tiba
  var lastW = window.innerWidth, lastH = window.innerHeight;
  var resizeT = null;
  window.addEventListener('resize', function () {
    if (!state.started || state.submitted) return;
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      var dw = Math.abs(window.innerWidth - lastW), dh = Math.abs(window.innerHeight - lastH);
      lastW = window.innerWidth; lastH = window.innerHeight;
      if (dw > 200 || dh > 200) logViolation('RESIZE_SPLIT', 'resize dw=' + dw + ' dh=' + dh);
    }, 600);
  });

  /* ---------- blokir klik kanan / copy / shortcut / devtools ---------- */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    if (state.started) logViolation('CONTEXTMENU_BLOCKED', 'right-click');
  });
  document.addEventListener('copy', function (e) {
    e.preventDefault();
    if (state.started) logViolation('COPY_ATTEMPT', 'copy');
  });
  document.addEventListener('cut', function (e) {
    e.preventDefault();
    if (state.started) logViolation('COPY_ATTEMPT', 'cut');
  });
  document.addEventListener('paste', function (e) {
    e.preventDefault();
    if (state.started) logViolation('COPY_ATTEMPT', 'paste');
  });
  document.addEventListener('selectstart', function (e) {
    if (state.started) e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });

  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    var ctrl = e.ctrlKey || e.metaKey;
    var blocked =
      e.key === 'F12' ||
      (ctrl && ['c', 'v', 'x', 'p', 's', 'u'].indexOf(k) >= 0) ||
      (ctrl && e.shiftKey && ['i', 'j', 'k', 'c'].indexOf(k) >= 0) ||
      (e.altKey && k === 'tab') ||
      (e.altKey && k === 'f4');
    if (blocked) {
      e.preventDefault(); e.stopPropagation();
      if (state.started) {
        var name = (ctrl ? 'ctrl+' : '') + (e.shiftKey ? 'shift+' : '') + (e.altKey ? 'alt+' : '') + (e.key === 'F12' ? 'F12' : k);
        logViolation(e.key === 'F12' || (ctrl && e.shiftKey) ? 'DEVTOOLS_ATTEMPT' : 'SHORTCUT_BLOCKED', name);
      }
      return false;
    }
    // PrintScreen (tidak bisa dicegah penuh di web — catat sebagai pelanggaran)
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      if (state.started) logViolation('SHORTCUT_BLOCKED', 'PrintScreen');
    }
  }, true);

  // Blokir back-button / navigasi terkunci
  history.pushState({ lockdown: true }, '');
  window.addEventListener('popstate', function () {
    history.pushState({ lockdown: true }, '');
    if (state.started && !state.submitted) warn('Navigasi back diblokir selama ujian.');
  });
  window.addEventListener('beforeunload', function (e) {
    if (state.started && !state.submitted) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- watermark identitas bergerak ---------- */
  function startWatermark() {
    var wm = $('watermark');
    function paint() {
      var t = new Date().toLocaleTimeString('id-ID');
      wm.textContent = (state.identity || 'PESERTA') + ' • ' + t + ' • ' +
                       (state.identity || 'PESERTA') + ' • ' + t;
    }
    paint();
    var x = 20, y = 120, dx = 1.2, dy = 0.8;
    clearInterval(state.wmId);
    state.wmId = setInterval(function () {
      paint();
      x += dx; y += dy;
      if (x > 220 || x < 0) dx = -dx;
      if (y > 420 || y < 40) dy = -dy;
      wm.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(-18deg)';
    }, 120);
  }

  /* ---------- face-check PLACEHOLDER (jujur: tidak enforced) ---------- */
  // Tidak ada klaim verifikasi wajah. Interval ini hanya mencatat status
  // agar integrasi kamera di masa depan punya hook — tidak memblokir ujian.
  function startFaceCheckPlaceholder() {
    clearInterval(state.faceTimer);
    state.faceTimer = setInterval(function () {
      if (!state.started || state.submitted) return;
      // Sengaja TIDAK menambah strike. Hanya jejak debug lokal.
      try { console.info('[face-check] status=NOT_ENFORCED at ' + nowISO()); } catch (e) {}
    }, 60000);
  }

  /* ---------- timer server-synced ---------- */
  function serverNow() { return Date.now() + state.serverOffsetMs; }
  function startTimer() {
    clearInterval(state.timerId);
    function tick() {
      if (!state.exam || state.submitted) return;
      var end = new Date(state.exam.end_at).getTime();
      var left = Math.max(0, end - serverNow());
      var h = Math.floor(left / 3600000), m = Math.floor(left % 3600000 / 60000), s = Math.floor(left % 60000 / 1000);
      var el = $('timer');
      el.textContent = ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
      el.classList.toggle('low', left < 5 * 60000);
      if (left <= 0) autoSubmit('TIME_UP');
    }
    tick();
    state.timerId = setInterval(tick, 1000);
  }

  /* ---------- soal: fetch → cache → acak ---------- */
  var FALLBACK_QUESTIONS = [
    { id: 'lat1', teks: 'Hasil dari 12 × 8 − 20 adalah…', opsi: ['76', '86', '96', '106'] },
    { id: 'lat2', teks: 'FPB dari 24 dan 36 adalah…', opsi: ['6', '12', '18', '24'] },
    { id: 'lat3', teks: 'Luas persegi dengan sisi 9 cm adalah… cm²', opsi: ['72', '81', '90', '99'] }
  ];

  function loadQuestions() {
    var url = state.serverBase.replace(/\/$/, '') + '/api/exam/questions?exam_id=' + encodeURIComponent($('in-token').dataset.examId || state.examId || '');
    // Coba server; gagal/offline → cache → fallback lokal (mode latihan, ditandai)
    return fetch(url, { headers: { 'Authorization': 'Bearer ' + state.token, 'X-Device-Id': state.deviceId } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        state.exam = data.exam;
        state.serverOffsetMs = new Date(data.exam.server_now).getTime() - Date.now();
        state.questions = data.questions;
        save(LS.exam, { exam: data.exam, questions: data.questions });
        return false; // bukan offline
      })
      .catch(function () {
        var c = load(LS.exam, null);
        if (c && c.questions) {
          state.exam = c.exam; state.questions = c.questions;
          logViolation('OFFLINE_QUEUE', 'soal dari cache lokal');
          return true;
        }
        // Fallback latihan agar UI tetap bisa dipakai tanpa server
        state.exam = {
          exam_id: 'LATIHAN-LOKAL', title: 'Latihan (offline)',
          end_at: new Date(Date.now() + 30 * 60000).toISOString(),
          server_now: nowISO()
        };
        state.examId = 'LATIHAN-LOKAL';
        state.questions = FALLBACK_QUESTIONS;
        return true;
      })
      .then(function (offline) {
        // Acak urutan soal & opsi per peserta
        state.order = shuffle(state.questions.map(function (q, i) { return i; }));
        state.questions.forEach(function (q) {
          q._shuffled = shuffle(q.opsi.map(function (o, i) { return { label: o, orig: i }; }));
        });
        state.answers = load(LS.ans, {});
        return offline;
      });
  }

  /* ---------- render ---------- */
  function render() {
    var idx = state.order[state.current];
    var q = state.questions[idx];
    $('q-number').textContent = 'Soal ' + (state.current + 1) + ' / ' + state.questions.length;
    $('q-text').textContent = q.teks;
    var box = $('q-options'); box.innerHTML = '';
    var letters = ['A', 'B', 'C', 'D', 'E'];
    q._shuffled.forEach(function (o, si) {
      var b = document.createElement('button');
      b.className = 'opt' + (state.answers[q.id] === o.label ? ' picked' : '');
      b.textContent = letters[si] + '. ' + o.label;
      b.onclick = function () {
        state.answers[q.id] = o.label;
        save(LS.ans, state.answers);
        queueAnswer(q.id, o.label, si);
        render();
      };
      box.appendChild(b);
    });
    // Nav nomor
    var nav = $('qnav'); nav.innerHTML = '';
    state.order.forEach(function (qi, i) {
      var qq = state.questions[qi];
      var b = document.createElement('button');
      b.textContent = (i + 1);
      if (state.answers[qq.id] !== undefined && state.answers[qq.id] !== null) b.className = 'answered';
      if (i === state.current) b.className += ' current';
      b.onclick = function () { state.current = i; render(); };
      nav.appendChild(b);
    });
    var done = Object.keys(state.answers).length;
    $('progress-fill').style.width = Math.round(done / state.questions.length * 100) + '%';
    $('exam-title').textContent = state.exam ? state.exam.title : 'Ujian';
  }

  /* ---------- offline queue jawaban ---------- */
  function queueAnswer(qid, label, shownIdx) {
    var q = load(LS.queue, []);
    q.push({ question_id: qid, option_label: label, option_index_shown: shownIdx, at: nowISO() });
    save(LS.queue, q);
  }

  /* ---------- submit ---------- */
  function collectPayload(auto) {
    return {
      exam_id: state.exam ? state.exam.exam_id : state.examId,
      client_saved_at: nowISO(),
      auto_submit: !!auto,
      violation_count: state.violations.length,
      answers: state.questions.map(function (q) {
        var si = q._shuffled.findIndex(function (o) { return o.label === state.answers[q.id]; });
        return {
          question_id: q.id,
          option_index_shown: si >= 0 ? si : null,
          option_label: state.answers[q.id] !== undefined ? state.answers[q.id] : null
        };
      })
    };
  }
  function doSubmit(auto, reason) {
    if (state.submitted) return;
    state.submitted = true;
    clearInterval(state.timerId); clearInterval(state.wmId); clearInterval(state.faceTimer);
    flushViolations(true);
    var payload = collectPayload(auto);
    function finish(ok, info) {
      showScreen('screen-done');
      $('done-title').textContent = auto ? 'Ujian dikumpulkan otomatis' : 'Jawaban terkumpul';
      $('done-msg').textContent = auto
        ? 'Alasan: ' + reason + '. Pelanggaran: ' + state.violations.length + '/' + MAX_VIOLATIONS + '.'
        : 'Terima kasih. Nilai diumumkan via SIAKAD (bukan di HP ini).';
      $('done-detail').textContent = JSON.stringify({ status: ok ? 'submitted' : 'queued-offline', info: info, violations: state.violations }, null, 2);
      if (document.exitFullscreen && isFullscreen()) { try { document.exitFullscreen(); } catch (e) {} }
    }
    if (!navigator.onLine || !state.serverBase || state.examId === 'LATIHAN-LOKAL') {
      save('us_pending_submit', payload); // antre, dikirim saat online
      if (auto) logViolationSilent('AUTO_SUBMIT', reason + ' (offline, antre)');
      finish(false, 'offline — jawaban antre di HP, terkirim otomatis saat online');
      return;
    }
    fetch(state.serverBase.replace(/\/$/, '') + '/api/exam/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.token, 'X-Device-Id': state.deviceId },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json().catch(function () { return { status: r.status }; }); })
      .then(function (j) { localStorage.removeItem(LS.ans); localStorage.removeItem(LS.queue); finish(true, j); })
      .catch(function () { save('us_pending_submit', payload); finish(false, 'server tak terjangkau — antre offline'); });
  }
  function logViolationSilent(t, d) {
    state.violations.push({ type: t, at: nowISO(), detail: String(d || '') });
    save(LS.viol, state.violations);
  }
  function autoSubmit(reason) {
    logViolationSilent('AUTO_SUBMIT', reason);
    updateBadge();
    doSubmit(true, reason);
  }

  // Flush antrean saat kembali online
  window.addEventListener('online', function () {
    $('net-badge').textContent = '🟢 online';
    flushViolations(true);
    var p = load('us_pending_submit', null);
    if (p && state.serverBase && state.token && !state.submitted) {
      fetch(state.serverBase.replace(/\/$/, '') + '/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.token, 'X-Device-Id': state.deviceId },
        body: JSON.stringify(p)
      }).then(function () { localStorage.removeItem('us_pending_submit'); }).catch(function () {});
    }
  });
  window.addEventListener('offline', function () {
    $('net-badge').textContent = '🔴 offline (antre)';
    if (state.started) logViolationSilent('OFFLINE_QUEUE', 'koneksi putus, jawaban antre lokal');
  });

  /* ---------- start ---------- */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
    $(id).classList.add('active');
  }

  $('btn-start').addEventListener('click', function () {
    state.serverBase = $('in-server').value.trim();
    state.token = $('in-token').value.trim();
    state.identity = $('in-name').value.trim() || 'PESERTA';
    state.deviceId = deviceId();
    state.violations = load(LS.viol, []);
    // exam_id didekode dari token bila format EXAMID.RANDOM (konvensi bantu); selain itu ditanya server
    var parts = state.token.split('.');
    state.examId = parts.length > 1 ? parts[0] : state.token;
    if (!state.token) { msg('Token wajib diisi.'); return; }
    msg('Menghubungi server…');
    loadQuestions().then(function () {
      state.started = true;
      showScreen('screen-exam');
      updateBadge();
      render();
      startTimer();
      startWatermark();
      startFaceCheckPlaceholder();
      enterFullscreen();
      if (state.examId === 'LATIHAN-LOKAL') warn('Mode latihan offline — hubungkan server untuk ujian resmi.');
    });
  });

  $('btn-prev').addEventListener('click', function () {
    if (state.current > 0) { state.current--; render(); }
  });
  $('btn-next').addEventListener('click', function () {
    if (state.current < state.order.length - 1) { state.current++; render(); }
  });
  $('btn-finish').addEventListener('click', function () {
    var un = state.questions.filter(function (q) { return state.answers[q.id] === undefined; }).length;
    var ok = un === 0 ? true : confirm('Masih ada ' + un + ' soal kosong. Kumpulkan sekarang?');
    if (ok) doSubmit(false, 'manual');
  });
})();
