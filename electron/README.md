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
│  │   loads: centraleats.prog...      │  │
│  │   ┌───────────────────────────┐   │  │
│  │   │  React Frontend (remote)  │   │  │
│  │   │  Same as web version      │   │  │
│  │   └───────────────────────────┘   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Features:                              │
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

# Build for Production (.exe points to centraleats.programacionwebuce.net)
npm run electron:build:win:prod

# Build for current platform (uses default URL)
npm run electron:build
```
Output: `release/CentralEats-Setup-{version}.exe`

## Environment Configuration

| Variable | Used By | Description |
|---|---|---|
| `CENTRALEATS_URL` | Electron main process | URL loaded in the window (production builds) |
| `VITE_API_BASE_URL` | Frontend (axios) | API base URL (only relevant in dev mode) |
| `NODE_ENV` | Electron | `development` enables DevTools + CORS bypass |

**How URLs work in each mode:**

| Mode | Frontend loads from | API calls go to |
|---|---|---|
| `electron:dev` | `localhost:5173` | QA server (CORS bypassed) |
| `.exe` (QA) | `centraleatsqa...` | Same origin (no CORS) |
| `.exe` (Prod) | `centraleats...` | Same origin (no CORS) |

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
- Auto-update not yet implemented (planned for Phase 3)

## Troubleshooting

| Issue | Solution |
|---|---|
| Black/white screen on launch | Check `CENTRALEATS_URL` is correct and server is reachable |
| Login loop | Ensure third-party cookies are not blocked; check Clerk allowed origins |
| Metrics not loading | In dev: expected (CORS). In .exe: check backend is running |
| "exports is not defined" | Preload must compile to `.cjs` — run `npm run electron:compile` |
