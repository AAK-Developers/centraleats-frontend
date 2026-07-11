# CentralEats 🛒🚀

CentralEats is a high-performance, digital "Click & Collect" food management platform specifically tailored for the community at the Universidad Central del Ecuador (UCE). By bridging local vendors and university members, the platform streamlines food ordering, minimizes wait times, and provides a modern, centralized ecosystem for campus dining.

---

## Table of Contents
1. [Project Description](#project-description)
2. [The Problem It Solves](#the-problem-it-solves)
3. [General Objective](#general-objective)
4. [Value Proposition](#value-proposition)
5. [Expected Impact](#expected-impact)
6. [Benefits](#benefits)
7. [Project Vision](#project-vision)
8. [Main Features](#main-features)
9. [Project Architecture (Isolated Multi-Entrypoint)](#project-architecture-isolated-multi-entrypoint)
10. [Technology Stack](#technology-stack)
11. [Installation & Local Development Guide](#installation--local-development-guide)
12. [Building and Packaging (.exe / .apk)](#building-and-packaging-exe--apk)
13. [Image & Filename Sanitization](#image--filename-sanitization)
14. [Continuous Integration & Continuous Deployment (CI/CD)](#continuous-integration--continuous-deployment-cicd)
15. [Authors](#authors)

---

## Project Description

CentralEats optimizes the food ordering and pickup experience around the Universidad Central del Ecuador campus through a specialized **Click & Collect** model. The solution allows students, faculty, and administrative staff to pre-order meals from any device, reducing queue times and maximizing academic schedule efficiency.

The platform links the university community with nearby food establishments in a single, centralized digital ecosystem, making it simple to browse menus, place orders, process payments, and track order status in real time.

---

## The Problem It Solves

During peak campus hours, food establishments surrounding the Universidad Central del Ecuador experience severe congestion, causing long lines and prolonged wait times. This bottleneck leaves students with insufficient time to eat properly or forces them to sacrifice academic activities to secure meals.

Additionally, the lack of a centralized directory makes it difficult for users to compare options, plan their spending, and for businesses to manage their orders systematically.

CentralEats resolves these friction points by digitizing and automating the entire order-to-pickup pipeline, enabling proactive planning and a smoother dining experience in the university environment.

---

## General Objective

To design and implement a digital platform that manages pre-ordered meals using a Click & Collect model, optimizing user time, improving the purchasing experience, and enhancing the operational efficiency of local partner food businesses.

---

## Value Proposition

CentralEats transforms the traditional food purchasing process into a fast, organized, and predictable digital experience. Users can order and pay ahead of time, while vendors receive structured, real-time orders that facilitate efficient meal preparation and handoff. 

By combining convenience, time-saving features, and real-time order tracking, the platform delivers a customized solution for the specific daily needs of the university community.

---

## Expected Impact

*   **Queue Elimination**: Substantial reduction in wait times and crowds at partner outlets during peak campus hours.
*   **Time Optimization**: Maximum utilization of short lunch and class breaks for students and staff.
*   **Structured Prep**: Improved order planning and stock management for local establishments.
*   **Operational Efficiency**: Digital transformation of commercial processes for local family-owned and campus businesses.
*   **Centralized Information**: Transparent access to menu pricing, item availability, and vendor locations.
*   **Stress Reduction**: Decrease in anxiety associated with obtaining food during short academic intervals.
*   **Economic Support**: Digital empowerment of the local commercial ecosystem.

---

## Benefits

### For Students & Staff
*   Drastically reduced wait times.
*   Better utilization of free slots between classes.
*   Centralized menu options and transparent comparisons.
*   Real-time notifications and progress tracking.

### For Local Businesses
*   Streamlined, organized, and digital order queues.
*   Reduced physical congestion at checkout points.
*   Increased serving capacity during high-demand peak hours.
*   Modernized commercial and order tracking processes.

### For the University Community
*   An organized, modern, and efficient campus dining environment.
*   Improved dining experience within the university ecosystem.
*   Active contribution to the digital transformation of nearby local commerce.

---

## Project Vision

To become the leading platform for smart food ordering systems in university settings, fostering the digital transformation of local businesses and enhancing the daily quality of life for academic communities.

---

## Main Features

*   **Role-Based Access**: Dedicated workflows for Students/Staff (ordering, cart, tracking) and Vendors (menu creation, order processing, performance metrics).
*   **Real-time Order Updates**: Bidirectional websocket communication for instant order status tracking (Received ➔ Preparing ➔ Ready for Pickup).
*   **Client-Side Image Processing**: Automatic sanitization of filenames to guarantee successful image loading on all operating systems and servers.
*   **Multi-Platform Distribution**: Fully responsive Web interface, standalone Desktop app (Windows/macOS), and light Mobile Rider app.

---

## Project Architecture (Isolated Multi-Entrypoint)

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

## Technology Stack

*   **Runtime & Framework**: React 19, TypeScript, Vite.
*   **Design System**: Chakra UI v3.
*   **State Management & Caching**: React Query (TanStack Query v5) & Zustand.
*   **Authentication & Security**: Clerk (Institutional and social login integration).
*   **HTTP Client**: Axios (configured with interceptors to propagate tokens and manage timeouts).
*   **Native / Hybrid Environments**:
    *   **Desktop**: Electron.
    *   **Mobile**: Capacitor.

---

## Installation & Local Development Guide

### 1. Prerequisites
*   **Node.js**: Version 22 or higher.
*   **NPM**: Packaged with Node.js.

### 2. Environment Variables (`.env`)
Create a `.env` file in the project root based on `.env.example`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... # Public Clerk key
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Installation
Install the project dependencies:
```bash
npm install
```

### 4. Running in Development Mode
Choose the client environment you want to run locally:

*   **Run Web Client**:
    ```bash
    npm run dev
    ```
    *Local server defaults to: http://localhost:5173*

*   **Run Mobile Client (Web Simulator)**:
    ```bash
    npm run dev:mobile
    ```
    *Local server exclusive to mobile: http://localhost:5174*

*   **Run Desktop Client (Hot-Reload Electron)**:
    ```bash
    npm run electron:dev
    ```

---

## Building and Packaging (.exe / .apk)

### 🖥️ Desktop (Windows `.exe`)
The desktop application is packaged using **Electron Builder**. The desktop executable serves as an optimized, secure web view wrapper connected directly to the official QA or Production instances to preserve data integrity:

1.  **Build and Package for QA**:
    ```bash
    npm run electron:build:win:qa
    ```
2.  **Build and Package for Production**:
    ```bash
    npm run electron:build:win:prod
    ```
*The generated installer is saved in the `/release` directory with the format: `CentralEats-Setup-X.X.X.exe`.*

### 📱 Mobile (Android `.apk` / iOS)
The mobile app (Delivery Dashboard for riders) is decoupled and compiles to its own `/dist-mobile` folder, omitting Clerk and heavy web-only dependencies:

1.  **Build the Mobile Frontend**:
    ```bash
    npm run build:mobile:dev    # For development environment
    npm run build:mobile:qa     # For QA testing environment
    npm run build:mobile:prod   # For production environment
    ```
    *(This command compiles the project and automatically runs `npx cap sync` to synchronize static assets into the native folders).*

2.  **Generate Native Executables (Android / iOS)**:
    *   **Open in Android Studio (to build APK/AAB)**:
        ```bash
        npx cap open android
        ```
        *Inside Android Studio, select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.*
    *   **Open in Xcode (for iOS)**:
        ```bash
        npx cap open ios
        ```

---

## Image & Filename Sanitization

To prevent **CORS** issues, **Mojibake** (e.g., broken images with names like `Sopa_wantÃ¡n.jpg`), and **404 (Not Found)** errors on Linux/Nginx servers:

1.  **During Uploads**: The frontend sanitizes image filenames before dispatching them to the API via the `prepareFileForUpload` utility in `src/utils/imageUtils.ts`. Accents, special characters, and spaces are removed or replaced with safe ASCII equivalents (e.g., `á` -> `a`, spaces -> `_`).
2.  **During Rendering**: For older database entries featuring corrupted filenames, the application runs the `fixImageUrl` helper on the returned URLs, automatically resolving UTF-8 decoding anomalies to ensure the browser requests the actual file from Nginx.

---

## Continuous Integration & Continuous Deployment (CI/CD)

The project leverages **GitHub Actions** to automate builds and deploy directly to AWS EC2 containerized environments.

### 🧪 QA Testing Environment
*   **Trigger**: Push to the `QA` branch (or dispatch event triggered by a successful backend deploy).
*   **Workflow**:
    1.  Downloads the code and builds the frontend Docker image.
    2.  Pushes the image to Docker Hub (`centraleats-frontend:qa`).
    3.  Establishes an SSH connection to the QA EC2 server.
    4.  Pulls the new image and performs a safe "Hot Swap" deployment, with automatic rollback if the HTTP smoke test fails.
    5.  Dispatches status notifications to Discord.

### 🚀 Production Environment
*   **Trigger**: Push to the `main` branch (or manual workflow dispatch).
*   **Workflow**:
    1.  Calculates and creates a new semantic version tag (e.g., `v1.0.2`).
    2.  Promotes the Docker image from QA to Production in Docker Hub.
    3.  Downloads and launches the production container on the EC2 server (port `8080`).
    4.  Autogenerates a GitHub Release with the changelog.
    5.  Dispatches success/failure notifications to Discord.

---

## Authors
*   **Kevin Moyon** - Lead Developer & Architect
