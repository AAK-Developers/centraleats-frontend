# 🛒 CentralEats - Frontend 🚀

Welcome to the official frontend repository of **CentralEats**, a digital "Click & Collect" food management platform designed specifically for the community at the Universidad Central del Ecuador (UCE).

---

## 👨‍💻 Project Lead & Responsibility

- **Front-End Developer & UI-UX Lead:** Kevin Moyon

The project is built with a strict **Mobile-First** approach, ensuring an ultra-fast, highly accessible, and seamless user experience for students and vendors navigating the application on campus.

---

## 🛠️ Core Technology Stack

To meet the highest standards of performance, strict typing, and modern user experience, the frontend leverages:

- **Core Library:** [React 19](https://react.dev/) (Utilizing native *Actions* and asynchronous hooks to minimize UI latency and handle optimistic updates)
- **Build Toolchain:** [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/) (Ensuring near-instantaneous Hot Module Replacement during development and a bulletproof type-safe environment)
- **Hybrid Rendering Framework:** [Astro](https://astro.build/) (Integrated via *Islands Architecture* to serve lightning-fast static landing pages and public catalogs)
- **Design System:** [Chakra UI](https://v2.chakra-ui.com/) (Providing accessible, WAI-ARIA compliant components styled to reflect our exact corporate brand identity, including our signature institutional blue `#004aad`)
- **State Management:** 
  - [Zustand](https://zustand-demo.pmnd.rs/) (For lightweight, boilerplate-free global UI and shopping cart state)
  - [TanStack Query v5](https://tanstack.com/query/latest) (For automated server-state synchronization, caching, and background revalidations)
- **Form Handling & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (For high-performance, schema-driven form validations that avoid unnecessary re-renders)
- **Authentication:** [Clerk Auth](https://clerk.com/) (Enabling fast, seamless social and institutional login for both students and vendors)

---

## 📐 Project Architecture

The codebase inside the `/src` directory strictly implements the principles of **Atomic Design**, ensuring high component reusability and a strict separation of concerns:

```text
src/
├── api/            # Axios client configuration and security interceptors
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Components organized by Atomic Design:
│   ├── atoms/      # Basic components (buttons, inputs, etc.)
│   ├── auth/       # Authentication-specific logic and UI
│   ├── layout/     # Structural components (headers, footers, wrappers)
│   ├── molecules/  # Simple combinations of atoms
│   └── organisms/  # Complex and functional components
├── hooks/          # Custom React hooks
├── pages/          # Application views (mapped to routes)
├── store/          # Global state management (Zustand)
├── App.tsx         # Application entry point and routes
├── main.tsx        # React rendering and provider configuration
└── theme.ts        # Design system configuration (Chakra UI)
