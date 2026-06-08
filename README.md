# 🏋️ Gym Diary

A personal, mobile-first gym + nutrition diary. No accounts, no backend, no build step —
just static HTML/CSS/JS. Open it, train, log, track your streak.

## What it does
- **Today** — a date navigator (‹ ›) + a workout-split dropdown, so you can do *Monday's Push on Friday* and log it under any date. Missed a day? Jump back with the arrows / date picker, or tap that day in **History**, and log it retroactively. Each exercise shows sets × reps, a live "sets left" counter, the coaching note, an animated GIF, and a **How to** guide with step-by-step instructions. Logging a set no longer jumps you to the top of the page.
- **Macros** — log calories / protein / carbs / fats / water and instantly see if you hit the targets (green = on target, amber = under, red = over).
- **History** — streak 🔥, this-week count, total sessions, and a 14-day log of what you did (Done / Partial / Rest / Missed).
- **Plan** — daily posture & neck protocol, nutrition targets + sample Indian day, supplements, milestones, warnings, and **data export/import**.

## Install on your iPhone (PWA)
It's a full Progressive Web App. On the deployed (https) URL:
1. Open it in **Safari**.
2. Tap **Share → Add to Home Screen**.
3. Launch it from the icon — it opens full-screen, no browser bar, with the dumbbell app icon.

It also works **offline** after the first load (service worker caches the app shell).

## Data & storage — does it persist after "Add to Home Screen"?
**Yes.** Your data lives in the browser's `localStorage` for that site's origin. The home-screen app uses the same origin, so:
- Data you log **stays** across launches, reboots and app closes.
- Adding to the home screen does **not** wipe it; deleting the home-screen icon does **not** wipe it either.

Two honest caveats on iOS:
- iOS may evict storage for web apps you **haven't opened in ~7+ days**. Since you'll use this daily, that won't bite — but it's why the backup below exists.
- The home-screen app and Safari can keep **separate** storage. Pick one (the home-screen app) and log there consistently.

**Backup = your safety net (and the "GitHub single JSON" you asked for):**
- **Plan → Export backup** downloads one JSON file. Commit it to a GitHub repo (or drop it in Drive).
- **Plan → Import** restores it on a new phone.
- Want true live cross-device sync instead of manual export? This can be extended to read/write a **GitHub Gist** with a personal token — ask and I'll wire it.

## Exercise GIFs
GIFs + instructions come from the public-domain [ExerciseGymGifsDB](https://github.com/JahelCuadrado/ExerciseGymGifsDB) via the free jsDelivr CDN. 38 of the plan's exercises are matched automatically.

A few movements aren't in that dataset and show a **"➕ GIF — tap to add link"** placeholder:
- Face pull (cable) / Face pull + band pull-apart
- Cable woodchops
- Hollow body hold
- Wall angels
- Cat-cow
- plus warm-ups, neck isometrics & cardio (no GIF needed)

Tap the placeholder, paste any GIF/image URL (right-click an exercise GIF online → *Copy image address*), and it's saved on your device. Send me links and I can bake them in permanently.

## Run locally
```bash
cd gym
python3 -m http.server 4178
# open http://localhost:4178
```

## Deploy free

### GitHub Pages
1. Push the `gym/` folder contents to a repo (e.g. files at the repo root).
2. Repo → **Settings → Pages → Source: Deploy from branch** → `main` / root.
3. Visit `https://<username>.github.io/<repo>/`. Add to home screen on your phone.

### Vercel
1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other**. Root directory: `gym` (or repo root if files are there). No build command, output dir = the folder with `index.html`.
3. Deploy. Done.

> Tip: on iPhone/Android, open the deployed URL and **Add to Home Screen** for a full-screen app feel (the meta tags are already set).

## Files
- `index.html` — app shell + bottom tab bar
- `styles.css` — mobile-first dark theme
- `data.js` — the full PPL plan, nutrition targets, posture/supplements/milestones
- `exercise-meta.js` — auto-generated GIF + instruction map
- `app.js` — all logic (state, streak, rendering, macros)
