import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, doc,
  onSnapshot, addDoc, updateDoc, deleteDoc,
  query, orderBy, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── CONFIG ──
const firebaseConfig = {
  apiKey: "AIzaSyAhC_ppeMTRonAEZK1tyaSYXbFNvC7aCJQ",
  authDomain: "futsal-ppi.firebaseapp.com",
  projectId: "futsal-ppi",
  storageBucket: "futsal-ppi.firebasestorage.app",
  messagingSenderId: "277761250199",
  appId: "1:277761250199:web:2af9e816f42222b02baad2"
};

const ADMIN_PASSWORD = "futsal2025";
const LOCATION = "Nagoya University Futsal Court";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gamesCol = collection(db, "games");

// ── STATE ──
let games = [];
let currentScreen = "dates";
let selectedGameId = null;
let adminViewGameId = null;
let countdownTimer = null;

// ── HELPERS ──
function fmtDate(d) {
  if (!d) return "";
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric"
  });
}
function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
}
function pad(n) { return String(n).padStart(2, "0"); }
function sel(id) { return document.getElementById(id); }
function selectedGame() { return games.find(g => g.id === selectedGameId); }

function showToast(msg) {
  const tc = sel("toast-container");
  const t = document.createElement("div");
  t.className = "fu-toast";
  t.textContent = msg;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// ── FIELD SVG ──
function buildFieldSVG(players) {
  const W = 380, H = 570;
  const n = players.length;

  function getPositions(n) {
    if (!n) return [];
    const rows = n <= 3 ? 2 : n <= 6 ? 3 : n <= 10 ? 4 : 5;
    const positions = [];
    const zoneH = H * 0.76;
    const zoneTop = H * 0.12;
    for (let i = 0; i < n; i++) {
      const row = i % rows;
      const col = Math.floor(i / rows);
      const playersInRow = Math.ceil((n - row) / rows);
      const x = (W / (playersInRow + 1)) * (col + 1);
      const y = zoneTop + (row / Math.max(rows - 1, 1)) * zoneH;
      positions.push({ x: Math.round(x), y: Math.round(y) });
    }
    return positions;
  }

  const positions = getPositions(n);
  const pitchCols = ["#195c30", "#1a6435"];

  let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;

  // Stripes
  for (let i = 0; i < 10; i++) {
    svg += `<rect x="0" y="${i * 58}" width="${W}" height="58" fill="${pitchCols[i % 2]}"/>`;
  }

  // Lines
  svg += `
    <rect x="16" y="16" width="${W-32}" height="${H-32}" rx="3" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>
    <line x1="16" y1="${H/2}" x2="${W-16}" y2="${H/2}" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>
    <circle cx="${W/2}" cy="${H/2}" r="46" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>
    <circle cx="${W/2}" cy="${H/2}" r="3" fill="rgba(255,255,255,0.5)"/>
    <rect x="${W/2-64}" y="16" width="128" height="62" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>
    <rect x="${W/2-64}" y="${H-78}" width="128" height="62" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>
    <rect x="${W/2-32}" y="8" width="64" height="10" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="1.2"/>
    <rect x="${W/2-32}" y="${H-18}" width="64" height="10" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="1.2"/>
    <circle cx="${W/2}" cy="96" r="3" fill="rgba(255,255,255,0.4)"/>
    <circle cx="${W/2}" cy="${H-96}" r="3" fill="rgba(255,255,255,0.4)"/>
  `;

  // Players
  positions.forEach((p, i) => {
    const name = players[i];
    const safe = name.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const initials = name.slice(0,2).toUpperCase();
    const nw = Math.max(name.length * 7 + 10, 40);
    svg += `
      <g transform="translate(${p.x},${p.y})">
        <ellipse cx="0" cy="25" rx="15" ry="5" fill="rgba(0,0,0,0.2)"/>
        <path d="M-12,0 L-16,-7 L-7,-12 L0,-9 L7,-12 L16,-7 L12,0 L12,20 L-12,20 Z" fill="#f0e040" stroke="rgba(0,0,0,0.25)" stroke-width="0.8"/>
        <path d="M-4,-9 Q0,-13 4,-9 Q2,-5 0,-4 Q-2,-5 -4,-9Z" fill="#d8c830" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>
        <text x="0" y="13" font-family="'Bebas Neue',sans-serif" font-size="8" fill="#1a3a2a" text-anchor="middle" letter-spacing="0.5">${initials}</text>
        <rect x="${-nw/2}" y="24" width="${nw}" height="13" rx="3" fill="rgba(0,0,0,0.6)"/>
        <text x="0" y="34" font-family="'Barlow Condensed',sans-serif" font-size="9.5" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="0.3">${safe}</text>
      </g>`;
  });

  if (!n) {
    svg += `<text x="${W/2}" y="${H/2+6}" font-family="'Barlow Condensed',sans-serif" font-size="14" fill="rgba(255,255,255,0.22)" text-anchor="middle" letter-spacing="2">NO PLAYERS YET</text>`;
  }

  svg += `</svg>`;
  return svg;
}

// ── COUNTDOWN ──
function startCountdown(date, time) {
  if (countdownTimer) clearInterval(countdownTimer);
  function tick() {
    const diff = new Date(date + "T" + time) - new Date();
    if (diff <= 0) {
      ["cd-d","cd-h","cd-m","cd-s"].forEach(id => { if(sel(id)) sel(id).textContent = "00"; });
      return;
    }
    const vals = {
      "cd-d": pad(Math.floor(diff / 86400000)),
      "cd-h": pad(Math.floor((diff % 86400000) / 3600000)),
      "cd-m": pad(Math.floor((diff % 3600000) / 60000)),
      "cd-s": pad(Math.floor((diff % 60000) / 1000)),
    };
    Object.entries(vals).forEach(([id, v]) => { if(sel(id)) sel(id).textContent = v; });
  }
  tick();
  countdownTimer = setInterval(tick, 1000);
}

// ── RENDER ──
function render() {
  const root = sel("app");
  const sorted = [...games].sort((a,b) => new Date(a.date+"T"+a.time) - new Date(b.date+"T"+b.time));
  const game = selectedGame();

  let html = `
    <header class="fu-header">
      <div class="fu-logo" onclick="goTo('dates')">
        <span class="fu-logo-icon">⚽</span>
        <div>
          <div class="fu-logo-name">Futsal PPI</div>
          <div class="fu-logo-sub">Nagoya University</div>
        </div>
      </div>
      <button class="fu-admin-btn" onclick="openAdminModal()">Admin</button>
    </header>
    <main class="fu-main">
  `;

  // ── DATES SCREEN ──
  if (currentScreen === "dates") {
    html += `<div class="fu-screen" id="screen">
      <div class="fu-title">Next Matches</div>
      <div class="fu-subtitle">Tap a match to sign up or check the lineup</div>`;
    if (!sorted.length) {
      html += `<div class="fu-empty">No matches scheduled yet.<br/>Ask your admin to add one!</div>`;
    } else {
      sorted.forEach(g => {
        html += `
          <div class="fu-date-item" onclick="selectGame('${g.id}')">
            <div>
              <div class="fu-date-day">${fmtDate(g.date)} ${g.locked ? "🔒" : ""}</div>
              <div class="fu-date-meta">${fmtTime(g.time)} · ${LOCATION}</div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <div class="fu-date-count">${g.players.length} in 👥</div>
            </div>
          </div>`;
      });
    }
    html += `</div>`;
  }

  // ── ACTION SCREEN ──
  else if (currentScreen === "action" && game) {
    html += `<div class="fu-screen" id="screen">
      <div class="fu-title">Game Day</div>
      <div class="fu-card" style="display:flex;flex-direction:column;gap:14px;">
        <div class="action-date-box">
          <div class="action-date-name">${fmtDate(game.date)}</div>
          <div class="action-date-time">${fmtTime(game.time)} · ${LOCATION}</div>
        </div>
        ${game.locked ? `<div class="fu-locked">🔒 Registration is closed for this match</div>` : ""}
        <button class="fu-btn fu-btn-primary" onclick="goTo('join')" ${game.locked ? "disabled" : ""}>⚡ I'm Playing</button>
        <button class="fu-btn fu-btn-secondary" onclick="goTo('lineup')">👀 See Who's Coming</button>
        <button class="fu-btn fu-btn-ghost" onclick="goTo('dates')">← Back to Matches</button>
      </div>
    </div>`;
  }

  // ── JOIN SCREEN ──
  else if (currentScreen === "join" && game) {
    html += `<div class="fu-screen" id="screen">
      <div class="fu-title">I'm In</div>
      <div class="fu-subtitle">Add your name to the lineup</div>
      <div class="fu-card" style="display:flex;flex-direction:column;gap:14px;">
        <div>
          <label class="fu-label">Your Name</label>
          <input class="fu-input" id="player-input" type="text" placeholder="e.g. Kenji" maxlength="20" autocomplete="off" />
        </div>
        <button class="fu-btn fu-btn-primary" onclick="joinGame()">Add Me to the Lineup →</button>
        <button class="fu-btn fu-btn-ghost" onclick="goTo('action')">← Back</button>
      </div>
    </div>`;
  }

  // ── LINEUP SCREEN ──
  else if (currentScreen === "lineup" && game) {
    html += `<div class="fu-screen wide" id="screen">
      <div class="fu-title">Lineup</div>
      <div class="fu-subtitle">${game.players.length} player${game.players.length !== 1 ? "s" : ""} ready to play</div>

      <div class="fu-meta">
        <div class="fu-meta-cell">
          <div class="fu-meta-label">📅 Date</div>
          <div class="fu-meta-value">${fmtDate(game.date)}</div>
        </div>
        <div class="fu-meta-cell">
          <div class="fu-meta-label">⏰ Kick-off</div>
          <div class="fu-meta-value">${fmtTime(game.time)}</div>
        </div>
        <div class="fu-meta-cell">
          <div class="fu-meta-label">📍 Location</div>
          <div class="fu-meta-value" style="font-size:12px;line-height:1.4;">Nagoya University<br/>Futsal Court</div>
        </div>
        <div class="fu-meta-cell">
          <div class="fu-meta-label">👥 Squad</div>
          <div class="fu-meta-value">${game.players.length} signed up</div>
        </div>
      </div>

      <div class="fu-cd">
        <div class="fu-cd-unit"><div class="fu-cd-num" id="cd-d">00</div><div class="fu-cd-lbl">Days</div></div>
        <div class="fu-cd-sep">:</div>
        <div class="fu-cd-unit"><div class="fu-cd-num" id="cd-h">00</div><div class="fu-cd-lbl">Hours</div></div>
        <div class="fu-cd-sep">:</div>
        <div class="fu-cd-unit"><div class="fu-cd-num" id="cd-m">00</div><div class="fu-cd-lbl">Mins</div></div>
        <div class="fu-cd-sep">:</div>
        <div class="fu-cd-unit"><div class="fu-cd-num" id="cd-s">00</div><div class="fu-cd-lbl">Secs</div></div>
      </div>

      <div class="fu-field-wrap">${buildFieldSVG(game.players)}</div>
      <button class="fu-btn fu-btn-ghost" onclick="goTo('action')">← Back</button>
    </div>`;
  }

  // ── ADMIN SCREEN ──
  else if (currentScreen === "admin") {
    const adminGame = games.find(g => g.id === adminViewGameId);
    html += `<div class="fu-screen wide" id="screen">
      <div class="fu-admin-title">Admin Panel</div>

      <div class="fu-card" style="display:flex;flex-direction:column;gap:14px;">
        <div class="fu-section-label">Add New Match</div>
        <div class="fu-form-row">
          <div>
            <label class="fu-label">Date</label>
            <input class="fu-input" id="new-date" type="date" />
          </div>
          <div>
            <label class="fu-label">Time</label>
            <input class="fu-input" id="new-time" type="time" value="19:00" />
          </div>
        </div>
        <button class="fu-btn fu-btn-primary" onclick="addGame()">+ Add Match</button>
      </div>

      <div class="fu-card" style="display:flex;flex-direction:column;gap:10px;">
        <div class="fu-section-label">Scheduled Matches</div>
        ${!sorted.length
          ? `<div class="fu-empty">No matches yet.</div>`
          : sorted.map(g => `
            <div class="fu-game-row ${g.locked ? "locked" : ""}">
              <div style="flex:1;min-width:0;">
                <div class="fu-game-row-name">${fmtDate(g.date)} ${g.locked ? "🔒" : ""}</div>
                <div class="fu-game-row-meta">${fmtTime(g.time)} · ${g.players.length} player${g.players.length!==1?"s":""}</div>
              </div>
              <div class="fu-game-actions">
                <button class="fu-sm-btn ${g.locked ? "unlock" : "lock"}" onclick="toggleLock('${g.id}')">${g.locked ? "Unlock" : "Lock"}</button>
                <button class="fu-sm-btn view" onclick="viewPlayers('${g.id}')">Players</button>
                <button class="fu-sm-btn del" onclick="deleteGame('${g.id}')">Del</button>
              </div>
            </div>`).join("")
        }
      </div>

      ${adminGame ? `
      <div class="fu-card" style="display:flex;flex-direction:column;gap:10px;">
        <div class="fu-section-label">Players — ${fmtDate(adminGame.date)} (${adminGame.players.length})</div>
        ${!adminGame.players.length
          ? `<div class="fu-empty">No players signed up yet.</div>`
          : adminGame.players.map((p,i) => `
            <div class="fu-player-row">
              <div style="display:flex;align-items:center;">
                <div class="fu-player-num">${i+1}</div>
                <div class="fu-player-name-txt">${p}</div>
              </div>
              <button class="fu-sm-btn del" onclick="removePlayer('${adminGame.id}',${i})">Remove</button>
            </div>`).join("")
        }
      </div>` : ""}

      <button class="fu-btn fu-btn-ghost" onclick="goTo('dates')">← Exit Admin</button>
    </div>`;
  }

  html += `</main>`;

  // Modal
  html += `
    <div id="admin-modal" class="fu-modal-bg" style="display:none;">
      <div class="fu-modal">
        <div class="fu-modal-title">Admin Access</div>
        <div>
          <label class="fu-label">Password</label>
          <input class="fu-input" id="admin-pw" type="password" placeholder="Enter admin password" onkeydown="if(event.key==='Enter')checkAdmin()" />
        </div>
        <div id="admin-err" class="fu-modal-err" style="display:none;">Wrong password. Try again.</div>
        <div class="fu-modal-row">
          <button class="fu-btn fu-btn-primary" style="flex:1;" onclick="checkAdmin()">Enter</button>
          <button class="fu-btn fu-btn-secondary" style="flex:1;" onclick="closeAdminModal()">Cancel</button>
        </div>
      </div>
    </div>`;

  root.innerHTML = html;

  // Post-render setup
  if (currentScreen === "join") {
    const inp = sel("player-input");
    if (inp) { inp.focus(); inp.onkeydown = e => { if(e.key==="Enter") joinGame(); }; }
  }
  if (currentScreen === "lineup" && game) {
    startCountdown(game.date, game.time);
  } else {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  }
  if (currentScreen === "admin") {
    const nd = sel("new-date"); if(nd) nd.valueAsDate = null;
  }
}

// ── NAVIGATION ──
window.goTo = function(screen) {
  currentScreen = screen;
  if (screen === "dates") { selectedGameId = null; adminViewGameId = null; }
  render();
};

window.selectGame = function(id) {
  selectedGameId = id;
  currentScreen = "action";
  render();
};

// ── JOIN ──
window.joinGame = async function() {
  const inp = sel("player-input");
  const name = inp ? inp.value.trim() : "";
  if (!name) { showToast("Enter your name!"); return; }
  const game = selectedGame();
  if (!game) return;
  if (game.locked) { showToast("Registration is closed!"); return; }
  if (game.players.some(p => p.toLowerCase() === name.toLowerCase())) {
    showToast("You're already in! 🎉"); goTo("lineup"); return;
  }
  try {
    await updateDoc(doc(db, "games", game.id), { players: arrayUnion(name) });
    showToast(`${name} added to the lineup! ⚽`);
    currentScreen = "lineup";
    render();
  } catch(e) { showToast("Error — try again"); console.error(e); }
};

// ── ADMIN ──
window.openAdminModal = function() {
  render();
  const m = sel("admin-modal"); if(m) m.style.display = "flex";
  setTimeout(() => { const pw = sel("admin-pw"); if(pw) pw.focus(); }, 100);
};

window.closeAdminModal = function() {
  const m = sel("admin-modal"); if(m) m.style.display = "none";
};

window.checkAdmin = function() {
  const pw = sel("admin-pw");
  if (pw && pw.value === ADMIN_PASSWORD) {
    closeAdminModal();
    currentScreen = "admin";
    render();
  } else {
    const err = sel("admin-err"); if(err) err.style.display = "block";
    if(pw) { pw.value = ""; pw.focus(); }
  }
};

window.addGame = async function() {
  const date = sel("new-date")?.value;
  const time = sel("new-time")?.value || "19:00";
  if (!date) { showToast("Pick a date first!"); return; }
  try {
    await addDoc(gamesCol, { date, time, players: [], locked: false });
    showToast("Match added! ✅");
  } catch(e) { showToast("Error — try again"); console.error(e); }
};

window.deleteGame = async function(id) {
  if (!confirm("Delete this match and all its players?")) return;
  try {
    await deleteDoc(doc(db, "games", id));
    if (adminViewGameId === id) adminViewGameId = null;
    showToast("Match deleted");
  } catch(e) { showToast("Error — try again"); }
};

window.toggleLock = async function(id) {
  const game = games.find(g => g.id === id);
  if (!game) return;
  try {
    await updateDoc(doc(db, "games", id), { locked: !game.locked });
    showToast(game.locked ? "Registration open ✅" : "Registration locked 🔒");
  } catch(e) { showToast("Error — try again"); }
};

window.viewPlayers = function(id) {
  adminViewGameId = adminViewGameId === id ? null : id;
  render();
};

window.removePlayer = async function(gameId, idx) {
  const game = games.find(g => g.id === gameId);
  if (!game) return;
  const name = game.players[idx];
  try {
    await updateDoc(doc(db, "games", gameId), { players: arrayRemove(name) });
    showToast(`${name} removed`);
  } catch(e) { showToast("Error — try again"); }
};

// ── REALTIME LISTENER ──
const q = query(gamesCol, orderBy("date"));
onSnapshot(q, (snapshot) => {
  games = snapshot.docs.map(d => ({ id: d.id, ...d.data(), players: d.data().players || [] }));
  render();
});
