import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, doc,
  onSnapshot, addDoc, updateDoc, deleteDoc,
  getDoc, query, orderBy, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhC_ppeMTRonAEZK1tyaSYXbFNvC7aCJQ",
  authDomain: "futsal-ppi.firebaseapp.com",
  projectId: "futsal-ppi",
  storageBucket: "futsal-ppi.firebasestorage.app",
  messagingSenderId: "277761250199",
  appId: "1:277761250199:web:2af9e816f42222b02baad2"
};

const DEFAULT_LOCATION = "Nagoya University Futsal Court";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gamesCol = collection(db, "games");
const announcementsCol = collection(db, "announcements");

const T = {
  id: {
    title: "Pertandingan Futsal",
    org: "diselenggarakan oleh PPIJ Nagoya",
    orgSub: "(Perhimpunan Pelajar Indonesia — Nagoya)",
    announcements: "Pengumuman",
    upcoming: "Jadwal Pertandingan",
    past: "Pertandingan Lalu",
    tapToJoin: "Pilih pertandingan untuk daftar atau cek lineup",
    noUpcoming: "Belum ada pertandingan terjadwal. Minta admin untuk menambahkan!",
    noPast: "Belum ada pertandingan yang selesai.",
    gameDay: "Hari Pertandingan",
    imPlaying: "⚡ Saya Ikut Main",
    seeWhosComing: "👀 Lihat Yang Datang",
    back: "← Kembali",
    backToMatches: "← Kembali ke Jadwal",
    imIn: "Saya Ikut!",
    addToLineup: "Tambah Nama ke Lineup →",
    yourName: "Nama Kamu",
    namePlaceholder: "cth. Budi",
    emailLbl: "Email",
    emailOpt: "(opsional)",
    emailPlaceholder: "cth. budi@email.com",
    emailCopied: "Email disalin! 📋",
    subscribers: "Subscriber Email",
    noSubscribers: "Belum ada email terkumpul.",
    copyAll: "Salin Semua Email",
    lineup: "Lineup",
    playersReady: function(n) { return n + " pemain siap bermain"; },
    signedUp: "pemain daftar",
    spotsLeft: function(n) { return n + " tempat tersisa"; },
    registrationFull: "🔒 Pendaftaran penuh!",
    date: "Tanggal",
    kickoff: "Waktu",
    location: "Lokasi",
    squad: "Pemain",
    days: "Hari",
    hours: "Jam",
    mins: "Menit",
    secs: "Detik",
    noPlayers: "BELUM ADA PEMAIN",
    registrationClosed: "🔒 Pendaftaran ditutup untuk pertandingan ini",
    pastMatch: "⏱ Pertandingan ini sudah selesai",
    finalLineup: "Lineup Akhir",
    finalSub: function(n) { return n + " pemain hadir"; },
    adminAccess: "Akses Admin",
    password: "Password",
    passwordPlaceholder: "Masukkan password admin",
    enter: "Masuk",
    cancel: "Batal",
    wrongPassword: "Password salah. Coba lagi.",
    checking: "Memeriksa...",
    addMatch: "Tambah Pertandingan Baru",
    addMatchBtn: "+ Tambah Pertandingan",
    scheduledMatches: "Jadwal Pertandingan",
    noMatches: "Belum ada pertandingan.",
    players: "Pemain",
    noPlayersYet: "Belum ada pemain yang daftar.",
    exitAdmin: "← Keluar Admin",
    lock: "Kunci",
    unlock: "Buka",
    del: "Hapus",
    remove: "Hapus",
    edit: "Edit",
    save: "Simpan",
    matchAdded: "Pertandingan ditambahkan! ✅",
    matchDeleted: "Pertandingan dihapus",
    matchUpdated: "Pertandingan diperbarui! ✅",
    lockMsg: "Pendaftaran dikunci 🔒",
    unlockMsg: "Pendaftaran dibuka ✅",
    autoLocked: "Batas pemain tercapai, pendaftaran dikunci otomatis 🔒",
    pickDate: "Pilih tanggal dulu!",
    enterName: "Masukkan namamu!",
    alreadyIn: "Kamu sudah terdaftar! 🎉",
    added: function(n) { return n + " ditambahkan ke lineup! ⚽"; },
    removed: function(n) { return n + " dihapus"; },
    errorRetry: "Error — coba lagi",
    deleteConfirm: "Hapus pertandingan ini dan semua pemainnya?",
    deleteAnnouncementConfirm: "Hapus pengumuman ini?",
    vibeCredit: "vibe-coded oleh Alba",
    adminPanel: "Panel Admin",
    dateLbl: "Tanggal",
    timeLbl: "Mulai",
    endTimeLbl: "Selesai",
    locationLbl: "Lokasi",
    locationPlaceholder: "cth. Nagoya University Futsal Court",
    playerLimit: "Batas Pemain (Auto-Lock)",
    playerLimitDesc: "Pendaftaran otomatis dikunci jika jumlah pemain mencapai batas ini. Kosongkan untuk nonaktifkan.",
    playerLimitSaved: "Batas pemain disimpan! ✅",
    playerLimitCleared: "Batas pemain dinonaktifkan",
    saveLimitBtn: "Simpan Batas",
    manageAnnouncements: "Kelola Pengumuman",
    addAnnouncement: "+ Tambah Pengumuman",
    announcementTitle: "Judul",
    announcementDesc: "Deskripsi",
    announcementTitlePlaceholder: "cth. Ganti lapangan minggu ini",
    announcementDescPlaceholder: "Tulis detail pengumuman di sini...",
    pinned: "📌 Disematkan",
    pin: "Sematkan",
    unpin: "Lepas Sematan",
    announcementAdded: "Pengumuman ditambahkan! 📢",
    announcementDeleted: "Pengumuman dihapus",
    noAnnouncements: "Belum ada pengumuman.",
    enterTitle: "Masukkan judul pengumuman!",
    enterDesc: "Masukkan deskripsi pengumuman!",
  },
  en: {
    title: "Futsal Match",
    org: "organized by PPIJ Nagoya",
    orgSub: "(Indonesian Student Association in Nagoya)",
    announcements: "Announcements",
    upcoming: "Upcoming Matches",
    past: "Past Matches",
    tapToJoin: "Tap a match to sign up or check the lineup",
    noUpcoming: "No matches scheduled yet. Ask your admin to add one!",
    noPast: "No past matches yet.",
    gameDay: "Game Day",
    imPlaying: "⚡ I'm Playing",
    seeWhosComing: "👀 See Who's Coming",
    back: "← Back",
    backToMatches: "← Back to Matches",
    imIn: "I'm In",
    addToLineup: "Add Me to the Lineup →",
    yourName: "Your Name",
    namePlaceholder: "e.g. Budi",
    emailLbl: "Email",
    emailOpt: "(optional)",
    emailPlaceholder: "e.g. budi@email.com",
    emailCopied: "Emails copied! 📋",
    subscribers: "Email Subscribers",
    noSubscribers: "No emails collected yet.",
    copyAll: "Copy All Emails",
    lineup: "Lineup",
    playersReady: function(n) { return n + " player" + (n !== 1 ? "s" : "") + " ready to play"; },
    signedUp: "signed up",
    spotsLeft: function(n) { return n + " spot" + (n !== 1 ? "s" : "") + " left"; },
    registrationFull: "🔒 Registration is full!",
    date: "Date",
    kickoff: "Time",
    location: "Location",
    squad: "Squad",
    days: "Days",
    hours: "Hours",
    mins: "Mins",
    secs: "Secs",
    noPlayers: "NO PLAYERS YET",
    registrationClosed: "🔒 Registration is closed for this match",
    pastMatch: "⏱ This match has already taken place",
    finalLineup: "Final Lineup",
    finalSub: function(n) { return n + " player" + (n !== 1 ? "s" : "") + " attended"; },
    adminAccess: "Admin Access",
    password: "Password",
    passwordPlaceholder: "Enter admin password",
    enter: "Enter",
    cancel: "Cancel",
    wrongPassword: "Wrong password. Try again.",
    checking: "Checking...",
    addMatch: "Add New Match",
    addMatchBtn: "+ Add Match",
    scheduledMatches: "Scheduled Matches",
    noMatches: "No matches yet.",
    players: "Players",
    noPlayersYet: "No players signed up yet.",
    exitAdmin: "← Exit Admin",
    lock: "Lock",
    unlock: "Unlock",
    del: "Del",
    remove: "Remove",
    edit: "Edit",
    save: "Save",
    matchAdded: "Match added! ✅",
    matchDeleted: "Match deleted",
    matchUpdated: "Match updated! ✅",
    lockMsg: "Registration locked 🔒",
    unlockMsg: "Registration open ✅",
    autoLocked: "Player limit reached, registration auto-locked 🔒",
    pickDate: "Pick a date first!",
    enterName: "Enter your name!",
    alreadyIn: "You're already in! 🎉",
    added: function(n) { return n + " added to the lineup! ⚽"; },
    removed: function(n) { return n + " removed"; },
    errorRetry: "Error — try again",
    deleteConfirm: "Delete this match and all its players?",
    deleteAnnouncementConfirm: "Delete this announcement?",
    vibeCredit: "vibe-coded by Alba",
    adminPanel: "Admin Panel",
    dateLbl: "Date",
    timeLbl: "Start",
    endTimeLbl: "End",
    locationLbl: "Location",
    locationPlaceholder: "e.g. Nagoya University Futsal Court",
    playerLimit: "Player Limit (Auto-Lock)",
    playerLimitDesc: "Registration auto-locks when player count hits this number. Leave empty to disable.",
    playerLimitSaved: "Player limit saved! ✅",
    playerLimitCleared: "Player limit disabled",
    saveLimitBtn: "Save Limit",
    manageAnnouncements: "Manage Announcements",
    addAnnouncement: "+ Add Announcement",
    announcementTitle: "Title",
    announcementDesc: "Description",
    announcementTitlePlaceholder: "e.g. Venue change this week",
    announcementDescPlaceholder: "Write announcement details here...",
    pinned: "📌 Pinned",
    pin: "Pin",
    unpin: "Unpin",
    announcementAdded: "Announcement added! 📢",
    announcementDeleted: "Announcement deleted",
    noAnnouncements: "No announcements yet.",
    enterTitle: "Enter announcement title!",
    enterDesc: "Enter announcement description!",
  }
};

let games = [];
let announcements = [];
let playerLimit = null; // global limit from Firestore config
let currentScreen = "dates";
let selectedGameId = null;
let adminViewGameId = null;
let editingGameId = null;
let countdownTimer = null;
let lang = "id";

function tr(key, arg) {
  var val = T[lang][key];
  return typeof val === "function" ? val(arg) : (val || key);
}
function isPast(g) { return new Date(g.date + "T" + g.time) < new Date(); }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d + "T12:00:00").toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric"
  });
}
function fmtTime(t) {
  if (!t) return "";
  var parts = t.split(":").map(Number);
  var h = parts[0], m = parts[1];
  return (h % 12 || 12) + ":" + String(m).padStart(2, "0") + " " + (h >= 12 ? "PM" : "AM");
}
function fmtTimeRange(start, end) {
  if (!end) return fmtTime(start);
  return fmtTime(start) + " \u2013 " + fmtTime(end);
}
function pad(n) { return String(n).padStart(2, "0"); }
function sel(id) { return document.getElementById(id); }
function selectedGame() { return games.find(function(g) { return g.id === selectedGameId; }); }
function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>");
}
function gameLocation(g) { return g.location || DEFAULT_LOCATION; }

function showToast(msg) {
  var tc = sel("toast-container");
  var t = document.createElement("div");
  t.className = "fu-toast"; t.textContent = msg;
  tc.appendChild(t);
  setTimeout(function() { t.remove(); }, 2600);
}

async function checkAdminPassword(input) {
  try {
    var snap = await getDoc(doc(db, "config", "admin"));
    if (!snap.exists()) return false;
    return snap.data().password === input;
  } catch(e) { return false; }
}

// Auto-lock check: called after every player join
async function checkAutoLock(gameId, playerCount) {
  if (!playerLimit || playerLimit < 1) return;
  if (playerCount >= playerLimit) {
    try {
      await updateDoc(doc(db, "games", gameId), { locked: true });
      showToast(tr("autoLocked"));
    } catch(e) {}
  }
}

function buildFieldSVG(players) {
  var W = 380, H = 570, n = players.length;
  function getPositions(n) {
    if (!n) return [];
    var rows = n <= 3 ? 2 : n <= 6 ? 3 : n <= 10 ? 4 : 5;
    var pos = [], zoneH = H*0.76, zoneTop = H*0.12;
    for (var i = 0; i < n; i++) {
      var row = i % rows, col = Math.floor(i / rows);
      var pir = Math.ceil((n - row) / rows);
      pos.push({ x: Math.round((W/(pir+1))*(col+1)), y: Math.round(zoneTop+(row/Math.max(rows-1,1))*zoneH) });
    }
    return pos;
  }
  var pos = getPositions(n), pc = ["#195c30","#1a6435"];
  var svg = '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  for (var i=0;i<10;i++) svg+='<rect x="0" y="'+(i*58)+'" width="'+W+'" height="58" fill="'+pc[i%2]+'"/>';
  var hw=W/2,hh=H/2;
  svg+='<rect x="16" y="16" width="'+(W-32)+'" height="'+(H-32)+'" rx="3" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>';
  svg+='<line x1="16" y1="'+hh+'" x2="'+(W-16)+'" y2="'+hh+'" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>';
  svg+='<circle cx="'+hw+'" cy="'+hh+'" r="46" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>';
  svg+='<circle cx="'+hw+'" cy="'+hh+'" r="3" fill="rgba(255,255,255,0.5)"/>';
  svg+='<rect x="'+(hw-64)+'" y="16" width="128" height="62" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>';
  svg+='<rect x="'+(hw-64)+'" y="'+(H-78)+'" width="128" height="62" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>';
  svg+='<rect x="'+(hw-32)+'" y="8" width="64" height="10" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="1.2"/>';
  svg+='<rect x="'+(hw-32)+'" y="'+(H-18)+'" width="64" height="10" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="1.2"/>';
  svg+='<circle cx="'+hw+'" cy="96" r="3" fill="rgba(255,255,255,0.4)"/>';
  svg+='<circle cx="'+hw+'" cy="'+(H-96)+'" r="3" fill="rgba(255,255,255,0.4)"/>';
  pos.forEach(function(p,i) {
    var name=players[i], safe=name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    var ini=name.slice(0,2).toUpperCase(), nw=Math.max(name.length*7+10,40);
    svg+='<g transform="translate('+p.x+','+p.y+')">';
    svg+='<ellipse cx="0" cy="25" rx="15" ry="5" fill="rgba(0,0,0,0.2)"/>';
    svg+='<path d="M-12,0 L-16,-7 L-7,-12 L0,-9 L7,-12 L16,-7 L12,0 L12,20 L-12,20 Z" fill="#f0e040" stroke="rgba(0,0,0,0.25)" stroke-width="0.8"/>';
    svg+='<path d="M-4,-9 Q0,-13 4,-9 Q2,-5 0,-4 Q-2,-5 -4,-9Z" fill="#d8c830" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>';
    svg+='<text x="0" y="13" font-family="\'Bebas Neue\',sans-serif" font-size="8" fill="#1a3a2a" text-anchor="middle" letter-spacing="0.5">'+ini+'</text>';
    svg+='<rect x="'+(-nw/2)+'" y="24" width="'+nw+'" height="13" rx="3" fill="rgba(0,0,0,0.6)"/>';
    svg+='<text x="0" y="34" font-family="\'Barlow Condensed\',sans-serif" font-size="9.5" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="0.3">'+safe+'</text>';
    svg+='</g>';
  });
  if (!n) svg+='<text x="'+hw+'" y="'+(hh+6)+'" font-family="\'Barlow Condensed\',sans-serif" font-size="14" fill="rgba(255,255,255,0.22)" text-anchor="middle" letter-spacing="2">'+tr("noPlayers")+'</text>';
  svg+='</svg>';
  return svg;
}

function startCountdown(date, time) {
  if (countdownTimer) clearInterval(countdownTimer);
  function tick() {
    var diff = new Date(date+"T"+time) - new Date();
    if (diff <= 0) { ["cd-d","cd-h","cd-m","cd-s"].forEach(function(id){if(sel(id))sel(id).textContent="00";}); return; }
    var v={"cd-d":pad(Math.floor(diff/86400000)),"cd-h":pad(Math.floor((diff%86400000)/3600000)),"cd-m":pad(Math.floor((diff%3600000)/60000)),"cd-s":pad(Math.floor((diff%60000)/1000))};
    Object.entries(v).forEach(function(kv){if(sel(kv[0]))sel(kv[0]).textContent=kv[1];});
  }
  tick(); countdownTimer = setInterval(tick, 1000);
}

function renderAnnouncements() {
  if (!announcements.length) return "";
  var sorted = announcements.slice().sort(function(a,b) {
    if (a.pinned&&!b.pinned) return -1; if (!a.pinned&&b.pinned) return 1;
    return (b.createdAt||0)-(a.createdAt||0);
  });
  var isOpen = window._annOpen !== false;
  var html = '<div class="fu-section-pill announce-pill" onclick="toggleAnn()" style="cursor:pointer;user-select:none;justify-content:space-between;width:100%;box-sizing:border-box;">';
  html += '<span>📢 '+tr("announcements")+'</span><span style="font-size:14px;margin-left:8px;">'+(isOpen?'▲':'▼')+'</span></div>';
  if (isOpen) {
    sorted.forEach(function(a) {
      html += '<div class="fu-announce-card'+(a.pinned?' pinned':'')+'">'; 
      if (a.pinned) html += '<div class="fu-announce-pin">'+tr("pinned")+'</div>';
      html += '<div class="fu-announce-title">'+escHtml(a.title)+'</div>';
      html += '<div class="fu-announce-desc">'+escHtml(a.desc)+'</div></div>';
    });
  }
  return html;
}

function spotsLeftBadge(g) {
  if (!playerLimit || playerLimit < 1 || g.locked || isPast(g)) return "";
  var left = playerLimit - g.players.length;
  if (left <= 0) return "";
  var color = left <= 3 ? "#ff9999" : "#4ade80";
  return '<span style="font-family:\'Barlow Condensed\',sans-serif;font-size:11px;color:'+color+';letter-spacing:1px;margin-left:6px;">'+tr("spotsLeft", left)+'</span>';
}

function render() {
  var root = sel("app");
  var sorted = games.slice().sort(function(a,b){return new Date(a.date+"T"+a.time)-new Date(b.date+"T"+b.time);});
  var upcoming = sorted.filter(function(g){return !isPast(g);});
  var past = sorted.filter(function(g){return isPast(g);}).reverse();
  var game = selectedGame();

  var html = '<header class="fu-header">';
  html += '<div class="fu-logo" onclick="goTo(\'dates\')"><span class="fu-logo-icon">⚽</span>';
  html += '<div><div class="fu-logo-name">'+tr("title")+'</div><div class="fu-logo-sub">'+tr("org")+'</div></div></div>';
  html += '<div style="display:flex;align-items:center;gap:8px;">';
  html += '<button class="fu-lang-btn" onclick="toggleLang()">'+(lang==="id"?"EN":"ID")+'</button>';
  html += '<button class="fu-admin-btn" onclick="openAdminModal()">Admin</button></div></header>';
  html += '<main class="fu-main">';

  // ── DATES ──
  if (currentScreen === "dates") {
    html += '<div class="fu-screen">';
    html += '<div class="fu-org-badge">'+tr("orgSub")+'</div>';
    html += '<div class="fu-title">'+tr("title")+'</div>';
    html += '<div class="fu-subtitle">'+tr("tapToJoin")+'</div>';
    html += renderAnnouncements();
    html += '<div class="fu-section-pill">'+tr("upcoming")+'</div>';
    if (!upcoming.length) {
      html += '<div class="fu-empty">'+tr("noUpcoming")+'</div>';
    } else {
      upcoming.forEach(function(g) {
        html += '<div class="fu-date-item" onclick="selectGame(\''+g.id+'\')"><div>';
        html += '<div class="fu-date-day">'+fmtDate(g.date)+' '+(g.locked?"🔒":"")+'</div>';
        html += '<div class="fu-date-meta">'+fmtTimeRange(g.time,g.endTime)+' · '+gameLocation(g)+'</div></div>';
        html += '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">';
        html += '<div class="fu-date-count">'+g.players.length+' in 👥</div>';
        html += spotsLeftBadge(g);
        html += '</div></div>';
      });
    }
    if (past.length > 0) {
      html += '<div class="fu-section-pill past">'+tr("past")+'</div>';
      past.forEach(function(g) {
        html += '<div class="fu-date-item past-item" onclick="selectGame(\''+g.id+'\')">';
        html += '<div><div class="fu-date-day" style="opacity:0.5;">'+fmtDate(g.date)+' ⏱</div>';
        html += '<div class="fu-date-meta">'+fmtTimeRange(g.time,g.endTime)+' · '+gameLocation(g)+'</div></div>';
        html += '<div class="fu-date-count" style="color:rgba(238,242,238,0.35);">'+g.players.length+' '+tr("signedUp")+'</div></div>';
      });
    }
    html += '</div>';
  }

  // ── ACTION ──
  else if (currentScreen === "action" && game) {
    var past_game = isPast(game);
    var spotsLeft = (playerLimit && playerLimit > 0 && !game.locked && !past_game) ? playerLimit - game.players.length : null;
    html += '<div class="fu-screen"><div class="fu-title">'+(past_game?tr("finalLineup"):tr("gameDay"))+'</div>';
    html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:14px;">';
    html += '<div class="action-date-box"><div class="action-date-name">'+fmtDate(game.date)+'</div>';
    html += '<div class="action-date-time">'+fmtTimeRange(game.time,game.endTime)+' · '+gameLocation(game)+'</div></div>';
    if (past_game) {
      html += '<div class="fu-locked" style="background:rgba(100,100,100,0.15);border-color:rgba(200,200,200,0.2);color:rgba(238,242,238,0.5);">'+tr("pastMatch")+'</div>';
      html += '<button class="fu-btn fu-btn-secondary" onclick="goTo(\'lineup\')">'+tr("seeWhosComing")+'</button>';
    } else {
      if (game.locked) {
        var lockMsg = (playerLimit && game.players.length >= playerLimit) ? tr("registrationFull") : tr("registrationClosed");
        html += '<div class="fu-locked">'+lockMsg+'</div>';
      } else if (spotsLeft !== null && spotsLeft > 0) {
        var spotColor = spotsLeft <= 3 ? "#ff9999" : "#4ade80";
        html += '<div style="text-align:center;font-family:\'Barlow Condensed\',sans-serif;font-size:13px;color:'+spotColor+';letter-spacing:1px;padding:6px 0;">'+tr("spotsLeft", spotsLeft)+'</div>';
      }
      html += '<button class="fu-btn fu-btn-primary" onclick="goTo(\'join\')" '+(game.locked?'disabled':'')+'>'+tr("imPlaying")+'</button>';
      html += '<button class="fu-btn fu-btn-secondary" onclick="goTo(\'lineup\')">'+tr("seeWhosComing")+'</button>';
    }
    html += '<button class="fu-btn fu-btn-ghost" onclick="goTo(\'dates\')">'+tr("backToMatches")+'</button>';
    html += '</div></div>';
  }

  // ── JOIN ──
  else if (currentScreen === "join" && game) {
    var spotsLeftJoin = (playerLimit && playerLimit > 0) ? playerLimit - game.players.length : null;
    html += '<div class="fu-screen"><div class="fu-title">'+tr("imIn")+'</div>';
    if (spotsLeftJoin !== null && spotsLeftJoin > 0) {
      var sc = spotsLeftJoin <= 3 ? "#ff9999" : "#4ade80";
      html += '<div style="text-align:center;font-family:\'Barlow Condensed\',sans-serif;font-size:13px;color:'+sc+';letter-spacing:1px;margin-top:-8px;">'+tr("spotsLeft", spotsLeftJoin)+'</div>';
    }
    html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:14px;">';
    html += '<div><label class="fu-label">'+tr("yourName")+'</label>';
    html += '<input class="fu-input" id="player-input" type="text" placeholder="'+tr("namePlaceholder")+'" maxlength="20" autocomplete="off"/></div>';
    html += '<div><label class="fu-label">'+tr("emailLbl")+' <span style="opacity:0.4;font-size:10px;letter-spacing:1px;">'+tr("emailOpt")+'</span></label>';
    html += '<input class="fu-input" id="player-email" type="email" placeholder="'+tr("emailPlaceholder")+'" autocomplete="email"/></div>';
    html += '<button class="fu-btn fu-btn-primary" onclick="joinGame()">'+tr("addToLineup")+'</button>';
    html += '<button class="fu-btn fu-btn-ghost" onclick="goTo(\'action\')">'+tr("back")+'</button>';
    html += '</div></div>';
  }

  // ── LINEUP ──
  else if (currentScreen === "lineup" && game) {
    var is_past = isPast(game);
    html += '<div class="fu-screen wide"><div class="fu-title">'+(is_past?tr("finalLineup"):tr("lineup"))+'</div>';
    html += '<div class="fu-subtitle">'+(is_past?tr("finalSub",game.players.length):tr("playersReady",game.players.length))+'</div>';
    html += '<div class="fu-meta">';
    html += '<div class="fu-meta-cell"><div class="fu-meta-label">📅 '+tr("date")+'</div><div class="fu-meta-value">'+fmtDate(game.date)+'</div></div>';
    html += '<div class="fu-meta-cell"><div class="fu-meta-label">⏰ '+tr("kickoff")+'</div><div class="fu-meta-value">'+fmtTimeRange(game.time,game.endTime)+'</div></div>';
    html += '<div class="fu-meta-cell"><div class="fu-meta-label">📍 '+tr("location")+'</div><div class="fu-meta-value" style="font-size:12px;line-height:1.4;">'+escHtml(gameLocation(game))+'</div></div>';
    html += '<div class="fu-meta-cell"><div class="fu-meta-label">👥 '+tr("squad")+'</div><div class="fu-meta-value">'+game.players.length+' '+tr("signedUp")+(playerLimit?' / '+playerLimit:'')+'</div></div>';
    html += '</div>';
    if (!is_past) {
      html += '<div class="fu-cd">';
      ["d","h","m","s"].forEach(function(u,i) {
        if (i>0) html+='<div class="fu-cd-sep">:</div>';
        var lbl = [tr("days"),tr("hours"),tr("mins"),tr("secs")][i];
        html+='<div class="fu-cd-unit"><div class="fu-cd-num" id="cd-'+u+'">00</div><div class="fu-cd-lbl">'+lbl+'</div></div>';
      });
      html += '</div>';
    }
    html += '<div class="fu-field-wrap">'+buildFieldSVG(game.players)+'</div>';
    html += '<button class="fu-btn fu-btn-ghost" onclick="goTo(\'action\')">'+tr("back")+'</button>';
    html += '</div>';
  }

  // ── ADMIN ──
  else if (currentScreen === "admin") {
    var adminGame = games.find(function(g){return g.id===adminViewGameId;});
    var allSorted = games.slice().sort(function(a,b){return new Date(a.date+"T"+a.time)-new Date(b.date+"T"+b.time);});
    var annSorted = announcements.slice().sort(function(a,b){
      if(a.pinned&&!b.pinned)return -1;if(!a.pinned&&b.pinned)return 1;return(b.createdAt||0)-(a.createdAt||0);
    });
    var allSubs = window._subscribers || [];

    html += '<div class="fu-screen wide"><div class="fu-admin-title">'+tr("adminPanel")+'</div>';

    // Player limit setting
    html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:12px;">';
    html += '<div class="fu-section-label">⚙️ '+tr("playerLimit")+'</div>';
    html += '<div style="font-family:\'Barlow Condensed\',sans-serif;font-size:12px;color:rgba(238,242,238,0.45);letter-spacing:1px;margin-top:-4px;">'+tr("playerLimitDesc")+'</div>';
    html += '<div class="fu-form-row">';
    html += '<div><input class="fu-input" id="player-limit-input" type="number" min="1" max="100" placeholder="cth. 14" value="'+(playerLimit||'')+'"/></div>';
    html += '<div><button class="fu-btn fu-btn-primary" onclick="savePlayerLimit()" style="height:100%;">'+tr("saveLimitBtn")+'</button></div>';
    html += '</div></div>';

    // Add match
    html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:14px;">';
    html += '<div class="fu-section-label">'+tr("addMatch")+'</div>';
    html += '<div class="fu-form-row">';
    html += '<div><label class="fu-label">'+tr("dateLbl")+'</label><input class="fu-input" id="new-date" type="date"/></div>';
    html += '<div><label class="fu-label">'+tr("timeLbl")+'</label><input class="fu-input" id="new-time" type="time" value="19:00"/></div>';
    html += '</div><div class="fu-form-row">';
    html += '<div><label class="fu-label">'+tr("endTimeLbl")+'</label><input class="fu-input" id="new-end-time" type="time" value="21:00"/></div>';
    html += '<div><label class="fu-label">'+tr("locationLbl")+'</label><input class="fu-input" id="new-location" type="text" placeholder="'+tr("locationPlaceholder")+'" maxlength="80"/></div>';
    html += '</div>';
    html += '<button class="fu-btn fu-btn-primary" onclick="addGame()">'+tr("addMatchBtn")+'</button></div>';

    // Matches list
    html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:10px;">';
    html += '<div class="fu-section-label">'+tr("scheduledMatches")+'</div>';
    if (!allSorted.length) {
      html += '<div class="fu-empty">'+tr("noMatches")+'</div>';
    } else {
      allSorted.forEach(function(g) {
        var isEditing = editingGameId === g.id;
        html += '<div class="fu-game-row '+(g.locked?'locked':'')+'" style="flex-direction:column;align-items:stretch;gap:10px;">';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;">';
        html += '<div style="flex:1;min-width:0;">';
        html += '<div class="fu-game-row-name">'+fmtDate(g.date)+' '+(isPast(g)?'⏱':g.locked?'🔒':'')+'</div>';
        html += '<div class="fu-game-row-meta">'+fmtTimeRange(g.time,g.endTime)+' · '+gameLocation(g)+' · '+g.players.length+' pemain</div>';
        html += '</div>';
        html += '<div class="fu-game-actions">';
        html += '<button class="fu-sm-btn '+(g.locked?'unlock':'lock')+'" onclick="toggleLock(\''+g.id+'\')">'+(g.locked?tr("unlock"):tr("lock"))+'</button>';
        html += '<button class="fu-sm-btn view" onclick="toggleEdit(\''+g.id+'\')">'+(isEditing?'✕':tr("edit"))+'</button>';
        html += '<button class="fu-sm-btn view" onclick="viewPlayers(\''+g.id+'\')">'+tr("players")+'</button>';
        html += '<button class="fu-sm-btn del" onclick="deleteGame(\''+g.id+'\')">'+tr("del")+'</button>';
        html += '</div></div>';
        // Inline edit form
        if (isEditing) {
          html += '<div style="display:flex;flex-direction:column;gap:10px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);">';
          html += '<div class="fu-form-row">';
          html += '<div><label class="fu-label">'+tr("timeLbl")+'</label><input class="fu-input" id="edit-time-'+g.id+'" type="time" value="'+(g.time||'19:00')+'"/></div>';
          html += '<div><label class="fu-label">'+tr("endTimeLbl")+'</label><input class="fu-input" id="edit-end-'+g.id+'" type="time" value="'+(g.endTime||'21:00')+'"/></div>';
          html += '</div>';
          html += '<div><label class="fu-label">'+tr("locationLbl")+'</label>';
          html += '<input class="fu-input" id="edit-loc-'+g.id+'" type="text" value="'+escHtml(gameLocation(g))+'" maxlength="80" placeholder="'+tr("locationPlaceholder")+'"/></div>';
          html += '<button class="fu-btn fu-btn-primary" onclick="saveEdit(\''+g.id+'\')">'+tr("save")+' ✓</button>';
          html += '</div>';
        }
        html += '</div>';
      });
    }
    html += '</div>';

    // Players panel
    if (adminGame) {
      html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:10px;">';
      html += '<div class="fu-section-label">'+tr("players")+' — '+fmtDate(adminGame.date)+' ('+adminGame.players.length+(playerLimit?'/'+playerLimit:'')+')' + '</div>';
      if (!adminGame.players.length) {
        html += '<div class="fu-empty">'+tr("noPlayersYet")+'</div>';
      } else {
        adminGame.players.forEach(function(p,i) {
          html += '<div class="fu-player-row">';
          html += '<div style="display:flex;align-items:center;"><div class="fu-player-num">'+(i+1)+'</div><div class="fu-player-name-txt">'+p+'</div></div>';
          html += '<button class="fu-sm-btn del" onclick="removePlayer(\''+adminGame.id+'\','+i+')">'+tr("remove")+'</button></div>';
        });
      }
      html += '</div>';
    }

    // Announcements
    html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:14px;">';
    html += '<div class="fu-section-label">📢 '+tr("manageAnnouncements")+'</div>';
    html += '<div style="display:flex;flex-direction:column;gap:8px;">';
    html += '<div><label class="fu-label">'+tr("announcementTitle")+'</label>';
    html += '<input class="fu-input" id="ann-title" type="text" placeholder="'+tr("announcementTitlePlaceholder")+'" maxlength="150"/></div>';
    html += '<div><label class="fu-label">'+tr("announcementDesc")+'</label>';
    html += '<textarea class="fu-input fu-textarea" id="ann-desc" placeholder="'+tr("announcementDescPlaceholder")+'" maxlength="1000" rows="3"></textarea></div>';
    html += '</div><button class="fu-btn fu-btn-primary" onclick="addAnnouncement()">'+tr("addAnnouncement")+'</button>';
    if (annSorted.length > 0) {
      html += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">';
      annSorted.forEach(function(a) {
        html += '<div class="fu-game-row'+(a.pinned?' locked':'')+'" style="align-items:flex-start;">';
        html += '<div style="flex:1;min-width:0;">';
        html += '<div class="fu-game-row-name">'+escHtml(a.title)+(a.pinned?' 📌':'')+'</div>';
        html += '<div class="fu-game-row-meta" style="white-space:normal;line-height:1.4;">'+escHtml(a.desc)+'</div>';
        html += '</div><div class="fu-game-actions" style="flex-direction:column;gap:4px;margin-top:2px;">';
        html += '<button class="fu-sm-btn '+(a.pinned?'unlock':'view')+'" onclick="togglePin(\''+a.id+'\')">'+(a.pinned?tr("unpin"):tr("pin"))+'</button>';
        html += '<button class="fu-sm-btn del" onclick="deleteAnnouncement(\''+a.id+'\')">'+tr("del")+'</button>';
        html += '</div></div>';
      });
      html += '</div>';
    } else {
      html += '<div class="fu-empty" style="padding:12px 0;">'+tr("noAnnouncements")+'</div>';
    }
    html += '</div>';

    // Email subscribers
    html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:10px;">';
    html += '<div class="fu-section-label">\u2709\ufe0f '+tr("subscribers")+' ('+allSubs.length+')</div>';
    if (!allSubs.length) {
      html += '<div class="fu-empty">'+tr("noSubscribers")+'</div>';
    } else {
      html += '<button class="fu-btn fu-btn-primary" onclick="copyEmails()">'+tr("copyAll")+' ('+allSubs.length+')</button>';
      allSubs.forEach(function(s,i) {
        html += '<div class="fu-player-row"><div style="display:flex;align-items:center;gap:10px;min-width:0;overflow:hidden;">';
        html += '<div class="fu-player-num">'+(i+1)+'</div>';
        html += '<div style="display:flex;flex-direction:column;min-width:0;">';
        html += '<div class="fu-player-name-txt">'+escHtml(s.name)+'</div>';
        html += '<div style="font-family:\'Barlow Condensed\',sans-serif;font-size:11px;color:rgba(238,242,238,0.4);letter-spacing:0.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+escHtml(s.email)+'</div>';
        html += '</div></div></div>';
      });
    }
    html += '</div>';

    html += '<button class="fu-btn fu-btn-ghost" onclick="goTo(\'dates\')">'+tr("exitAdmin")+'</button></div>';
  }

  html += '<div style="width:100%;max-width:480px;margin:0 auto;padding:0 16px;">';
html += '<div class="fu-card" style="display:flex;flex-direction:column;gap:12px;">';
html += '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:20px;letter-spacing:2px;color:#f0e040;">📬 '+(lang==="id"?"Langganan Update":"Subscribe for Updates")+'</div>';
html += '<div style="font-family:\'Barlow Condensed\',sans-serif;font-size:12px;letter-spacing:1px;color:rgba(238,242,238,0.45);">'+(lang==="id"?"Masukkan emailmu untuk dapat notifikasi jadwal pertandingan.":"Enter your email to get notified about match schedules.")+'</div>';
html += '<input class="fu-input" id="subscribe-name" type="text" placeholder="'+(lang==="id"?"Nama kamu":"Your name")+'" maxlength="20"/>';
html += '<input class="fu-input" id="subscribe-email" type="email" placeholder="'+(lang==="id"?"Email kamu":"Your email")+'"/>';
html += '<button class="fu-btn fu-btn-secondary" onclick="subscribeEmail()">'+(lang==="id"?"🔔 Langganan":"🔔 Subscribe")+'</button>';
html += '</div></div>';
html += '</main><footer class="fu-footer"><span>'+tr("vibeCredit")+'</span></footer>';

  // Modal
  html += '<div id="admin-modal" class="fu-modal-bg" style="display:none;"><div class="fu-modal">';
  html += '<div class="fu-modal-title">'+tr("adminAccess")+'</div>';
  html += '<div><label class="fu-label">'+tr("password")+'</label>';
  html += '<input class="fu-input" id="admin-pw" type="password" placeholder="'+tr("passwordPlaceholder")+'" onkeydown="if(event.key===\'Enter\')checkAdmin()"/></div>';
  html += '<div id="admin-err" class="fu-modal-err" style="display:none;">'+tr("wrongPassword")+'</div>';
  html += '<div id="admin-checking" style="display:none;font-family:\'Barlow Condensed\',sans-serif;font-size:12px;color:rgba(238,242,238,0.45);margin-top:8px;letter-spacing:1px;">'+tr("checking")+'</div>';
  html += '<div class="fu-modal-row">';
  html += '<button class="fu-btn fu-btn-primary" style="flex:1;" onclick="checkAdmin()">'+tr("enter")+'</button>';
  html += '<button class="fu-btn fu-btn-secondary" style="flex:1;" onclick="closeAdminModal()">'+tr("cancel")+'</button>';
  html += '</div></div></div>';

  root.innerHTML = html;

  if (currentScreen === "join") {
    var inp = sel("player-input");
    if (inp) { inp.focus(); inp.onkeydown = function(e) { if(e.key==="Enter") { var em=sel("player-email"); if(em) em.focus(); } }; }
  }
  if (currentScreen === "lineup" && game && !isPast(game)) {
    startCountdown(game.date, game.time);
  } else {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  }
}

// ── NAVIGATION ──
window.toggleLang = function() { lang = lang==="id"?"en":"id"; render(); };
window.toggleAnn = function() { window._annOpen = window._annOpen===false?true:false; render(); };
window.goTo = function(screen) {
  currentScreen = screen;
  if (screen==="dates") { selectedGameId=null; adminViewGameId=null; editingGameId=null; }
  render();
};
window.selectGame = function(id) { selectedGameId=id; currentScreen="action"; render(); };
window.toggleEdit = function(id) { editingGameId = editingGameId===id?null:id; render(); };

// ── JOIN ──
window.joinGame = async function() {
  var inp = sel("player-input");
  var name = inp ? inp.value.trim() : "";
  if (!name) { showToast(tr("enterName")); return; }
  var game = selectedGame();
  if (!game || isPast(game)) return;
  if (game.locked) { showToast(tr("registrationClosed")); return; }
  if (game.players.some(function(p){return p.toLowerCase()===name.toLowerCase();})) {
    showToast(tr("alreadyIn")); currentScreen="lineup"; render(); return;
  }
  var emailEl = sel("player-email");
  var email = emailEl ? emailEl.value.trim().toLowerCase() : "";
  try {
    await updateDoc(doc(db,"games",game.id), { players: arrayUnion(name) });
    var newCount = game.players.length + 1;
    await checkAutoLock(game.id, newCount);
    if (email && email.includes("@")) {
      var already = (window._subscribers||[]).some(function(s){return s.email===email;});
      if (!already) await addDoc(collection(db,"subscribers"), { name:name, email:email, joinedAt:Date.now() });
    }
    showToast(tr("added", name));
    currentScreen="lineup"; render();
  } catch(e) { showToast(tr("errorRetry")); }
};

// ── ADMIN MODAL ──
window.openAdminModal = function() {
  render();
  var m=sel("admin-modal"); if(m) m.style.display="flex";
  setTimeout(function(){var pw=sel("admin-pw");if(pw)pw.focus();},100);
};
window.closeAdminModal = function() { var m=sel("admin-modal"); if(m) m.style.display="none"; };
window.checkAdmin = async function() {
  var pw=sel("admin-pw"),err=sel("admin-err"),checking=sel("admin-checking");
  if (!pw) return;
  if(err) err.style.display="none";
  if(checking) checking.style.display="block";
  pw.disabled=true;
  var ok = await checkAdminPassword(pw.value);
  pw.disabled=false;
  if(checking) checking.style.display="none";
  if (ok) { closeAdminModal(); currentScreen="admin"; render(); }
  else { if(err) err.style.display="block"; pw.value=""; pw.focus(); }
};

// ── PLAYER LIMIT ──
window.savePlayerLimit = async function() {
  var inp = sel("player-limit-input");
  var val = inp ? parseInt(inp.value) : 0;
  try {
    if (val && val > 0) {
      await updateDoc(doc(db,"config","admin"), { playerLimit: val });
      showToast(tr("playerLimitSaved"));
    } else {
      await updateDoc(doc(db,"config","admin"), { playerLimit: null });
      showToast(tr("playerLimitCleared"));
    }
  } catch(e) { showToast(tr("errorRetry")); }
};

// ── GAME ACTIONS ──
window.addGame = async function() {
  var date = sel("new-date")?sel("new-date").value:"";
  var time = sel("new-time")?sel("new-time").value:"19:00";
  var endTime = sel("new-end-time")?sel("new-end-time").value:"";
  var location = sel("new-location")?sel("new-location").value.trim():"";
  if (!date) { showToast(tr("pickDate")); return; }
  try {
    await addDoc(gamesCol, { date:date, time:time, endTime:endTime, location:location, players:[], locked:false });
    showToast(tr("matchAdded"));
  } catch(e) { showToast(tr("errorRetry")); }
};

window.saveEdit = async function(id) {
  var time = sel("edit-time-"+id)?sel("edit-time-"+id).value:"";
  var endTime = sel("edit-end-"+id)?sel("edit-end-"+id).value:"";
  var location = sel("edit-loc-"+id)?sel("edit-loc-"+id).value.trim():"";
  try {
    await updateDoc(doc(db,"games",id), { time:time, endTime:endTime, location:location });
    editingGameId = null;
    showToast(tr("matchUpdated"));
  } catch(e) { showToast(tr("errorRetry")); }
};

window.deleteGame = async function(id) {
  if (!confirm(tr("deleteConfirm"))) return;
  try {
    await deleteDoc(doc(db,"games",id));
    if (adminViewGameId===id) adminViewGameId=null;
    if (editingGameId===id) editingGameId=null;
    showToast(tr("matchDeleted"));
  } catch(e) { showToast(tr("errorRetry")); }
};
window.toggleLock = async function(id) {
  var game = games.find(function(g){return g.id===id;});
  if (!game) return;
  try {
    await updateDoc(doc(db,"games",id), { locked:!game.locked });
    showToast(game.locked?tr("unlockMsg"):tr("lockMsg"));
  } catch(e) { showToast(tr("errorRetry")); }
};
window.viewPlayers = function(id) { adminViewGameId=adminViewGameId===id?null:id; render(); };
window.removePlayer = async function(gameId, idx) {
  var game = games.find(function(g){return g.id===gameId;});
  if (!game) return;
  var name = game.players[idx];
  try {
    await updateDoc(doc(db,"games",gameId), { players:arrayRemove(name) });
    showToast(tr("removed",name));
  } catch(e) { showToast(tr("errorRetry")); }
};

// ── ANNOUNCEMENTS ──
window.addAnnouncement = async function() {
  var titleEl=sel("ann-title"),descEl=sel("ann-desc");
  var title=titleEl?titleEl.value.trim():"", desc=descEl?descEl.value.trim():"";
  if (!title) { showToast(tr("enterTitle")); return; }
  if (!desc) { showToast(tr("enterDesc")); return; }
  try {
    await addDoc(announcementsCol, { title:title, desc:desc, pinned:false, createdAt:Date.now() });
    showToast(tr("announcementAdded"));
    if(titleEl) titleEl.value=""; if(descEl) descEl.value="";
  } catch(e) { showToast(tr("errorRetry")); }
};
window.deleteAnnouncement = async function(id) {
  if (!confirm(tr("deleteAnnouncementConfirm"))) return;
  try { await deleteDoc(doc(db,"announcements",id)); showToast(tr("announcementDeleted")); }
  catch(e) { showToast(tr("errorRetry")); }
};
window.togglePin = async function(id) {
  var ann = announcements.find(function(a){return a.id===id;});
  if (!ann) return;
  try { await updateDoc(doc(db,"announcements",id), { pinned:!ann.pinned }); }
  catch(e) { showToast(tr("errorRetry")); }
};


// ── EMAIL ──
window.subscribeEmail = async function() {
  var nameEl = sel("subscribe-name"), emailEl = sel("subscribe-email");
  var name = nameEl ? nameEl.value.trim() : "";
  var email = emailEl ? emailEl.value.trim().toLowerCase() : "";
  if (!name) { showToast(lang==="id"?"Masukkan namamu!":"Enter your name!"); return; }
  if (!email || !email.includes("@")) { showToast(lang==="id"?"Masukkan email yang valid!":"Enter a valid email!"); return; }
  var already = (window._subscribers||[]).some(function(s){return s.email===email;});
  if (already) { showToast(lang==="id"?"Email sudah terdaftar! ✅":"Already subscribed! ✅"); return; }
  try {
    await addDoc(collection(db,"subscribers"), { name:name, email:email, joinedAt:Date.now() });
    showToast(lang==="id"?"Berhasil langganan! 🎉":"Subscribed successfully! 🎉");
    if(nameEl) nameEl.value=""; if(emailEl) emailEl.value="";
  } catch(e) { showToast(lang==="id"?"Error — coba lagi":"Error — try again"); }
};
window.copyEmails = function() {
  var emails = (window._subscribers||[]).map(function(s){return s.email;}).join(", ");
  navigator.clipboard.writeText(emails).then(function(){showToast(tr("emailCopied"));}).catch(function(){showToast(tr("errorRetry"));});
};

// ── REALTIME LISTENERS ──
var gq = query(gamesCol, orderBy("date"));
onSnapshot(gq, function(snapshot) {
  games = snapshot.docs.map(function(d){var data=d.data();return Object.assign({id:d.id},data,{players:data.players||[]});});
  render();
});
onSnapshot(announcementsCol, function(snapshot) {
  announcements = snapshot.docs.map(function(d){return Object.assign({id:d.id},d.data());});
  render();
});
onSnapshot(collection(db,"subscribers"), function(snapshot) {
  window._subscribers = snapshot.docs.map(function(d){return d.data();}).sort(function(a,b){return(b.joinedAt||0)-(a.joinedAt||0);});
  if (currentScreen==="admin") render();
});
// Listen to config for playerLimit
onSnapshot(doc(db,"config","admin"), function(snap) {
  if (snap.exists()) { playerLimit = snap.data().playerLimit || null; }
  render();
});
