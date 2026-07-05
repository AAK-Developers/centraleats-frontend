# CentralEats Desktop

Electron wrapper for the CentralEats Vendor Metrics Dashboard.

## Architecture

The desktop app loads the **remote** CentralEats frontend (QA or production URL).
It does NOT bundle the frontend — this keeps the .exe lightweight and ensures
vendors always see the latest version without updating the desktop app.

```
┌─────────────────────────────────────┐
│         Electron Shell              │
│  ┌───────────────────────────────┐  │
│  │   BrowserWindow               │  │
│  │   loads: centraleatsqa...     │  │
│  │   ┌───────────────────────┐   │  │
│  │   │  React Frontend       │   │  │
│  │   │  /vendor-dashboard/   │   │  │
│  │   │  metrics              │   │  │
│  │   └───────────────────────┘   │  │
│  └───────────────────────────────┘  │
│                                     │
│  + Offline cache (file system)      │
│  + Device token (secure storage)    │
│  + Network monitoring               │
│  + Single instance lock             │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Backend (QA/Production)            │
│  centraleatsqa.programacionwebuce.net│
└─────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+
- npm 9+

## Development

```bash
# Run Electron in dev mode (loads localhost:5173)
npm run electron:dev
```

This starts Vite dev server AND Electron simultaneously.
Electron waits for Vite to be ready before opening.

## Build

```bash
# Build for Windows (.exe installer)
npm run electron:build:win

# Build for macOS (.dmg)
npm run electron:build:mac

# Build for Linux (.AppImage + .deb)
npm run electron:build:linux

# Build for current platform
npm run electron:build
```

Output goes to `release/` directory.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `CENTRALEATS_URL` | `https://centraleatsqa.programacionwebuce.net` | Remote URL to load |
| `NODE_ENV` | `production` | Set to `development` for dev mode |

## File Locations (Windows)

| Data | Path |
|------|------|
| Metrics cache | `%APPDATA%/centraleats-desktop/metrics-cache/` |
| Device token | `%APPDATA%/centraleats-desktop/.device-token` |
| Logs | `%APPDATA%/centraleats-desktop/logs/` |

## Multi-platform Notes

- **Windows**: Tested. NSIS installer generates `.exe`
- **Linux**: Config ready. Generates `.AppImage` (portable) and `.deb` (Debian/Ubuntu).
- **macOS**: Config ready. Requires macOS to sign for distribution. Unsigned `.dmg` works for testing.

## Security

- `nodeIntegration: false` — no Node.js in renderer
- `contextIsolation: true` — preload bridge only
- `sandbox: true` — renderer is sandboxed
- External links open in default browser
- Single instance lock prevents multiple copies

## Icons

> ⚠️ **TODO**: Replace placeholder icons in `resources/` with official CentralEats branding.
> Required files:
> - `resources/icon.png` (1024×1024 — source)
> - `resources/icon.ico` (Windows multi-size)
> - `resources/icon.icns` (macOS)
> - `resources/icons/*.png` (Linux: 16, 32, 48, 64, 128, 256, 512px)
