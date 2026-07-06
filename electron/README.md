# CentralEats Desktop
Electron wrapper for the CentralEats vendor platform. Provides a native desktop experience for restaurant owners to manage orders, view metrics, and operate their business.

## Architecture
The desktop app loads the **remote** CentralEats frontend (QA or production URL).
It does NOT bundle the frontend — this keeps the .exe lightweight (~80MB) and ensures
vendors always see the latest version without updating the desktop app.

┌─────────────────────────────────────────┐
│           CentralEats Desktop           │
│  ┌───────────────────────────────────┐  │
│  │   Electron BrowserWindow          │  │
│  │   loads: from app-config.json     │  │
│  │   ┌───────────────────────────┐   │  │
│  │   │  React Frontend (remote)  │   │  │
│  │   │  Same as web version      │   │  │
│  │   └───────────────────────────┘   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Features:                              │
│  + Build-time URL config (app-config)   │
│  + Window state persistence             │
│  + Offline metrics cache (file system)  │
│  + Device token (secure storage)        │
│  + Network monitoring                   │
│  + Single instance lock                 │
│  + Third-party cookie bypass (Clerk)    │
└─────────────────────────────────────────┘
│ same origin
▼
┌─────────────────────────────────────────┐
│  Backend API                            │
│  (same domain as frontend)              │
└─────────────────────────────────────────┘

## Prerequisites
- Node.js 18+
- npm 9+

## Development
```bash
# Option A: Run against QA (no local backend needed)
npm run electron:dev

# Option B: Run with local backend
# Terminal 1:
cd ../centraleats-backend && npm run dev
# Terminal 2:
npm run electron:dev
```

In dev mode, Electron loads `http://localhost:5173` (Vite dev server).
CORS is bypassed automatically in dev mode via Electron's session API.

## Build

```bash
# Build for QA (.exe points to centraleatsqa.programacionwebuce.net)
npm run electron:build:win:qa

# Build for Production (.exe points to centraleatsprod.programacionwebuce.net)
npm run electron:build:win:prod

# Build for current platform (uses default QA URL from app-config.json)
npm run electron:build
```
Output: `release/CentralEats-Setup-{version}.exe`

## How the Remote URL is Resolved

The `.exe` does **not** read `.env` files at runtime. The URL is resolved in this order:

1. `CENTRALEATS_URL` environment variable (useful in CI/CD pipelines)
2. `resources/app-config.json` — **written by the build script before packaging**, bundled inside the `.exe`
3. Fallback: `https://centraleatsqa.programacionwebuce.net` (safe default = QA)

The build scripts (`electron:build:win:qa` / `electron:build:win:prod`) automatically
overwrite `resources/app-config.json` with the correct URL before calling `electron-builder`.
The committed version of this file always points to QA as the safe default.

## Environment Configuration

| Variable | Used By | Description |
|---|---|---|
| `CENTRALEATS_URL` | Electron main process | URL override (useful in CI, overrides app-config.json) |
| `VITE_API_BASE_URL` | Frontend (axios) | API base URL — used only in `electron:dev` mode |
| `NODE_ENV` | Electron | `development` enables DevTools + CORS bypass |

**How URLs work in each mode:**

| Mode | Frontend loads from | API calls go to |
|---|---|---|
| `electron:dev` | `localhost:5173` | QA server (CORS bypassed) |
| `.exe` (QA) | `centraleatsqa.programacionwebuce.net` | Same origin (no CORS) |
| `.exe` (Prod) | `centraleatsprod.programacionwebuce.net` | Same origin (no CORS) |

## Key Files

| File | Purpose |
|---|---|
| `electron/main.ts` | Electron main process — window, IPC, URL resolution |
| `electron/preload.ts` | Context bridge — exposes `electronAPI` to the React frontend |
| `electron/tsconfig.json` | TypeScript config for `main.ts` (ESM output) |
| `electron/tsconfig.preload.json` | TypeScript config for `preload.ts` (CommonJS → `.cjs`) |
| `resources/app-config.json` | Build-time URL config, bundled inside the `.exe` |
| `.env.electron` | Vite env for `electron:dev` (QA API base URL) |
| `.env.electron.production` | Vite env for production Vite builds |

## File Locations (Windows)

| Data | Path |
|---|---| 
| Window state | `%APPDATA%/centraleats-desktop/window-state.json` |
| Metrics cache | `%APPDATA%/centraleats-desktop/metrics-cache/` |
| Device token | `%APPDATA%/centraleats-desktop/.device-token` |

## Security
- `nodeIntegration: false` — no Node.js in renderer
- `contextIsolation: true` — preload bridge only
- External links open in default browser
- Single instance lock prevents multiple copies
- Third-party cookies enabled only for Clerk auth domains
- CORS bypass only active in development mode

## Known Limitations
- WebSocket (Socket.IO) requires server-side proxy configuration for real-time updates
- macOS builds require code signing for distribution (unsigned .dmg works for testing)
- Auto-update not yet implemented (planned for a future phase)

## Troubleshooting

| Issue | Solution |
|---|---|
| White/blank screen on launch | Verify `resources/app-config.json` has correct `remoteUrl` and server is reachable |
| Black/white screen on launch | Check `CENTRALEATS_URL` is correct and server is reachable |
| Login loop | Ensure third-party cookies are not blocked; check Clerk allowed origins |
| Metrics not loading | In dev: expected (CORS). In `.exe`: check backend is running |
| "exports is not defined" | Preload must compile to `.cjs` — run `npm run electron:compile` |
| Wrong URL in `.exe` | Use `electron:build:win:qa` or `electron:build:win:prod` — not `electron:build` |
