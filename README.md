# 🛒 CentralEats - Frontend 🚀

CentralEats is a high-performance "Click & Collect" food management platform specifically designed for the community at the Universidad Central del Ecuador (UCE). Its decoupled and optimized architecture ensures ultra-fast loading times and a seamless user experience across mobile (Android/iOS) and computer (Web/Desktop) clients.

---

## 👨‍💻 Project Direction
*   **Lead Developer & UI/UX Architect:** Kevin Moyon

---

## 🛠️ Technology Stack
The project utilizes a modern, strongly-typed, and reactive ecosystem:

*   **Runtime & Framework:** React 19, TypeScript, Vite.
*   **Design System:** Chakra UI v3.
*   **State Management & Caching:** React Query (TanStack Query v5) & Zustand.
*   **Authentication & Security:** Clerk (Institutional and social authentication).
*   **HTTP Client:** Axios (configured with interceptors to propagate tokens and manage timeouts).
*   **Native / Hybrid Environments:**
    *   **Desktop:** Electron.
    *   **Mobile:** Capacitor.

---

## 📐 Project Architecture (Isolated Multi-Entrypoint)
To prevent cross-platform code pollution and dependency conflicts, the frontend implements a **Multi-page Vite** architecture with separate entry points at compile time:

```text
├── index.html                  # HTML entry point for Web and Desktop
├── index.mobile.html           # Exclusive HTML entry point for Mobile
├── vite.config.ts              # Vite configuration for Web/Desktop (Compiles to /dist)
├── vite.mobile.config.ts       # Vite configuration for Mobile (Compiles to /dist-mobile)
├── capacitor.config.json       # Configures Capacitor to point to /dist-mobile
├── electron-builder.yml        # Configures Desktop executable builder (.exe)
└── src/
    ├── main.tsx                # Bootstrapping script for Web/Desktop (loads Clerk, Routers, etc.)
    ├── mobile-main.tsx         # Lightweight bootstrapping script for Mobile (Clerk-free)
    ├── api/                    # Axios instance and request configuration
    ├── components/             # Atoms, Molecules, Organisms, and Layouts (Atomic Design)
    ├── features/               # Specific features (deliveryStats, vendorMetrics)
    ├── hooks/                  # Business logic and queries (React Query)
    ├── utils/                  # Global utilities (file sanitization, Electron detection)
    └── App.tsx                 # Route definitions and Web/Desktop route protection
```

---

## 🚀 Installation & Local Development Guide

### 1. Prerequisites
*   **Node.js:** Version 22 or higher.
*   **NPM:** Packaged with Node.js.

### 2. Environment Variables (`.env`)
Create a `.env` file in the project root based on `.env.example`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... # Public Clerk key
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Installation
Install the project dependencies (using legacy-peer-deps fallback if necessary):
```bash
npm install
```

### 4. Running in Development Mode
Choose the environment you want to run locally:

*   **Run Web:**
    ```bash
    npm run dev
    ```
    *Local server defaults to: http://localhost:5173*

*   **Run Mobile (Web Simulator):**
    ```bash
    npm run dev:mobile
    ```
    *Local server exclusive to mobile: http://localhost:5174*

*   **Run Desktop (Hot-Reload Electron):**
    ```bash
    npm run electron:dev
    ```

---

## 📦 Building and Packaging Executables (.exe / .apk)

### 🖥️ Desktop (Windows `.exe`)
The desktop application is packaged using **Electron Builder**. Note that the desktop executable serves as an optimized, secure web view wrapper connected directly to the official QA or Production instances to preserve data integrity:

1.  **Build and Package for QA:**
    ```bash
    npm run electron:build:win:qa
    ```
2.  **Build and Package for Production:**
    ```bash
    npm run electron:build:win:prod
    ```
*The generated installer is saved in the `/release` directory with the format: `CentralEats-Setup-X.X.X.exe`.*

### 📱 Mobile (Android `.apk` / iOS)
The mobile app (Delivery Dashboard for riders) is decoupled and compiles to its own `/dist-mobile` folder, omitting Clerk and heavy web-only dependencies:

1.  **Build the Mobile Frontend:**
    ```bash
    npm run build:mobile:dev    # For development environment
    npm run build:mobile:qa     # For QA testing environment
    npm run build:mobile:prod   # For production environment
    ```
    *(This command compiles the project and automatically runs `npx cap sync` to synchronize static assets into the native folders).*

2.  **Generate Native Executables (Android / iOS):**
    *   **Open in Android Studio (to build APK/AAB):**
        ```bash
        npx cap open android
        ```
        *Inside Android Studio, select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.*
    *   **Open in Xcode (for iOS):**
        ```bash
        npx cap open ios
        ```

---

## ⚙️ Image & Filename Sanitization (Handling Special Characters)
To prevent **CORS** issues, **Mojibake** (e.g. broken images with names like `Sopa_wantÃ¡n.jpg`), and **404 (Not Found)** errors on Linux/Nginx servers:

1.  **During Uploads**: The frontend sanitizes image filenames before dispatching them to the API via the `prepareFileForUpload` utility in `src/utils/imageUtils.ts`. Accents, special characters, and spaces are removed or replaced with safe ASCII equivalents (e.g., `á` -> `a`, spaces -> `_`).
2.  **During Rendering**: For older database entries featuring corrupted filenames, the application runs the `fixImageUrl` helper on the returned URLs, automatically resolving UTF-8 decoding anomalies to ensure the browser requests the actual file from Nginx.

---

## 🌐 Continuous Integration & Continuous Deployment (CI/CD)

The project leverages **GitHub Actions** to automate builds and deploy directly to AWS EC2 containerized environments.

### 🧪 QA Testing Environment
*   **Trigger:** Push to the `QA` branch (or dispatch event triggered by a successful backend deploy).
*   **Workflow:**
    1.  Downloads the code and builds the frontend Docker image.
    2.  Pushes the image to Docker Hub (`centraleats-frontend:qa`).
    3.  Establishes an SSH connection to the QA EC2 server.
    4.  Pulls the new image and performs a safe "Hot Swap" deployment, with automatic rollback if the HTTP smoke test fails.
    5.  Dispatches status notifications to Discord.

### 🚀 Production Environment
*   **Trigger:** Push to the `main` branch (or manual workflow dispatch).
*   **Workflow:**
    1.  Calculates and creates a new semantic version tag (e.g., `v1.0.2`).
    2.  Promotes the Docker image from QA to Production in Docker Hub.
    3.  Downloads and launches the production container on the EC2 server (port `8080`).
    4.  Autogenerates a GitHub Release with the changelog.
    5.  Dispatches success/failure notifications to Discord.
