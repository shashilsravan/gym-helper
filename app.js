/* ===========================================================
   Personal Gym Diary — vanilla JS, localStorage, zero build.
   =========================================================== */
(function () {
  "use strict";
  const KEY = "gymdiary_v1";
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- inline SVG icons (no emojis) ---------- */
  function svg(inner, fill) {
    return `<svg class="micon" viewBox="0 0 24 24" fill="${fill ? "currentColor" : "none"}" stroke="${fill ? "none" : "currentColor"}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }
  const ICONS = {
    bolt: `<path d="M13 2 5 13h6l-1 9 9-12h-6z"/>`,
    posture: `<circle cx="12" cy="4.6" r="2"/><path d="M12 6.6v6.4M12 9l-4 2.2M12 9l4 2.2M9 21l3-7.5 3 7.5"/>`,
    nutrition: `<path d="M6 3v5a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M8 10v11M16.5 3c-1.4 0-2.2 1.9-2.2 4.2s.8 3.6 2.2 3.6M16.5 3v18"/>`,
    pill: `<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(45 12 12)"/><path d="M8.8 8.8l6.4 6.4"/>`,
    target: `<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>`,
    warn: `<path d="M12 3.2 2.6 20h18.8z"/><path d="M12 10v4.2M12 17.2h.01"/>`,
    download: `<path d="M12 3.5v11M7.5 10.5l4.5 4 4.5-4M5 20h14"/>`,
    upload: `<path d="M12 20.5v-11M7.5 13.5l4.5-4 4.5 4M5 4h14"/>`,
    trash: `<path d="M4 6.5h16M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5M6.5 6.5 7.5 20a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-13.5"/>`,
    plus: `<path d="M12 5.5v13M5.5 12h13"/>`,
    flame: `<path d="M12.8 2c.4 2.4 1.8 3.5 3 5 1.2 1.6 2.2 3.2 2.2 5.7a6 6 0 1 1-12 0c0-1.5.5-2.7 1.4-3.7-.1 1 .5 2 1.4 2.6-.4-1.9.2-4 1.4-5.3 1-1.1.8-2.7.5-4.1 1 .5 1.9 1.5 2.4 2.9.5-1.1.4-2.3-.7-3.1z"/>`,
    today: `<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/>`,
    chevL: `<path d="M14.5 5l-7 7 7 7"/>`,
    chevR: `<path d="M9.5 5l7 7-7 7"/>`,
    chevD: `<path d="M5 9l7 7 7-7"/>`,
    moon: `<path d="M20 14.2A8 8 0 0 1 9.8 4 7 7 0 1 0 20 14.2z"/>`,
    sun: `<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6"/>`,
    check: `<path d="M5 13l4 4L19 7"/>`,
    user: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>`,
    // goal icons (iOS line style)
    cut: `<path d="M13 2.5c.4 2.5 1.9 3.6 3.1 5.2 1.2 1.6 2.1 3.2 2.1 5.4a6.2 6.2 0 1 1-12.4 0c0-1.5.5-2.8 1.5-3.8-.1 1.1.5 2.1 1.5 2.7-.5-2 .2-4.1 1.4-5.4 1.1-1.2.9-2.8.5-4.3 1 .6 2 1.6 2.5 3 .5-1.1.4-2.4-.7-2.8z"/>`,
    trophy: `<path d="M8 4h8v4a4 4 0 0 1-8 0V4z"/><path d="M8 5H5v1a3 3 0 0 0 3 3M16 5h3v1a3 3 0 0 1-3 3M10 13.5h4M9 21h6M12 13.5V21"/>`,
    bell: `<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/>`,
    droplet: `<path d="M12 3.5c3 4 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 3-6 6-10z"/>`,
    timer: `<circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 2h6"/>`,
    download2: `<path d="M12 3.5v11M7.5 10.5l4.5 4 4.5-4M5 20h14"/>`,
    bulk: `<path d="M4 20h16M7 20v-7M12 20V8M17 20v-4"/><path d="M14.5 6.5 17 4l2.5 2.5"/>`,
    heart: `<path d="M12 20.4S3.6 15.7 3.6 9.9A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 8.4 1.9c0 5.8-8.4 10.5-8.4 10.5z"/>`
  };

  /* Apple-Fitness double ring for a calendar day (outer = workout, inner = macros) */
  function dayRings(wpct, mpct, o) {
    o = o || {};
    const size = 44, c = size / 2, sw = 3.2;
    const rO = c - sw / 2 - 0.5;        // outer ring radius
    const rI = rO - sw - 1.6;           // inner ring radius
    const cO = 2 * Math.PI * rO, cI = 2 * Math.PI * rI;
    const clamp = v => Math.max(0, Math.min(100, v));
    const offO = cO * (1 - clamp(wpct) / 100), offI = cI * (1 - clamp(mpct) / 100);
    const wcol = o.wcol || "var(--green)", mcol = o.mcol || "var(--blue)";
    return `<svg viewBox="0 0 ${size} ${size}" class="dayrings">
      <circle cx="${c}" cy="${c}" r="${rO}" fill="none" stroke="var(--track)" stroke-width="${sw}"/>
      <circle cx="${c}" cy="${c}" r="${rI}" fill="none" stroke="var(--track)" stroke-width="${sw}"/>
      <circle cx="${c}" cy="${c}" r="${rO}" fill="none" stroke="${wcol}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${cO.toFixed(1)}" stroke-dashoffset="${offO.toFixed(1)}" transform="rotate(-90 ${c} ${c})"/>
      <circle cx="${c}" cy="${c}" r="${rI}" fill="none" stroke="${mcol}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${cI.toFixed(1)}" stroke-dashoffset="${offI.toFixed(1)}" transform="rotate(-90 ${c} ${c})"/>
    </svg>`;
  }

  /* Apple-style activity ring (rounded-cap SVG arc) */
  function ringSVG(pct, o) {
    o = o || {};
    const size = o.size || 68, sw = o.sw || 7, r = (size - sw) / 2, c = 2 * Math.PI * r;
    const p = Math.max(0, Math.min(100, pct));
    const off = c * (1 - p / 100);
    const col = o.color || "var(--green)";
    const cx = size / 2;
    return `<div class="ringwrap" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--track)" stroke-width="${sw}"/>
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"
          stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${cx} ${cx})"/>
      </svg>
      <div class="ringctr">${o.center || ""}</div>
    </div>`;
  }

  /* ---------- state ---------- */
  let state = load();
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || blank(); }
    catch (e) { return blank(); }
  }
  function blank() { return { logs: {}, customGifs: {}, targets: {}, weights: {} }; }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  if (!state.targets) state.targets = {};
  if (!state.weights) state.weights = {};
  if (!state.settings) state.settings = { restSeconds: 90 };
  if (!state.reminders) state.reminders = { workout: false, macros: false, water: { on: false, every: 2, start: 8, end: 22 }, _last: {} };
  // existing users (history but no profile) default to Athletic, skip onboarding
  if (!state.profile && Object.keys(state.logs).length > 0) {
    state.profile = { goal: "athletic", heightCm: null, startDate: Object.keys(state.logs).sort()[0] };
    save();
  }

  /* ---------- goal / templates ---------- */
  function curGoal() { return (state.profile && state.profile.goal) || "athletic"; }
  function tmpl(g) { return window.TEMPLATES[g] || window.TEMPLATES.athletic; }
  function activeSched() { return tmpl(curGoal()).schedule; }
  function schedFor(log) { return tmpl((log && log.goal) || curGoal()).schedule; }

  /* ---------- targets (template defaults, editable per user) ---------- */
  function defaultTargets() { return tmpl(curGoal()).targets; }
  function loadTargets() {
    const def = defaultTargets(), saved = state.targets || {};
    const out = {};
    Object.keys(def).forEach(k => { out[k] = Object.assign({}, def[k], saved[k] || {}); });
    return out;
  }
  let TARGETS = loadTargets();

  /* ---------- dates ---------- */
  const pad = n => String(n).padStart(2, "0");
  const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayKey = () => fmt(new Date());
  const parseKey = k => { const [y, m, dd] = k.split("-").map(Number); return new Date(y, m - 1, dd); };
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  /* ---------- theme ---------- */
  function applyTheme() {
    const pref = localStorage.getItem("gymdiary_theme") || "auto";
    const mode = pref === "auto"
      ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : pref;
    document.documentElement.setAttribute("data-theme", mode);
    const tc = mode === "light" ? "#f2f2f7" : "#000000";
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", tc);
  }
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    if ((localStorage.getItem("gymdiary_theme") || "auto") === "auto") applyTheme();
  });

  /* ---------- log helpers ---------- */
  function getLog(date) {
    if (!state.logs[date]) {
      const wd = parseKey(date).getDay();
      state.logs[date] = { dayKey: WEEKDAY_DEFAULT[wd], goal: curGoal(), progress: {}, nutrition: {} };
    }
    const l = state.logs[date];
    if (!l.progress) l.progress = {};
    if (!l.nutrition) l.nutrition = {};
    if (!l.goal) l.goal = curGoal();
    return l;
  }
  function prog(date) {
    const l = getLog(date);
    if (!l.progress[l.dayKey]) l.progress[l.dayKey] = { sets: {}, done: {} };
    return l.progress[l.dayKey];
  }

  /* ---------- gif resolution ---------- */
  function gifFor(name) {
    return state.customGifs[name] || (window.EXERCISE_META[name] && window.EXERCISE_META[name].gif) || null;
  }
  function howtoFor(name) {
    return (window.EXERCISE_META[name] && window.EXERCISE_META[name].howto) || null;
  }

  /* ---------- completion / status ---------- */
  function trackableItems(day) {
    // every item across sections is trackable (sets-based or single toggle)
    const out = [];
    day.sections.forEach((sec, si) =>
      sec.items.forEach((it, ii) => out.push({ id: si + "-" + ii, sec, it })));
    return out;
  }
  function setsDone(p, id) {
    const L = p.loads && p.loads[id];
    if (L) return L.filter(s => s && s.done).length;
    return (p.sets && p.sets[id]) || 0;   // legacy data
  }
  function loadsFor(p, id, n) {
    if (!p.loads) p.loads = {};
    if (!p.loads[id]) {
      p.loads[id] = [];
      const legacy = (p.sets && p.sets[id]) || 0;     // migrate old set-count
      for (let i = 0; i < n; i++) p.loads[id].push({ w: "", reps: "", done: i < legacy });
    }
    while (p.loads[id].length < n) p.loads[id].push({ w: "", reps: "", done: false });
    return p.loads[id];
  }
  function itemDone(p, entry) {
    const { id, it } = entry;
    if (it.sets) return setsDone(p, id) >= it.sets;
    return !!(p.done && p.done[id]);
  }
  function currentItem(id) {
    const day = activeSched()[getLog(selectedDate).dayKey];
    const [si, ii] = id.split("-").map(Number);
    return day && day.sections[si] ? { sec: day.sections[si], it: day.sections[si].items[ii] } : null;
  }

  /* ---------- exercise history / suggestions ---------- */
  const e1rm = (w, r) => (+w || 0) * (1 + (+r || 0) / 30);
  function weekIndexFor(date) {
    const start = parseKey((state.profile && state.profile.startDate) || todayKey());
    return Math.max(1, Math.floor((parseKey(date) - start) / (7 * 86400000)) + 1);
  }
  function suggestedWeight(name, week) {
    const f = window.LOAD_FACTORS[name];
    if (f === undefined) return null;
    if (f === "bw") return "Bodyweight";
    const bw = latestWeight();
    if (!bw) return null;
    const mod = window.GOAL_MOD[curGoal()] || 1;
    const base = bw * f * mod * 0.6;                       // beginner starts ~60%
    const w = base * (1 + 0.025 * (week - 1));            // ~2.5% / week
    const capped = Math.min(w, base * 1.6);
    return Math.max(2.5, Math.round(capped / 2.5) * 2.5);
  }
  function exHistory(name) {
    const out = [];
    Object.keys(state.logs).sort().forEach(date => {
      const log = state.logs[date], dk = log.dayKey, day = schedFor(log)[dk];
      if (!day || !day.sections) return;
      const p = log.progress && log.progress[dk]; if (!p || !p.loads) return;
      day.sections.forEach((s, si) => s.items.forEach((it, ii) => {
        if (it.name !== name) return;
        const L = p.loads[si + "-" + ii]; if (!L) return;
        let top = null, vol = 0;
        L.forEach(set => {
          if (set && set.done && +set.reps > 0) {
            const w = +set.w || 0, r = +set.reps, e = e1rm(w, r);
            vol += w * r; if (!top || e > top.e) top = { w, reps: r, e };
          }
        });
        if (top) out.push({ date, top, vol });
      }));
    });
    return out;
  }
  function lastEntry(name, before) {
    const h = exHistory(name).filter(x => x.date < before);
    return h.length ? h[h.length - 1] : null;
  }
  function isPR(name, date, p, id) {
    const L = p.loads && p.loads[id]; if (!L) return false;
    let today = 0; L.forEach(s => { if (s && s.done && +s.reps > 0) today = Math.max(today, e1rm(s.w, s.reps)); });
    if (today <= 0) return false;
    const prev = exHistory(name).filter(x => x.date !== date);
    const best = prev.reduce((m, x) => Math.max(m, x.top.e), 0);
    return today > best && best > 0;
  }
  function shortD(date) { const d = parseKey(date); return d.getDate() + " " + MONTHS[d.getMonth()]; }
  function dayStatus(date) {
    const l = state.logs[date];
    const wd = parseKey(date).getDay();
    const dk = l ? l.dayKey : WEEKDAY_DEFAULT[wd];
    const day = schedFor(l)[dk];
    const p = (l && l.progress && l.progress[dk]) || { sets: {}, done: {} };
    const items = trackableItems(day);
    let done = 0, mainDone = 0, mainTotal = 0;
    items.forEach(e => {
      const d = itemDone(p, e);
      if (d) done++;
      if (e.sec.kind === "main") { mainTotal++; if (d) mainDone++; }
    });
    const ratio = items.length ? done / items.length : 0;
    let status;
    if (day.rest) status = done > 0 ? "rest" : (isPast(date) ? "none" : "none");
    else if (mainDone >= 1 && ratio >= 0.8) status = "done";
    else if (done > 0) status = "part";
    else status = isPast(date) ? "miss" : "none";
    return { dk, day, status, done, total: items.length, ratio, mainDone, mainTotal };
  }
  function isPast(date) { return parseKey(date) < parseKey(todayKey()); }

  /* ---------- streak ---------- */
  function computeStreak() {
    let n = 0; const cur = new Date();
    for (let i = 0; i < 400; i++) {
      const k = fmt(cur);
      const s = dayStatus(k).status;
      if (s === "done" || s === "part") n++;
      else if (s === "rest") { /* rest bridges */ }
      else if (i === 0) { /* today not done yet — don't break */ }
      else if (cur.getDay() === 0) { /* unlogged Sunday bridges */ }
      else break;
      cur.setDate(cur.getDate() - 1);
    }
    return n;
  }

  /* ===========================================================
     RENDER
     =========================================================== */
  let tab = "today";
  let selectedDate = todayKey();   // Today + Macros operate on this date
  let calMonth = (function () { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; })();
  let onbGoal = null;              // goal picked during onboarding

  /* ---------- profile / bodyweight ---------- */
  function earliestLogDate() {
    const keys = Object.keys(state.logs || {}).sort();
    return keys[0] || todayKey();
  }
  function weightEntries() {
    return Object.keys(state.weights || {}).sort().map(d => ({ date: d, kg: +state.weights[d] }));
  }
  function latestWeight() {
    const e = weightEntries(); return e.length ? e[e.length - 1].kg : null;
  }
  function bmi() {
    const w = latestWeight(), h = state.profile && state.profile.heightCm;
    if (!w || !h) return null;
    return +(w / Math.pow(h / 100, 2)).toFixed(1);
  }
  function weightTrendHTML() {
    const e = weightEntries();
    if (!e.length) return "";
    const start = e[0].kg, last = e[e.length - 1].kg, d = +(last - start).toFixed(1);
    if (e.length < 2) return `<div class="pf-trend">Logged <b>${last}kg</b>. Log again next month to track the trend.</div>`;
    const sd = parseKey(e[0].date);
    const cls = d < 0 ? "s-good" : d > 0 ? "s-warn" : "";
    return `<div class="pf-trend">Since ${sd.getDate()} ${MONTHS[sd.getMonth()]}: <b class="${cls}">${d > 0 ? "+" : ""}${d}kg</b> &nbsp;(${start} → ${last}kg)</div>`;
  }
  function render() {
    const onb = !state.profile;
    document.body.classList.toggle("onboarding", onb);
    if (onb) { $("#view").innerHTML = viewOnboarding(); return; }
    const now = new Date();
    $("#todayDate").textContent = `${DOW[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;
    $("#streakCount").textContent = computeStreak();
    const resolved = document.documentElement.getAttribute("data-theme");
    const tt = $("#themeToggle"); if (tt) tt.innerHTML = svg(resolved === "dark" ? ICONS.sun : ICONS.moon);
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    const v = $("#view");
    if (tab === "today") v.innerHTML = viewToday();
    else if (tab === "macros") v.innerHTML = viewMacros();
    else if (tab === "history") v.innerHTML = viewHistory();
    else v.innerHTML = viewPlan();
    // NOTE: no scroll reset here — in-place updates (logging a set) must keep
    // the user's scroll position. Tab/date changes scroll to top explicitly.
  }
  function toTop() { window.scrollTo(0, 0); }

  /* ---------- TODAY (logs the selectedDate) ---------- */
  function relDateLabel(date) {
    const diff = Math.round((parseKey(todayKey()) - parseKey(date)) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff > 1) return diff + " days ago";
    return "Upcoming";
  }
  /* ---------- ONBOARDING ---------- */
  let onbH = "", onbW = "";
  function viewOnboarding() {
    const cards = window.TEMPLATE_ORDER.map(k => {
      const t = window.TEMPLATES[k];
      return `<button class="goal-card${onbGoal === k ? " on" : ""}" onclick="GD.pickGoal('${k}')">
        <span class="goal-ic">${svg(ICONS[t.icon] || ICONS.today)}</span>
        <span class="goal-txt"><span class="goal-name">${t.name}</span><span class="goal-blurb">${t.blurb}</span></span>
        <span class="goal-tick">${svg(ICONS.check)}</span>
      </button>`;
    }).join("");
    return `<div class="onb">
      <div class="onb-mark">${svg(ICONS.today)}</div>
      <h1 class="onb-title">Welcome to Gym&nbsp;Diary</h1>
      <p class="onb-sub">Pick your goal — we'll set up your Monday–Saturday routine and daily macro targets. You can change everything later.</p>
      <div class="goal-grid">${cards}</div>
      <div class="onb-fields">
        <label class="onb-field"><span>Height</span><div class="onb-inp"><input id="onbHeight" type="number" inputmode="numeric" placeholder="164" value="${onbH}" oninput="GD.onb('h',this.value)"><i>cm</i></div></label>
        <label class="onb-field"><span>Weight</span><div class="onb-inp"><input id="onbWeight" type="number" inputmode="decimal" placeholder="69" value="${onbW}" oninput="GD.onb('w',this.value)"><i>kg</i></div></label>
      </div>
      <button class="onb-start" onclick="GD.finishOnboarding()">Start training →</button>
      <p class="onb-foot">Everything stays private on your device.</p>
    </div>`;
  }

  function dateBarHTML() {
    const date = selectedDate, isToday = date === todayKey(), dt = parseKey(date);
    return `<div class="datebar${isToday ? "" : " editing"}">
      <button class="datenav" aria-label="Previous day" onclick="GD.shiftDate(-1)">${svg(ICONS.chevL)}</button>
      <label class="datefield">
        <span class="datefield-main">${DOW[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]}</span>
        <span class="datefield-sub">${relDateLabel(date)}${isToday ? "" : " · editing"}</span>
        <input type="date" value="${date}" max="${todayKey()}" onchange="GD.setDate(this.value)">
      </label>
      <button class="datenav" aria-label="Next day"${isToday ? " disabled" : ""} onclick="GD.shiftDate(1)">${svg(ICONS.chevR)}</button>
      ${isToday ? "" : `<button class="today-jump" onclick="GD.gotoToday()">Today</button>`}
    </div>`;
  }
  function viewToday() {
    const date = selectedDate;
    const l = getLog(date);
    const day = activeSched()[l.dayKey];
    const st = dayStatus(date);

    let html = dateBarHTML();

    // workout-split select
    const opts = Object.keys(activeSched()).map(dk => {
      const d = activeSched()[dk];
      return `<option value="${dk}"${dk === l.dayKey ? " selected" : ""}>${d.label} · ${d.rest ? "Full rest" : d.focus}</option>`;
    }).join("");
    html += `<div class="splitselect">
      <span class="splitselect-ic">${svg(ICONS.today)}</span>
      <select aria-label="Choose workout split" onchange="GD.pickDay(this.value)">${opts}</select>
      <span class="splitselect-chev">${svg(ICONS.chevD)}</span>
    </div>`;

    // hero
    html += heroCard(day, st);

    if (day.priority_note)
      html += `<div class="priority-banner">${svg(ICONS.bolt, true)}<span>${day.priority_note}</span></div>`;

    const p = prog(date);
    day.sections.forEach((sec, si) => {
      html += `<div class="section-h"><h2>${sec.title}</h2>${sec.note ? `<span class="meta">${sec.note}</span>` : ""}</div>`;
      sec.items.forEach((it, ii) => { html += exCard(sec, si, it, ii, p); });
    });

    html += `<div style="height:8px"></div>`;
    return html;
  }
  function shortFocus(f) {
    if (typeof f !== "string") return "Workout";
    if (/Rest/i.test(f)) return "Rest";
    if (/Push/i.test(f)) return "Push"; if (/Pull/i.test(f)) return "Pull";
    if (/Legs|Lower/i.test(f)) return "Legs"; if (/Upper/i.test(f)) return "Upper";
    if (/Full\s*Body/i.test(f)) return "Full Body"; if (/Cardio/i.test(f)) return "Cardio";
    return f.split(/[—+,]/)[0].trim();
  }
  function catColorFor(day) {
    if (day.rest) return "var(--label3)";
    const map = { Push: "var(--blue)", Upper: "var(--blue)", Pull: "var(--green)", Legs: "var(--orange)", Lower: "var(--orange)", "Full Body": "var(--purple)", Cardio: "var(--pink)" };
    return map[shortFocus(day.focus)] || "var(--blue)";
  }
  function heroCard(day, st) {
    if (day.rest) {
      return `<div class="hero" style="--cat:var(--label3)"><div class="hero-top">
        <div class="hero-l"><div class="hero-day">${day.label} · Rest</div><h1>Recovery</h1></div>
        <div class="hero-ic">${svg(ICONS.moon)}</div></div>
        <div class="hero-pills"><span class="hpill">${day.secondary || "Rest"}</span></div></div>`;
    }
    const pct = Math.round(st.ratio * 100);
    const focusTitle = day.focus.replace(/^.*?—\s*/, "").replace(/\s*,\s*/g, " · ");
    const pills = [];
    if (st.mainTotal > 0) pills.push(`${st.mainTotal} ${st.mainTotal === 1 ? "exercise" : "exercises"}`);
    day.sections.forEach(s => { if (s.kind === "core") pills.push("Core"); });
    day.sections.forEach(s => { if (s.kind === "cardio") pills.push(s.title.replace(/^Cardio\s*—\s*/, "") + (s.note ? " · " + s.note : "")); });
    day.sections.forEach(s => { if (s.kind === "posture") pills.push("Neck & posture"); });
    return `<div class="hero" style="--cat:${catColorFor(day)}">
      <div class="hero-top">
        <div class="hero-l">
          <div class="hero-day">${day.label} · ${shortFocus(day.focus)}</div>
          <h1>${focusTitle}</h1>
        </div>
        ${ringSVG(pct, { size: 66, sw: 7, color: "var(--cat)", center: `<b>${pct}</b><i>%</i>` })}
      </div>
      <div class="hero-pills">${pills.map(p => `<span class="hpill">${p}</span>`).join("")}<span class="hpill hpill-stat">${st.done}/${st.total} done</span></div>
    </div>`;
  }

  function exCard(sec, si, it, ii, p) {
    const id = si + "-" + ii;
    const gif = gifFor(it.name);
    const done = it.sets ? setsDone(p, id) >= it.sets : !!(p.done && p.done[id]);
    const esc = encodeURIComponent(it.name);

    // thumbnail
    let thumb;
    if (gif) {
      thumb = `<img src="${gif}" alt="" loading="lazy"
                 onerror="GD.gifErr(this,'${esc}')" onclick="GD.howto('${esc}')">`;
    } else {
      thumb = `<div class="addgif" onclick="GD.addGif('${esc}')">${svg(ICONS.plus)}<span>Add GIF</span></div>`;
    }

    // tags
    let tags = "";
    if (it.sets) {
      const remaining = it.sets - setsDone(p, id);
      tags += `<span class="tag">${it.sets} × ${it.reps || ""}</span>`;
      tags += `<span class="tag reps">${remaining > 0 ? remaining + " sets left" : "all sets ✓"}</span>`;
    } else if (it.reps) {
      tags += `<span class="tag">${it.reps}</span>`;
    }
    if (it.priority) tags += `<span class="tag crit">${it.priority}</span>`;
    if (it.sets && isPR(it.name, selectedDate, p, id)) tags += `<span class="tag pr">${svg(ICONS.trophy)} PR</span>`;

    // weight × reps logging (sets-based items only)
    let body = "";
    if (it.sets) {
      const week = weekIndexFor(selectedDate);
      const sugg = suggestedWeight(it.name, week);
      const last = lastEntry(it.name, selectedDate);
      const repsHint = ("" + (it.reps || "")).match(/\d+/);
      const rHint = repsHint ? repsHint[0] : "reps";
      const wPlaceholder = typeof sugg === "number" ? sugg : (sugg === "Bodyweight" ? "BW" : "kg");
      let sub = "";
      if (sugg != null) sub += `<span class="sugg">${typeof sugg === "number" ? "≈ " + sugg + " kg wk " + week : sugg}</span>`;
      if (last) sub += `<span class="lasttime">Last: ${last.top.w ? last.top.w + "kg × " : ""}${last.top.reps} · ${shortD(last.date)}</span>`;
      const L = loadsFor(p, id, it.sets);
      const rows = L.map((s, sx) => `<div class="setrow${s.done ? " done" : ""}">
        <span class="setno">${sx + 1}</span>
        <input class="setw" type="number" inputmode="decimal" value="${s.w !== "" && s.w != null ? s.w : ""}" placeholder="${wPlaceholder}" onchange="GD.logSet('${id}',${sx},'w',this.value)" onfocus="this.select()">
        <span class="setx">×</span>
        <input class="setr" type="number" inputmode="numeric" value="${s.reps !== "" && s.reps != null ? s.reps : ""}" placeholder="${rHint}" onchange="GD.logSet('${id}',${sx},'reps',this.value)" onfocus="this.select()">
        <button class="setdone${s.done ? " on" : ""}" aria-label="Set ${sx + 1} done" onclick="GD.toggleSet('${id}',${sx})">${svg(ICONS.check)}</button>
      </div>`).join("");
      body = `${sub ? `<div class="exsub">${sub}</div>` : ""}<div class="setlog">${rows}</div>`;
    }

    const howBtn = (howtoFor(it.name) || gif) ? `<button class="howto-btn" onclick="GD.howto('${esc}')">How to ›</button>` : "";
    const progBtn = it.sets ? `<button class="howto-btn" onclick="GD.exHistorySheet('${esc}')">Progress ›</button>` : "";
    const doneBtn = !it.sets ? `<button class="donebtn${done ? " on" : ""}" onclick="GD.toggleDone('${id}')">${done ? svg(ICONS.check) + " Done" : "Mark done"}</button>` : "";

    return `<div class="ex${done ? " done" : ""}">
      <div class="ex-head">
        <div class="ex-thumb">${thumb}</div>
        <div class="ex-meta">
          <div class="ex-name">${it.name}</div>
          <div class="ex-tags">${tags}</div>
          ${it.note ? `<div class="ex-note">${it.note}</div>` : ""}
        </div>
      </div>
      ${body ? `<div class="ex-log">${body}</div>` : ""}
      <div class="ex-foot">${howBtn}${progBtn}<span class="spacer"></span>${doneBtn}</div>
    </div>`;
  }

  /* ---------- MACROS ---------- */
  const STEPS = { calories: 50, protein: 5, carbs: 10, fats: 5, water: 0.25 };
  const NAMES = { calories: "Calories", protein: "Protein", carbs: "Carbs", fats: "Fats", water: "Water" };
  function viewMacros() {
    const date = selectedDate;
    const isToday = date === todayKey();
    const n = getLog(date).nutrition;
    let html = dateBarHTML();
    html += `<div class="section-h"><h2>${isToday ? "Today's intake" : "Intake"}</h2><span class="meta">auto-saved · tap +/− or type</span></div>`;
    Object.keys(TARGETS).forEach(k => { html += macroCard(k, +n[k] || 0); });

    // summary ring
    const metCount = Object.keys(TARGETS).filter(k => macroEval(k, +n[k] || 0).cls === "good").length;
    const pctMet = (metCount / 5) * 100;
    const blurb = metCount === 5 ? "Perfect day — every macro on point." : "Close your ring by hitting all five targets.";
    html += `<div class="card ringcard">
      ${ringSVG(pctMet, { size: 76, sw: 8, color: metCount === 5 ? "var(--green)" : "var(--blue)", center: `<b>${metCount}</b><span>of 5</span>` })}
      <div class="ringcard-txt"><div class="ringcard-t">Targets met today</div><div class="muted small">${blurb}</div></div>
    </div>`;
    html += `<p class="muted small" style="line-height:1.5;margin:4px 6px 20px">
      ${PLAN.nutrition_tips.strategy} Water also fights face-fat — it's partly retention.</p>`;
    return html;
  }
  function macroEval(k, val) {
    const t = TARGETS[k];
    if (val <= 0) return { cls: "warn", txt: "Not logged yet", fill: "f-warn", pct: 0 };
    const pct = Math.min(val / t.max, 1) * 100;
    if (t.mode === "atLeast") {
      if (val >= t.min) return { cls: "good", txt: "Target met ✓", fill: "f-good", pct };
      return { cls: "warn", txt: `${round(t.min - val)}${t.unit} to go`, fill: "f-warn", pct };
    }
    // range
    if (val > t.max) return { cls: "bad", txt: `${round(val - t.max)}${t.unit} over — ease off`, fill: "f-bad", pct: 100 };
    if (val >= t.min) return { cls: "good", txt: "On target ✓", fill: "f-good", pct };
    return { cls: "warn", txt: `${round(t.min - val)}${t.unit} under target`, fill: "f-warn", pct };
  }
  function macroCard(k, val) {
    const t = TARGETS[k], e = macroEval(k, val);
    const markPct = Math.min(t.min / t.max, 1) * 100; // floor marker
    return `<div class="card macro">
      <div class="macro-top">
        <span class="macro-name">${NAMES[k]}</span>
        <span class="macro-val"><b>${round(val)}</b> / ${t.min}–${t.max} ${t.unit}</span>
      </div>
      <div class="bar"><i class="${e.fill}" style="width:${e.pct}%"></i><span class="target" style="left:${markPct}%"></span></div>
      <div class="macro-status s-${e.cls}">${e.txt}</div>
      <div class="stepper">
        <button onclick="GD.macro('${k}',-1)">−</button>
        <input type="number" inputmode="decimal" value="${round(val)}" onchange="GD.macroSet('${k}',this.value)">
        <button onclick="GD.macro('${k}',1)">+</button>
      </div>
      <div class="macro-foot"><span>step ${STEPS[k]}${t.unit}</span><span>floor ${t.min}${t.unit}</span></div>
    </div>`;
  }
  function round(x) { return Math.round(x * 100) / 100; }

  /* ---------- HISTORY ---------- */
  function macrosMet(n) {
    return Object.keys(TARGETS).filter(k => macroEval(k, +(n && n[k]) || 0).cls === "good").length;
  }
  function monthlyAverages(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const keys = Object.keys(TARGETS), sums = {}; keys.forEach(k => sums[k] = 0);
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = fmt(new Date(year, month, d));
      if (parseKey(date) > parseKey(todayKey())) break;
      const log = state.logs[date];
      if (log && log.nutrition && +log.nutrition.calories > 0) {
        count++; keys.forEach(k => sums[k] += +log.nutrition[k] || 0);
      }
    }
    const macros = {};
    keys.forEach(k => {
      const t = TARGETS[k], avg = count ? sums[k] / count : 0, goal = (t.min + t.max) / 2;
      const coverage = goal ? Math.round(avg / goal * 100) : 0;
      let cls;
      if (t.mode === "atLeast") cls = coverage >= 90 ? "good" : "warn";
      else cls = coverage > 110 ? "bad" : (coverage >= 90 ? "good" : "warn");
      macros[k] = { avg: k === "water" ? round(avg) : Math.round(avg), coverage, cls };
    });
    return { count, macros };
  }
  function viewHistory() {
    const year = calMonth.getFullYear(), month = calMonth.getMonth();
    const now = new Date();
    const isCurMonth = year === now.getFullYear() && month === now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first

    // monthly stats
    let trained = 0, macroDays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = fmt(new Date(year, month, d));
      if (parseKey(date) > parseKey(todayKey())) break;
      const s = dayStatus(date).status;
      if (s === "done" || s === "part") trained++;
      const log = state.logs[date];
      if (log && log.nutrition && +log.nutrition.calories > 0) macroDays++;
    }
    const streak = computeStreak();

    let html = `<div class="statgrid">
      <div class="stat"><div class="n">${streak}<span class="stat-flame">${svg(ICONS.flame, true)}</span></div><div class="l">Day streak</div></div>
      <div class="stat"><div class="n">${trained}</div><div class="l">Trained</div></div>
      <div class="stat"><div class="n">${macroDays}</div><div class="l">Macros logged</div></div>
    </div>`;

    // month navigator
    html += `<div class="month-nav">
      <button aria-label="Previous month" onclick="GD.shiftMonth(-1)">${svg(ICONS.chevL)}</button>
      <div class="month-title">${MONTHS_FULL[month]} ${year}</div>
      <button aria-label="Next month"${isCurMonth ? " disabled" : ""} onclick="GD.shiftMonth(1)">${svg(ICONS.chevR)}</button>
    </div>`;

    // calendar grid (Monday-first)
    html += `<div class="cal"><div class="cal-head">${["M", "T", "W", "T", "F", "S", "S"].map(x => `<span>${x}</span>`).join("")}</div><div class="cal-grid">`;
    for (let i = 0; i < startOffset; i++) html += `<span class="cal-day blank"></span>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = fmt(new Date(year, month, d));
      const isToday = date === todayKey();
      const future = parseKey(date) > parseKey(todayKey());
      if (future) {
        html += `<span class="cal-day st-future"><span class="cal-rings">${dayRings(0, 0, { wcol: "var(--track)", mcol: "var(--track)" })}</span><span class="cal-num">${d}</span></span>`;
        continue;
      }
      const st = dayStatus(date), day = st.day;
      const log = state.logs[date], n = (log && log.nutrition) || {};
      const wpct = day.rest ? (st.status === "rest" ? 100 : 0) : Math.round(st.ratio * 100);
      const mpct = Math.round(macrosMet(n) / 5 * 100);
      const wcol = day.rest ? "var(--label3)" : "var(--green)";
      html += `<button class="cal-day${isToday ? " is-today" : ""}" onclick="GD.dayDetail('${date}')">
        <span class="cal-rings">${dayRings(wpct, mpct, { wcol })}</span>
        <span class="cal-num">${d}</span>
      </button>`;
    }
    html += `</div>
      <div class="cal-legend">
        <span><i class="lg-ring lg-ring-w"></i>Workout</span>
        <span><i class="lg-ring lg-ring-m"></i>Macros</span>
        <span class="cal-legend-note">rings fill with % completed</span>
      </div></div>`;

    html += `<p class="muted small" style="text-align:center;margin:14px 6px 8px;line-height:1.5">Tap any day for its workout % and macros %.</p>`;

    // monthly averages vs targets
    const avg = monthlyAverages(year, month);
    if (avg.count > 0) {
      html += `<div class="section-h"><h2>Monthly averages</h2><span class="meta">${avg.count} logged ${avg.count === 1 ? "day" : "days"}</span></div>`;
      html += `<div class="card">`;
      Object.keys(TARGETS).forEach(k => {
        const t = TARGETS[k], a = avg.macros[k];
        const fill = a.cls === "good" ? "f-good" : a.cls === "bad" ? "f-bad" : "f-warn";
        html += `<div class="avg-row">
          <div class="avg-top"><span class="avg-name">${NAMES[k]}</span><span class="avg-pct s-${a.cls}">${a.coverage}% of goal</span></div>
          <div class="bar"><i class="${fill}" style="width:${Math.min(a.coverage, 100)}%"></i></div>
          <div class="avg-foot">avg ${a.avg}${t.unit === "kcal" ? " kcal" : t.unit} · target ${t.min}–${t.max}${t.unit === "kcal" ? " kcal" : t.unit}</div>
        </div>`;
      });
      html += `</div>`;
    }
    return html;
  }

  /* ---------- PLAN ---------- */
  function viewPlan() {
    const P = PLAN, TP = tmpl(curGoal());
    let html = `<div class="hero" style="--cat:var(--purple)">
      <div class="hero-top">
        <div class="hero-l">
          <div class="hero-day">Your plan</div>
          <h1>${TP.name}</h1>
        </div>
        <div class="hero-ic">${svg(ICONS[TP.icon] || ICONS.today)}</div>
      </div>
      <p class="hero-goal">${TP.blurb}</p>
      <div class="hero-pills"><span class="hpill">6 days · Mon–Sat</span><span class="hpill">Editable below</span></div></div>`;

    // profile
    const pf = state.profile, w = latestWeight(), b = bmi();
    html += `<div class="section-h"><h2>Profile</h2></div>`;
    html += `<div class="card profile-card">
      <div class="pf-row"><span class="pf-k">Goal</span>
        <div class="splitselect pf-select">
          <span class="splitselect-ic">${svg(ICONS.today)}</span>
          <select aria-label="Goal" onchange="GD.setGoal(this.value)">${window.TEMPLATE_ORDER.map(k => `<option value="${k}"${curGoal() === k ? " selected" : ""}>${window.TEMPLATES[k].name}</option>`).join("")}</select>
          <span class="splitselect-chev">${svg(ICONS.chevD)}</span>
        </div>
      </div>
      <div class="pf-grid">
        <div class="pf-stat"><div class="pf-n">${w != null ? w : "—"}<i>kg</i></div><div class="pf-l">Weight</div></div>
        <div class="pf-stat"><div class="pf-n">${pf.heightCm ? pf.heightCm : "—"}<i>cm</i></div><div class="pf-l">Height</div></div>
        <div class="pf-stat"><div class="pf-n">${b != null ? b : "—"}</div><div class="pf-l">BMI</div></div>
      </div>
      <div class="pf-edit">
        <label class="pf-h">Height<input type="number" inputmode="numeric" value="${pf.heightCm || ""}" placeholder="cm" onchange="GD.setHeight(this.value)"></label>
        <button class="btn pf-logw" onclick="GD.logWeight()">${svg(ICONS.plus)} Log weight</button>
      </div>
      ${weightTrendHTML()}
    </div>`;

    // editable daily targets
    html += `<div class="section-h"><h2>Daily targets</h2><span class="meta">tap a value to edit</span></div>`;
    html += `<div class="card tgt-card">`;
    Object.keys(TARGETS).forEach(k => {
      const t = TARGETS[k];
      html += `<div class="tgt-row">
        <span class="tgt-name">${NAMES[k]}</span>
        <span class="tgt-inputs">
          <input type="number" inputmode="decimal" value="${t.min}" aria-label="${NAMES[k]} minimum" onchange="GD.setTarget('${k}','min',this.value)">
          <span class="tgt-dash">–</span>
          <input type="number" inputmode="decimal" value="${t.max}" aria-label="${NAMES[k]} maximum" onchange="GD.setTarget('${k}','max',this.value)">
          <span class="tgt-unit">${t.unit}</span>
        </span>
      </div>`;
    });
    html += `</div>`;
    html += `<p class="muted small" style="margin:-2px 6px 12px;line-height:1.5">These drive your macro rings and the 4/5 "targets met" score. Set them to your own numbers — they update everywhere.</p>`;
    html += `<div class="btnrow"><button class="btn" onclick="GD.resetTargets()">Reset targets to default</button></div>`;

    // posture
    html += acc(svg(ICONS.posture) + "Daily Posture & Neck", `<p>${P.posture.when}</p>` +
      P.posture.exercises.map(e => {
        const g = gifFor(e.name), esc = encodeURIComponent(e.name);
        return `<div class="li posture-li"${g ? ` onclick="GD.howto('${esc}')"` : ""}>` +
          (g ? `<span class="posture-thumb"><img src="${g}" loading="lazy" onerror="this.parentElement.style.display='none'"></span>` : "") +
          `<span><b>${e.name}</b>${g ? ` <span class="viewtag">view ›</span>` : ""}<br>${e.detail}</span></div>`;
      }).join("") +
      `<div class="li"><b>Desk habits</b><ul style="margin:6px 0 0;padding-left:18px">${P.posture.desk.map(x => `<li>${x}</li>`).join("")}</ul></div>`, true);

    // nutrition
    html += acc(svg(ICONS.nutrition) + "Nutrition targets & sample day",
      `<p><b>Daily targets:</b> ${TARGETS.calories.min}–${TARGETS.calories.max} kcal · ${TARGETS.protein.min}–${TARGETS.protein.max}g protein · ${TARGETS.carbs.min}–${TARGETS.carbs.max}g carbs · ${TARGETS.fats.min}–${TARGETS.fats.max}g fats · ${TARGETS.water.min}–${TARGETS.water.max}L water</p>` +
      P.nutrition_tips.sample_day.map(m => `<div class="li"><b>${m.time} · ${m.meal}</b> <span class="muted">${m.kcal}</span><br>${m.food}</div>`).join("") +
      `<div class="li"><b>Cut these:</b> ${P.nutrition_tips.cut.join(", ")}.</div>`);

    // supplements
    html += acc(svg(ICONS.pill) + "Supplements",
      P.nutrition_tips.supplements.map(s => `<div class="li"><b>${s.name}</b>${s.priority.includes("HIGHLY") ? `<span class="pill">${s.priority}</span>` : `<span class="pill rec">${s.priority}</span>`}<br>${s.dose}</div>`).join(""));

    // milestones
    html += acc(svg(ICONS.target) + "Milestones",
      P.milestones.map(m => `<div class="li"><b>${m.period}</b><ul style="margin:6px 0 0;padding-left:18px">${m.points.map(x => `<li>${x}</li>`).join("")}</ul></div>`).join(""));

    // warnings
    html += acc(svg(ICONS.warn) + "Critical warnings",
      P.warnings.map(w => `<div class="li"><b>${w.topic}</b><br>${w.text}</div>`).join(""));

    // reminders
    const r = state.reminders;
    html += `<div class="section-h"><h2>Reminders</h2></div>`;
    html += `<div class="card rem-card">
      <div class="rem-row"><div class="rem-txt"><div class="rem-t">Workout nudge</div><div class="rem-s">~6pm if you haven't trained</div></div>${switchHTML(r.workout, "GD.toggleReminder('workout')")}</div>
      <div class="rem-row"><div class="rem-txt"><div class="rem-t">Log macros</div><div class="rem-s">~8pm if meals aren't logged</div></div>${switchHTML(r.macros, "GD.toggleReminder('macros')")}</div>
      <div class="rem-row"><div class="rem-txt"><div class="rem-t">Drink water</div><div class="rem-s">every ${r.water.every}h · ${fmtHour(r.water.start)}–${fmtHour(r.water.end)}</div></div>${switchHTML(r.water.on, "GD.toggleReminder('water')")}</div>
      ${r.water.on ? `<div class="rem-water">
        <label>Every<select onchange="GD.setWater('every',this.value)">${[1, 1.5, 2, 3, 4].map(x => `<option value="${x}"${r.water.every == x ? " selected" : ""}>${x}h</option>`).join("")}</select></label>
        <label>From<select onchange="GD.setWater('start',this.value)">${hourOpts(r.water.start)}</select></label>
        <label>To<select onchange="GD.setWater('end',this.value)">${hourOpts(r.water.end)}</select></label>
      </div>` : ""}
    </div>
    <p class="muted small" style="margin:-2px 6px 16px;line-height:1.5">Add the app to your Home Screen and allow notifications. Reminders fire while the app is open — iOS can't run them in the background without a server.</p>`;

    // appearance
    const theme = localStorage.getItem("gymdiary_theme") || "auto";
    html += `<div class="section-h"><h2>Appearance</h2></div>
      <div class="segmented">${["auto", "light", "dark"].map(o =>
        `<button class="seg${theme === o ? " on" : ""}" onclick="GD.setTheme('${o}')">${o[0].toUpperCase() + o.slice(1)}</button>`).join("")}</div>`;

    // data
    html += `<div class="section-h"><h2>Your data</h2></div>`;
    html += `
      <p class="muted small" style="margin:0 6px 10px;line-height:1.5">Everything is saved on this device. Export a backup or a CSV for spreadsheets.</p>
      <div class="btnrow">
        <button class="btn" onclick="GD.exportData()">${svg(ICONS.download)} Backup</button>
        <button class="btn" onclick="GD.exportCSV()">${svg(ICONS.download2)} CSV</button>
        <button class="btn" onclick="GD.importData()">${svg(ICONS.upload)} Import</button>
      </div>
      <div class="btnrow"><button class="btn danger" onclick="GD.reset()">${svg(ICONS.trash)} Reset all data</button></div>
      <input type="file" id="importFile" accept="application/json" style="display:none">
      <div style="height:10px"></div>`;
    return html;
  }
  function acc(title, body, open) {
    return `<details class="acc"${open ? " open" : ""}><summary><span class="acc-t">${title}</span><span class="chev">›</span></summary><div class="body">${body}</div></details>`;
  }

  /* ===========================================================
     ACTIONS (exposed as window.GD)
     =========================================================== */
  const GD = {
    go(t) { tab = t; render(); toTop(); },
    gotoToday() { selectedDate = todayKey(); render(); toTop(); },
    shiftMonth(delta) {
      const d = new Date(calMonth); d.setMonth(d.getMonth() + delta);
      const now = new Date();
      if (d.getFullYear() > now.getFullYear() || (d.getFullYear() === now.getFullYear() && d.getMonth() > now.getMonth())) return;
      calMonth = d; render();
    },
    setTheme(pref) { localStorage.setItem("gymdiary_theme", pref); applyTheme(); render(); },
    pickGoal(k) { onbGoal = k; render(); },
    onb(f, v) { if (f === "h") onbH = v; else onbW = v; },
    finishOnboarding() {
      const h = parseFloat(($("#onbHeight") || {}).value || onbH);
      const w = parseFloat(($("#onbWeight") || {}).value || onbW);
      if (!onbGoal) { toast("Pick a goal first"); return; }
      if (!h || !w) { toast("Enter your height and weight"); return; }
      state.profile = { goal: onbGoal, heightCm: h, startDate: todayKey() };
      state.weights = { [todayKey()]: w };
      TARGETS = loadTargets();
      save(); render(); toTop();
    },
    setGoal(k) {
      if (!state.profile) return;
      state.profile.goal = k; TARGETS = loadTargets(); save(); render();
      toast(window.TEMPLATES[k].name + " selected");
    },
    setHeight(v) { v = parseFloat(v); if (state.profile) { state.profile.heightCm = isNaN(v) ? null : v; save(); render(); } },
    logWeight() {
      const cur = latestWeight();
      const v = prompt("Log today's bodyweight (kg):", cur || "");
      const w = parseFloat(v);
      if (!isNaN(w) && w > 0) { if (!state.weights) state.weights = {}; state.weights[todayKey()] = w; save(); render(); toast("Weight logged"); }
    },
    setTarget(k, field, val) {
      val = parseFloat(val);
      if (isNaN(val) || val < 0) { render(); return; }
      if (!state.targets[k]) state.targets[k] = {};
      state.targets[k][field] = val;
      // keep min <= max sane
      const cur = Object.assign({}, defaultTargets()[k], state.targets[k]);
      if (field === "min" && val > cur.max) state.targets[k].max = val;
      if (field === "max" && val < cur.min) state.targets[k].min = val;
      TARGETS = loadTargets(); save(); render();
    },
    resetTargets() {
      if (confirm("Reset all daily targets back to the recommended defaults?")) {
        state.targets = {}; TARGETS = loadTargets(); save(); render();
      }
    },
    pickDay(dk) { getLog(selectedDate).dayKey = dk; save(); render(); /* keep scroll */ },
    shiftDate(delta) {
      const d = parseKey(selectedDate); d.setDate(d.getDate() + delta);
      const k = fmt(d);
      if (parseKey(k) > parseKey(todayKey())) return; // no future
      selectedDate = k; render(); toTop();
    },
    setDate(val) {
      if (!val) return;
      if (parseKey(val) > parseKey(todayKey())) val = todayKey();
      selectedDate = val; render(); toTop();
    },
    edit(date) { selectedDate = date; tab = "today"; render(); toTop(); },
    logSet(id, sx, field, val) {
      const p = prog(selectedDate);
      if (!p.loads) p.loads = {};
      if (!p.loads[id]) p.loads[id] = [];
      while (p.loads[id].length <= sx) p.loads[id].push({ w: "", reps: "", done: false });
      const cell = p.loads[id][sx], was = cell.done;
      const num = val === "" ? "" : Math.max(0, parseFloat(val) || 0);
      cell[field] = num;
      cell.done = +cell.reps > 0;           // a set counts once reps are in
      save(); render();
      if (!was && cell.done) startRest();   // finished a set → rest timer
    },
    toggleSet(id, sx) {
      const p = prog(selectedDate);
      if (!p.loads) p.loads = {};
      if (!p.loads[id]) p.loads[id] = [];
      while (p.loads[id].length <= sx) p.loads[id].push({ w: "", reps: "", done: false });
      const cell = p.loads[id][sx];
      if (cell.done) { cell.done = false; }
      else {
        cell.done = true;
        if (cell.reps === "" || +cell.reps === 0) {
          // autofill with this exercise's plan/suggestion for a 1-tap log
          const ent = currentItem(id);
          const rh = ent && ("" + (ent.it.reps || "")).match(/\d+/);
          cell.reps = rh ? +rh[0] : 1;
          if ((cell.w === "" || cell.w == null) && ent) {
            const sg = suggestedWeight(ent.it.name, weekIndexFor(selectedDate));
            if (typeof sg === "number") cell.w = sg;
          }
        }
        startRest();
      }
      save(); render();
    },
    toggleDone(id) {
      const p = prog(selectedDate);
      if (!p.done) p.done = {};
      p.done[id] = !p.done[id];
      save(); render();
    },
    setRest(x) { if (!state.settings) state.settings = {}; state.settings.restSeconds = x; save(); startRest(x); },
    stopRest() { clearInterval(restState.iv); restState.iv = null; clearTimeout(restState.hideTo); const b = $("#restbar"); if (b) b.classList.remove("show"); },
    exHistorySheet(esc) {
      const name = decodeURIComponent(esc), h = exHistory(name);
      let body = `<div class="grab"></div><h3>${name}</h3>`;
      if (!h.length) {
        body += `<p class="muted">No logged sets yet. Enter weight × reps on this exercise and your progress will chart here.</p>`;
      } else {
        const best = h.reduce((m, x) => x.top.e > m.top.e ? x : m, h[0]);
        body += `<div class="dd-rings" style="gap:10px">
          <div class="dd-ring"><div class="pf-n">${Math.round(best.top.w)}<i>kg</i></div><div class="pf-l">Best · ${best.top.reps} reps</div></div>
          <div class="dd-ring"><div class="pf-n">${h.length}</div><div class="pf-l">Sessions</div></div>
        </div>`;
        body += chartHTML(h);
        body += `<div class="exh-list">${h.slice(-8).reverse().map(x => `<div class="exh-row"><span>${shortD(x.date)}</span><b>${x.top.w ? x.top.w + "kg × " : ""}${x.top.reps}</b><span class="muted">vol ${Math.round(x.vol)}</span></div>`).join("")}</div>`;
      }
      body += `<button class="closebtn" onclick="GD.closeModal()">Close</button>`;
      showSheet(body);
    },
    exportCSV() {
      const rows = [["date", "goal", "workout", "section", "exercise", "set", "weight_kg", "reps", "calories", "protein_g", "carbs_g", "fats_g", "water_l"]];
      Object.keys(state.logs).sort().forEach(date => {
        const log = state.logs[date], dk = log.dayKey, day = schedFor(log)[dk], n = log.nutrition || {};
        if (day && day.sections) day.sections.forEach((s, si) => s.items.forEach((it, ii) => {
          const L = log.progress && log.progress[dk] && log.progress[dk].loads && log.progress[dk].loads[si + "-" + ii];
          if (L) L.forEach((set, sx) => { if (set && set.done) rows.push([date, log.goal || "", day.label, s.title, it.name, sx + 1, set.w || "", set.reps || "", "", "", "", "", ""]); });
        }));
        if (n.calories || n.protein || n.carbs || n.fats || n.water) rows.push([date, log.goal || "", day ? day.label : "", "Nutrition", "", "", "", "", n.calories || "", n.protein || "", n.carbs || "", n.fats || "", n.water || ""]);
      });
      const csv = rows.map(r => r.map(c => { const v = "" + c; return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(",")).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = `gym-diary-${todayKey()}.csv`; a.click(); URL.revokeObjectURL(a.href); toast("CSV exported");
    },
    toggleReminder(key) {
      const r = state.reminders;
      const willEnable = key === "water" ? !r.water.on : !r[key];
      const finish = () => {
        if (key === "water") r.water.on = !r.water.on; else r[key] = !r[key];
        save(); render();
        if (willEnable && "Notification" in window && Notification.permission !== "granted") toast("Allow notifications to get reminders");
      };
      if (willEnable && "Notification" in window && Notification.permission === "default") Notification.requestPermission().then(finish);
      else finish();
    },
    setWater(field, val) { state.reminders.water[field] = +val; save(); render(); },
    macro(k, dir) {
      const n = getLog(selectedDate).nutrition;
      n[k] = round(Math.max(0, (+n[k] || 0) + dir * STEPS[k]));
      save(); render();
    },
    macroSet(k, val) {
      const n = getLog(selectedDate).nutrition;
      n[k] = Math.max(0, +val || 0);
      save(); render();
    },
    addGif(esc) {
      const name = decodeURIComponent(esc);
      const url = prompt(`Paste a GIF/image URL for:\n"${name}"\n\n(Right-click any exercise gif online → Copy image address)`, state.customGifs[name] || "");
      if (url && /^https?:\/\//.test(url.trim())) { state.customGifs[name] = url.trim(); save(); render(); toast("GIF added ✓"); }
      else if (url !== null && url.trim() !== "") alert("Please paste a full http(s):// link.");
    },
    gifErr(img, esc) {
      img.parentElement.innerHTML = `<div class="addgif" onclick="GD.addGif('${esc}')">${svg(ICONS.plus)}<span>Add GIF</span></div>`;
    },
    howto(esc) {
      const name = decodeURIComponent(esc);
      const gif = gifFor(name), steps = howtoFor(name);
      const body = `<div class="grab"></div><h3>${name}</h3>` +
        (gif ? `<img class="gifbig" src="${gif}" alt="${name}" onerror="this.style.display='none'">` : "") +
        (steps ? `<ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>`
               : `<p class="muted">No step-by-step guide stored for this one yet. ${gif ? "" : "Add a GIF link from the card and search the movement name on YouTube."}</p>`) +
        `<button class="closebtn" onclick="GD.closeModal()">Close</button>`;
      showSheet(body);
    },
    dayDetail(date) {
      const st = dayStatus(date), day = st.day;
      const dt = parseKey(date);
      const log = state.logs[date], n = (log && log.nutrition) || {};
      const isToday = date === todayKey();
      const wpct = day.rest ? 0 : Math.round(st.ratio * 100);
      const met = macrosMet(n), mpct = Math.round(met / 5 * 100);
      const cat = catColorFor(day);
      const macroRows = Object.keys(TARGETS).map(k => {
        const t = TARGETS[k], val = +n[k] || 0, e = macroEval(k, val);
        return `<div class="dd-macro"><span class="dd-mname">${NAMES[k]}</span>
          <div class="bar"><i class="${e.fill}" style="width:${e.pct}%"></i></div>
          <span class="dd-mval${val > 0 ? "" : " dim"}">${round(val)}/${t.min}${t.unit === "kcal" ? "" : t.unit}</span></div>`;
      }).join("");
      const body = `<div class="grab"></div>
        <h3>${DOW[dt.getDay()]}, ${dt.getDate()} ${MONTHS_FULL[dt.getMonth()]}</h3>
        <div class="dd-sub">${day.label} · ${day.rest ? "Rest day" : day.focus}</div>
        <div class="dd-rings">
          <div class="dd-ring">${ringSVG(wpct, { size: 92, sw: 9, color: cat, center: `<b>${wpct}</b><i>%</i>` })}<div class="dd-rlabel">Workout<span>${day.rest ? "Rest" : st.done + "/" + st.total + " done"}</span></div></div>
          <div class="dd-ring">${ringSVG(mpct, { size: 92, sw: 9, color: "var(--green)", center: `<b>${mpct}</b><i>%</i>` })}<div class="dd-rlabel">Macros<span>${met}/5 targets</span></div></div>
        </div>
        <div class="dd-macros">${macroRows}</div>
        <div class="btnrow">
          <button class="btn" onclick="GD.editWorkout('${date}')">${svg(ICONS.today)} ${isToday ? "Open" : "Edit"} workout</button>
          <button class="btn" onclick="GD.editMacros('${date}')">${svg(ICONS.nutrition)} Log macros</button>
        </div>
        <button class="closebtn" onclick="GD.closeModal()">Close</button>`;
      showSheet(body);
    },
    editWorkout(date) { GD.closeModal(); selectedDate = date; tab = "today"; render(); toTop(); },
    editMacros(date) { GD.closeModal(); selectedDate = date; tab = "macros"; render(); toTop(); },
    toggleTheme() {
      const resolved = document.documentElement.getAttribute("data-theme");
      GD.setTheme(resolved === "light" ? "dark" : "light");
    },
    closeModal() { const m = $("#modal"); if (m) m.classList.remove("show"); },
    exportData() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `gym-diary-${todayKey()}.json`;
      a.click(); URL.revokeObjectURL(a.href); toast("Backup downloaded");
    },
    importData() {
      const inp = $("#importFile");
      inp.onchange = () => {
        const f = inp.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          try { const d = JSON.parse(r.result); if (!d.logs) throw 0; state = Object.assign(blank(), d); save(); render(); toast("Data imported ✓"); }
          catch (e) { alert("That doesn't look like a valid backup file."); }
        };
        r.readAsText(f);
      };
      inp.click();
    },
    reset() {
      if (confirm("Delete ALL workout & nutrition history on this device? This cannot be undone.")) {
        state = blank(); save(); render(); toast("All data cleared");
      }
    }
  };
  window.GD = GD;

  /* ---------- rest timer ---------- */
  const restState = { left: 0, total: 0, iv: null, hideTo: null };
  function restDefault() { return (state.settings && state.settings.restSeconds) || 90; }
  function ensureRestBar() { let b = $("#restbar"); if (!b) { b = document.createElement("div"); b.id = "restbar"; document.body.appendChild(b); } return b; }
  function startRest(sec) {
    sec = sec || restDefault();
    clearInterval(restState.iv); clearTimeout(restState.hideTo);
    restState.total = sec; restState.left = sec; renderRestBar();
    restState.iv = setInterval(() => {
      restState.left--;
      if (restState.left <= 0) { clearInterval(restState.iv); restState.iv = null; restBeep(); if (navigator.vibrate) navigator.vibrate([180, 90, 180]); }
      renderRestBar();
    }, 1000);
  }
  function renderRestBar() {
    const b = ensureRestBar(), done = restState.left <= 0;
    const l = Math.max(0, restState.left), m = Math.floor(l / 60), s = l % 60;
    const pct = restState.total ? l / restState.total * 100 : 0;
    b.className = "restbar show" + (done ? " done" : "");
    b.innerHTML = `<div class="rb-prog" style="width:${pct}%"></div>
      <div class="rb-main">
        <span class="rb-ic">${svg(done ? ICONS.check : ICONS.timer)}</span>
        <span class="rb-time">${done ? "Rest done — go" : m + ":" + String(s).padStart(2, "0")}</span>
        <div class="rb-presets">${[60, 90, 120].map(x => `<button class="rb-p${restState.total === x ? " on" : ""}" onclick="GD.setRest(${x})">${x}</button>`).join("")}</div>
        <button class="rb-x" aria-label="Dismiss timer" onclick="GD.stopRest()">${svg(ICONS.plus)}</button>
      </div>`;
    if (done) { clearTimeout(restState.hideTo); restState.hideTo = setTimeout(() => GD.stopRest(), 4000); }
  }
  function restBeep() {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      const o = a.createOscillator(), g = a.createGain();
      o.connect(g); g.connect(a.destination); o.type = "sine"; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, a.currentTime); g.gain.exponentialRampToValueAtTime(0.3, a.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.5);
      o.start(); o.stop(a.currentTime + 0.55);
    } catch (e) {}
  }

  /* ---------- mini progress chart ---------- */
  function chartHTML(h) {
    const data = h.slice(-10).map(x => x.top.w || 0);
    if (data.length < 2) return `<p class="muted small" style="margin:10px 2px">Log a couple more sessions to see your trend line.</p>`;
    const W = 300, H = 110, pad = 10, max = Math.max(...data), min = Math.min(...data), rng = (max - min) || 1;
    const sx = (W - 2 * pad) / (data.length - 1);
    const pts = data.map((v, i) => [pad + i * sx, H - pad - ((v - min) / rng) * (H - 2 * pad)]);
    const poly = pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    const dots = pts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.2" fill="var(--blue)"/>`).join("");
    return `<div class="exh-chart"><svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">
      <polyline fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${poly}"/>${dots}</svg>
      <div class="exh-axis"><span>${min}kg</span><span>${max}kg</span></div></div>`;
  }

  /* ---------- reminders ---------- */
  function fmtHour(h) { h = +h; const ap = h < 12 ? "am" : "pm"; let hr = h % 12; if (hr === 0) hr = 12; return hr + ap; }
  function hourOpts(sel) { let o = ""; for (let h = 0; h < 24; h++) o += `<option value="${h}"${+sel === h ? " selected" : ""}>${fmtHour(h)}</option>`; return o; }
  function switchHTML(on, onclick) { return `<button class="sw${on ? " on" : ""}" role="switch" aria-checked="${on}" onclick="${onclick}"><span class="sw-knob"></span></button>`; }
  function notify(title, body) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(r => r.showNotification(title, { body, icon: "icon-192.png", badge: "icon-192.png" })).catch(() => new Notification(title, { body }));
      } else new Notification(title, { body });
    } catch (e) {}
  }
  function checkReminders() {
    const r = state.reminders; if (!r) return;
    const now = new Date(), hour = now.getHours(), today = todayKey(); r._last = r._last || {};
    if (r.water && r.water.on && hour >= r.water.start && hour < r.water.end) {
      if (Date.now() - (r._last.water || 0) >= r.water.every * 3600 * 1000) {
        notify("Hydration check", "Take a few sips — keep that water topped up."); r._last.water = Date.now(); save();
      }
    }
    if (r.workout && hour === 18 && r._last.workoutDay !== today) {
      const s = dayStatus(today).status;
      if (s !== "done" && s !== "rest") notify("Training time", "Your " + activeSched()[getLog(today).dayKey].focus + " session is waiting.");
      r._last.workoutDay = today; save();
    }
    if (r.macros && hour === 20 && r._last.macrosDay !== today) {
      if (!getLog(today).nutrition.calories) notify("Log your day", "Don't forget to record today's meals.");
      r._last.macrosDay = today; save();
    }
  }
  function initReminders() { clearInterval(window.__remIv); window.__remIv = setInterval(checkReminders, 60000); }

  /* ---------- bottom sheet ---------- */
  function showSheet(inner) {
    let m = $("#modal");
    if (!m) { m = document.createElement("div"); m.id = "modal"; m.className = "modal"; m.addEventListener("click", e => { if (e.target === m) GD.closeModal(); }); document.body.appendChild(m); }
    m.innerHTML = `<div class="sheet">${inner}</div>`;
    requestAnimationFrame(() => m.classList.add("show"));
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
  }

  /* ---------- wire tabs ---------- */
  document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => GD.go(b.dataset.tab)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") GD.closeModal(); });

  applyTheme();
  initReminders();
  render();
})();
