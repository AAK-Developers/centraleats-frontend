# CentralEats Delivery Dashboard

The **CentralEats Delivery Dashboard** is a high-performance mobile-first application designed for the University Central del Ecuador (UCE) *Click & Collect* ecosystem. It provides real-time operational insights, revenue tracking, and order management through an elegant, data-driven interface.

---

## 🏗️ Architecture & Structure
The project is built for scalability and maintainability, leveraging modern React patterns and atomic organization.

### Core Modules
* **`src/components/`**: Houses modular UI components using `Recharts` for data visualization. Key components include:
    * `SummaryCards`: High-level metrics with color-coded icons.
    * `Charts`: Specialized views for `OrdersByHour`, `StatusDistribution`, `TopRestaurants`, and `TopProducts`.
    * `Lists`: `DeliveryRankingList` and `RecentOrdersList` for operational tracking.
* **`src/hooks/`**: Centralizes business logic and data fetching state via `useDashboardStats.ts`.
* **`src/api.ts`**: Encapsulates API request logic, ensuring type-safe communication with the backend.
* **`src/types.ts`**: Defines strict TypeScript interfaces, mirroring the backend data structures.
* **`android-config/`**: Contains native Android security configurations, specifically `network_security_config.xml`, enabling secure communication with non-SSL backends without compromising global app security.

---

## 🛠️ Technical Stack
* **Frontend**: React 19, TypeScript, Vite.
* **Data Visualization**: Recharts.
* **Native Capabilities**: Capacitor (Core & CLI).
* **UI/UX**: Lucide-React icons and custom thematic styling.
* **Environment**: Developed with a mobile-first approach, ready for Android deployment via Android Studio.

---

## 🚀 Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### Development
Clone the repository, install dependencies, and start the development server:

```bash
git clone [https://github.com/AAK-Developers/centraleats-frontend.git](https://github.com/AAK-Developers/centraleats-frontend.git)
cd centraleats-frontend
npm install
npm run dev
```

Access the dashboard at `http://localhost:5173`.

## Android Deployment

Generate the web build, sync with Capacitor, and open in Android Studio:

```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
```