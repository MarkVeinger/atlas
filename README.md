# Atlas

A personal training platform built as an installable Progressive Web App (PWA). Atlas combines a
workout database, multi-week programming, and client management in a single offline-capable web app.

## Features

- **Workout library** — 127 workouts across Hyrox, Mobility, Metcon, Strength, Weightlifting, and Endurance.
- **Exercise database** — 497 exercises organized by muscle group, equipment, and movement pattern.
- **Programming** — build multi-week training plans with AM/PM session slots and assign them to clients.
- **AI workout generator** — generate new workouts on demand.
- **Offline support** — a service worker (`sw.js`) caches the app so it works without a connection.

## Pages

| File | Purpose |
|---|---|
| `platform.html` | Main app entry point (workout database, programming, client management). |
| `index.html` | AI workout generator. |
| `workout-bank.html` | Browse the full workout library. |
| `manifest.json` | PWA manifest (icons, theme, install metadata). |
| `sw.js` | Service worker for offline caching. |

## Knowledge base

The `atlas-knowledge/` folder holds the underlying data and reference docs:

| File | Contents |
|---|---|
| `workouts.json` / `workouts.md` | All 127 workouts (JSON and human-readable). |
| `exercises.json` / `exercises.md` | All 497 exercises (JSON and human-readable). |
| `programming.md` | How the programming system works. |
| `summary.md` | Quick stats and a file index. |

## Running locally

Atlas is a static PWA — no build step required. Serve the folder over HTTP, for example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/platform.html> in your browser. Serving over HTTP (rather than
opening the file directly) is required for the service worker and offline caching to work.
