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
    moon: `<path d="M20 14.2A8 8 0 0 1 9.8 4 7 7 0 1 0 20 14.2z"/>`
  };

  /* ---------- state ---------- */
  let state = load();
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || blank(); }
    catch (e) { return blank(); }
  }
  function blank() { return { logs: {}, customGifs: {} }; }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

  /* ---------- dates ---------- */
  const pad = n => String(n).padStart(2, "0");
  const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayKey = () => fmt(new Date());
  const parseKey = k => { const [y, m, dd] = k.split("-").map(Number); return new Date(y, m - 1, dd); };
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  /* ---------- log helpers ---------- */
  function getLog(date) {
    if (!state.logs[date]) {
      const wd = parseKey(date).getDay();
      state.logs[date] = { dayKey: WEEKDAY_DEFAULT[wd], progress: {}, nutrition: {} };
    }
    const l = state.logs[date];
    if (!l.progress) l.progress = {};
    if (!l.nutrition) l.nutrition = {};
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
  function itemDone(p, entry) {
    const { id, it } = entry;
    if (it.sets) return (p.sets[id] || 0) >= it.sets;
    return !!p.done[id];
  }
  function dayStatus(date) {
    const l = state.logs[date];
    const wd = parseKey(date).getDay();
    const dk = l ? l.dayKey : WEEKDAY_DEFAULT[wd];
    const day = PLAN.schedule[dk];
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
  let selectedDate = todayKey();   // Today tab can show/edit any date
  function render() {
    const now = new Date();
    $("#todayDate").textContent = `${DOW[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;
    $("#streakCount").textContent = computeStreak();
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
  function viewToday() {
    const date = selectedDate;
    const l = getLog(date);
    const day = PLAN.schedule[l.dayKey];
    const st = dayStatus(date);
    const isToday = date === todayKey();
    const dt = parseKey(date);

    // date navigator
    let html = `<div class="datebar${isToday ? "" : " editing"}">
      <button class="datenav" aria-label="Previous day" onclick="GD.shiftDate(-1)">${svg(ICONS.chevL)}</button>
      <label class="datefield">
        <span class="datefield-main">${DOW[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]}</span>
        <span class="datefield-sub">${relDateLabel(date)}${isToday ? "" : " · editing"}</span>
        <input type="date" value="${date}" max="${todayKey()}" onchange="GD.setDate(this.value)">
      </label>
      <button class="datenav" aria-label="Next day"${isToday ? " disabled" : ""} onclick="GD.shiftDate(1)">${svg(ICONS.chevR)}</button>
    </div>`;

    // workout-split select
    const opts = Object.keys(PLAN.schedule).map(dk => {
      const d = PLAN.schedule[dk];
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
    if (/Push/.test(f)) return "Push"; if (/Pull/.test(f)) return "Pull";
    if (/Legs/.test(f)) return "Legs"; return "Rest";
  }
  function heroCard(day, st) {
    const type = shortFocus(day.focus).toLowerCase();
    if (day.rest) {
      return `<div class="hero h-rest"><div class="hero-top">
        <div class="hero-l"><div class="hero-day">${day.label} · Rest</div><h1>Recovery</h1></div>
        <div class="hero-ic">${svg(ICONS.moon)}</div></div>
        <div class="hero-pills"><span class="hpill">${day.secondary || "Rest"}</span></div></div>`;
    }
    const pct = Math.round(st.ratio * 100);
    const focusTitle = day.focus.replace(/^.*?—\s*/, "").replace(/\s*,\s*/g, " · ");
    const pills = [`${st.mainTotal} lifts`];
    day.sections.forEach(s => { if (s.kind === "core") pills.push("Core"); });
    day.sections.forEach(s => { if (s.kind === "cardio") pills.push(s.title.replace(/^Cardio\s*—\s*/, "") + (s.note ? " · " + s.note : "")); });
    day.sections.forEach(s => { if (s.kind === "posture") pills.push("Neck & posture"); });
    return `<div class="hero h-${type}">
      <div class="hero-top">
        <div class="hero-l">
          <div class="hero-day">${day.label} · ${shortFocus(day.focus)}</div>
          <h1>${focusTitle}</h1>
        </div>
        <div class="hero-ring" style="--p:${pct}"><span><b>${pct}</b><i>%</i></span></div>
      </div>
      <div class="hero-pills">${pills.map(p => `<span class="hpill">${p}</span>`).join("")}<span class="hpill hpill-stat">${st.done}/${st.total} done</span></div>
    </div>`;
  }

  function exCard(sec, si, it, ii, p) {
    const id = si + "-" + ii;
    const gif = gifFor(it.name);
    const done = it.sets ? (p.sets[id] || 0) >= it.sets : !!p.done[id];
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
      const remaining = it.sets - (p.sets[id] || 0);
      tags += `<span class="tag">${it.sets} × ${it.reps || ""}</span>`;
      tags += `<span class="tag reps">${remaining > 0 ? remaining + " sets left" : "all sets ✓"}</span>`;
    } else if (it.reps) {
      tags += `<span class="tag">${it.reps}</span>`;
    }
    if (it.priority) tags += `<span class="tag crit">${it.priority}</span>`;

    // footer control
    let control;
    if (it.sets) {
      let dots = "";
      for (let s = 1; s <= it.sets; s++) {
        const on = (p.sets[id] || 0) >= s ? " on" : "";
        dots += `<div class="dot${on}" onclick="GD.setTap('${id}',${s},${it.sets})">${s}</div>`;
      }
      control = `<div class="sets">${dots}</div>`;
    } else {
      control = `<button class="donebtn${done ? " on" : ""}" onclick="GD.toggleDone('${id}')">${done ? "✓ Done" : "Mark done"}</button>`;
    }

    const howBtn = (howtoFor(it.name) || gif)
      ? `<button class="howto-btn" onclick="GD.howto('${esc}')">How to ›</button>` : "";

    return `<div class="ex${done ? " done" : ""}">
      <div class="ex-head">
        <div class="ex-thumb">${thumb}</div>
        <div class="ex-meta">
          <div class="ex-name">${it.name}</div>
          <div class="ex-tags">${tags}</div>
          ${it.note ? `<div class="ex-note">${it.note}</div>` : ""}
        </div>
      </div>
      <div class="ex-foot">${howBtn}<span class="spacer"></span>${control}</div>
    </div>`;
  }

  /* ---------- MACROS ---------- */
  const STEPS = { calories: 50, protein: 5, carbs: 10, fats: 5, water: 0.25 };
  const NAMES = { calories: "Calories", protein: "Protein", carbs: "Carbs", fats: "Fats", water: "Water" };
  function viewMacros() {
    const date = todayKey();
    const n = getLog(date).nutrition;
    let html = `<div class="section-h"><h2>Today's intake</h2><span class="meta">tap +/− or type</span></div>`;
    Object.keys(TARGETS).forEach(k => { html += macroCard(k, +n[k] || 0); });

    // summary ring
    const metCount = Object.keys(TARGETS).filter(k => macroEval(k, +n[k] || 0).cls === "good").length;
    const pctMet = (metCount / 5) * 100;
    const blurb = metCount === 5 ? "Perfect day — every macro on point." : "Close your ring by hitting all five targets.";
    html += `<div class="card ringcard">
      <div class="ring" style="--p:${pctMet}"><div class="ring-in"><b>${metCount}</b><span>of 5</span></div></div>
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
  function viewHistory() {
    // stats
    const streak = computeStreak();
    let week = 0; const cur = new Date();
    for (let i = 0; i < 7; i++) { const s = dayStatus(fmt(cur)).status; if (s === "done" || s === "part") week++; cur.setDate(cur.getDate() - 1); }
    const total = Object.keys(state.logs).filter(k => { const s = dayStatus(k).status; return s === "done" || s === "part"; }).length;

    let html = `<div class="statgrid">
      <div class="stat"><div class="n">${streak}<span class="stat-flame">${svg(ICONS.flame, true)}</span></div><div class="l">Streak</div></div>
      <div class="stat"><div class="n">${week}<span class="dim">/6</span></div><div class="l">This week</div></div>
      <div class="stat"><div class="n">${total}</div><div class="l">Sessions</div></div>
    </div>`;

    html += `<div class="section-h"><h2>Last 14 days</h2><span class="meta">tap a day to log / edit</span></div>`;
    const rows = [];
    const d = new Date();
    for (let i = 0; i < 14; i++) {
      const k = fmt(d); rows.push(hrow(k)); d.setDate(d.getDate() - 1);
    }
    html += rows.join("") || `<div class="empty">No history yet.</div>`;
    return html;
  }
  function hrow(date) {
    const st = dayStatus(date);
    const dt = parseKey(date);
    const l = state.logs[date];
    const badge = { done: ["b-done", "Done"], part: ["b-part", "Partial"], rest: ["b-rest", "Rest"], miss: ["b-miss", "Missed"], none: ["b-rest", "—"] }[st.status];
    const pct = Math.round(st.ratio * 100);
    const isToday = date === todayKey();
    const kcal = l && l.nutrition && l.nutrition.calories ? `${l.nutrition.calories} kcal · ` : "";
    return `<div class="hrow" onclick="GD.edit('${date}')">
      <div class="hdate"><div class="d">${dt.getDate()}</div><div class="m">${DOW[dt.getDay()]}</div></div>
      <div class="hmid">
        <div class="t">${st.day.label} · ${shortFocus(st.day.focus)}${isToday ? " · Today" : ""}</div>
        <div class="s">${kcal}${st.day.rest ? "Recovery" : st.done + "/" + st.total + " exercises"}</div>
        ${st.day.rest ? "" : `<div class="minibar"><i style="width:${pct}%"></i></div>`}
      </div>
      <div class="hbadge ${badge[0]}">${badge[1]}</div>
      <span class="hedit">${svg(ICONS.chevR)}</span>
    </div>`;
  }

  /* ---------- PLAN ---------- */
  function viewPlan() {
    const P = PLAN;
    let html = `<div class="hero" style="background:linear-gradient(135deg,#1c2a1f,#172033)"><div class="ring"></div>
      <h1>${P.meta.plan_type}</h1>
      <div class="focus">${P.meta.goal}</div>
      <div class="sub">${P.meta.commitment}</div></div>`;

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

    // data
    html += `<div class="section-h"><h2>Your data</h2></div>
      <p class="muted small" style="margin:0 6px 10px;line-height:1.5">Everything is saved on this device. Export a JSON backup to keep it safe or commit it to your GitHub repo.</p>
      <div class="btnrow">
        <button class="btn" onclick="GD.exportData()">${svg(ICONS.download)} Export backup</button>
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
    go(t) { tab = t; if (t === "today") selectedDate = todayKey(); render(); toTop(); },
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
    setTap(id, s, total) {
      const p = prog(selectedDate);
      const cur = p.sets[id] || 0;
      p.sets[id] = (cur === s) ? s - 1 : s; // tap same to toggle off
      if (p.sets[id] >= total) toast("Exercise complete ✓");
      save(); render(); // scroll preserved
    },
    toggleDone(id) {
      const p = prog(selectedDate);
      p.done[id] = !p.done[id];
      save(); render(); // scroll preserved
    },
    macro(k, dir) {
      const n = getLog(todayKey()).nutrition;
      n[k] = round(Math.max(0, (+n[k] || 0) + dir * STEPS[k]));
      save(); render();
    },
    macroSet(k, val) {
      const n = getLog(todayKey()).nutrition;
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
      let m = $("#modal");
      if (!m) { m = document.createElement("div"); m.id = "modal"; m.className = "modal"; m.addEventListener("click", e => { if (e.target === m) GD.closeModal(); }); document.body.appendChild(m); }
      m.innerHTML = `<div class="sheet">${body}</div>`;
      requestAnimationFrame(() => m.classList.add("show"));
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

  render();
})();
