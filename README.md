# 🛒 CentralEats - Frontend 🚀

CentralEats is a high-performance "Click & Collect" food management platform specifically designed for the community at the Universidad Central del Ecuador (UCE). Its Mobile-First architecture ensures ultra-fast loading times and a seamless user experience across the campus.

## 👨‍💻 Project Lead
**Lead Developer & UI/UX Architect:** Kevin Moyon

## 🛠️ Tech Stack
The project utilizes a modern, strongly-typed, and reactive stack designed to handle the high concurrency of university life:

* **Runtime & Framework:** React 19, TypeScript, Vite.
* **Design System:** Chakra UI (WAI-ARIA compliant, brand-aligned).
* **State Management:**
    * **Zustand:** High-performance global UI state (Cart, user preferences).
    * **TanStack Query v5:** Server state synchronization, automatic caching, and background revalidation.
* **Forms:** React Hook Form + Zod (schema-based validation).
* **Auth Layer:** Clerk (Institutional and social authentication).
* **Networking:** Axios (with security interceptors for token management).

## 📦 Installation
To initialize the project environment, run the following command:

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion \
react-hook-form zod axios react-hot-toast react-router-dom \
@clerk/clerk-react zustand @tanstack/react-query react-icons

```


##  📐 Architecture (Atomic Design)
The /src directory implements Atomic Design to maximize code reusability and maintainability:

Plaintext
src/
├── api/            # Axios instance and API services
├── assets/         # Branding and shared media
├── components/     # Design System:
│   ├── atoms/      # Primitive components (AppButton, ImageUploadBox)
│   ├── molecules/  # Functional units (FormSection, TimeRangeInput)
│   ├── organisms/  # Complex blocks (AuthHeader, Navbars)
│   └── layout/     # Structural wrappers (WaveLayout, AppContainer)
├── hooks/          # Custom business logic (e.g., useAuthRedirect)
├── pages/          # Route views (Registration, Dashboard, Menu)
├── store/          # Global state slices (Zustand)
├── App.tsx         # Route definitions and protection logic
└── theme.ts        # Global Chakra UI theme configurations

