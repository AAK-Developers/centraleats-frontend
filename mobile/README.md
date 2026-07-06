# CentralEats Mobile (Android)

Native Android wrapper using Capacitor. Provides a native mobile experience for students and vendors.

## Prerequisites
- Node.js 18+
- Android Studio (Koala 2024.1+ recommended)
- JDK 17
- Android SDK 34

## Quick Start

```bash
# Install dependencies
npm install

# Build for QA and sync to Android
npm run build:mobile:qa:win    # Windows
npm run build:mobile:qa        # macOS/Linux

# Open in Android Studio
npm run cap:open:android
```

## Architecture

The mobile app uses Capacitor to wrap the same React frontend in a native Android WebView.
Authentication uses a native OAuth flow (system browser → deep link callback).

```
┌─────────────────────────────────┐
│     CentralEats Mobile (APK)    │
│  ┌───────────────────────────┐  │
│  │  Capacitor WebView        │  │
│  │  loads: dist/ (bundled)   │  │
│  │  hostname: centraleatsqa  │  │
│  └───────────────────────────┘  │
│  + Deep Links (OAuth)           │
│  + System Browser (Google SSO)  │
│  + Native status bar            │
└─────────────────────────────────┘
```

## OAuth Flow (Mobile)
1. User taps "Continuar con Google"
2. App calls Clerk API → gets Google OAuth URL
3. System browser opens → user authenticates
4. Google redirects to Clerk → Clerk redirects to `https://centraleatsqa.../oauth-callback`
5. Android captures deep link → app receives callback
6. App activates Clerk session → navigates to dashboard

## Build Commands

| Command | Description |
|---|---|
| `npm run build:mobile:qa:win` | Build for QA (Windows) |
| `npm run build:mobile:prod:win` | Build for Production (Windows) |
| `npm run cap:sync` | Sync web assets to Android |
| `npm run cap:open:android` | Open in Android Studio |

## Clerk Configuration Required
In Clerk Dashboard → Native API → Android:
- **Package name**: `ec.net.programacionwebuce.centraleats`
- **SHA-256**: (from your keystore)
- **Redirect URLs**:
  - `centraleats://oauth-callback`
