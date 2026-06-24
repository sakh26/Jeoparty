# Jeoparty!

A fully-featured, host-ready Jeopardy game built for live parties. Originally created for a birthday celebration, refactored into a reusable platform that works for any topic — trivia, music, movies, company knowledge, anything.

**Tech stack:** React 19 · TypeScript (strict) · Vite 7 · Vitest · CSS custom properties

---

## Features

| Feature | Notes |
|---|---|
| 5×N board with card-flip animation | Smooth CSS 3D flip on tile reveal |
| 2–4 teams | Add/remove teams in settings; scorer advances round-robin |
| Double Jeopardy tiles | Two randomly-assigned tiles per game, 2× points |
| Steal mechanic | Inline steal modal — no `window.prompt()` |
| Question timer | Configurable 15/30/45/60 s SVG ring; auto-triggers "no one" at zero |
| Score animation | Flash animation on each score update, `aria-live` for screen readers |
| Confetti on correct answer | `canvas-confetti` (3 KB), fires from team card position |
| Game resume | State persisted in `localStorage`; resume prompt on next load |
| Game log | Chronological outcome log, color-coded by result, lives in settings drawer |
| 5 color themes | soft-pink · lavender · rose-gold · midnight · barbie, live preview |
| Spotify integration | OAuth 2.0 PKCE; auto-plays song when a tile is opened (music packs only) |
| Pack Builder (admin) | Create/edit question packs in-browser, import/export JSON |
| Topic plugin system | New topic = JSON file + optional plugin; Spotify only shown for music packs |

---

## Getting started

```bash
cd web-react
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

### Available scripts

```bash
npm run dev          # development server
npm run build        # production build
npm run typecheck    # TypeScript check (no emit)
npm test             # unit tests (Vitest)
npm run test:watch   # watch mode
npm run lint         # ESLint
```

---

## Adding a question pack

Drop a JSON file in `src/data/packs/`. It is auto-discovered at build time via `import.meta.glob` — no code changes required.

Minimum schema:

```json
{
  "id": "my-pack-2025",
  "name": "Office Trivia",
  "topic": "default",
  "version": "1.0",
  "categories": [
    {
      "name": "Geography",
      "questions": [
        { "id": "geo-1", "level": 1, "targetWord": "Oslo", "hint": "Capital of Norway" },
        { "id": "geo-2", "level": 2, "targetWord": "Bergen", "hint": "City of 7 mountains" }
      ]
    }
  ]
}
```

`level` maps to `pointsByLevel` (default 100 / 200 / 300 / 400 / 500). For a music pack set `"topic": "music"` and add `"songTitle"` and `"artist"` fields — the Spotify button will appear automatically.

You can also use the in-browser **Pack Builder** (✏️ button, bottom-right) to create and export packs without editing JSON directly.

---

## Spotify setup

Only needed for music-topic packs.

1. Create an app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Add redirect URI: `http://127.0.0.1:5173`
3. Create `web-react/.env`:

```
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173
```

4. Click **Koble Spotify** in the app and approve. Requires a Spotify Premium account with an active device.

The app uses OAuth 2.0 PKCE — no client secret is ever stored.

---

## Architecture

```
src/
  components/
    admin/        PackBuilder, CategoryEditor, QuestionEditor
    board/        Board, TileButton (double-jeopardy badge)
    layout/       TopBar (inline reset confirmation)
    modal/        QuestionModal, StealModal, QuestionTimer (SVG ring), CardFlipTransition
    scoreboard/   Scoreboard, TeamCard (score flash), PickerControl
    screens/      PackSelectorScreen, ResumePrompt
    settings/     SettingsDrawer, SettingsForm, ContentLibrary, ThemeSelector
    shared/       Toast, ConfettiOverlay, GameLog
  hooks/
    useGameState      — all game logic, localStorage persistence
    useSpotify        — OAuth PKCE, token refresh, playback
    useSettings       — draft pattern for settings with live theme preview
    useToast          — auto-dismiss toast queue
    useLocalStorage   — generic typed localStorage with optional validator
    useCardFlipTransition — card fly-out animation timing
    useKeyboardShortcuts  — declarative keyboard bindings
  plugins/
    default.tsx   — text-clue topics
    music.tsx     — Spotify-enabled, validates songTitle + artist
    index.ts      — registry + getPlugin(topicId)
  data/
    packs/        *.json auto-loaded by Vite glob
    packLoader.ts
  utils/
    gameLogic.ts  — mapPoints, computeProgress, isPackFinished
    sanitize.ts   — sanitizeName, validatePackSchema, exportPackAsJson
    spotify.ts    — PKCE helpers
  types/index.ts  — all shared interfaces
```

`App.tsx` is ~165 lines of hook composition and conditional rendering — no logic lives there.

---

## Tests

```bash
npm test
```

51 unit tests across hooks and utilities:

| File | Tests |
|---|---|
| `useGameState` | 18 — scoring, steals, resets, game log, finish detection |
| `useLocalStorage` | 6 — corruption handling, functional updater, validator rejection |
| `useToast` | 5 — auto-dismiss, fake timers |
| `gameLogic` | 13 — mapPoints, computeProgress, isPackFinished |
| `sanitize` | 10 — sanitizeName, validatePackSchema edge cases |
