# Central Eats Frontend

Frontend architecture and implementation guide for the Central Eats project.

## Overview

This project is designed with:

- **Astro** for SSG/SSR pages and layouts
- **React 19** for interactive UI
- **Chakra UI (v3+)** as the design system
- **Zustand** for global state
- **TanStack Query** for async server state
- **Axios** for HTTP requests
- **Zod** for runtime validation and type-safe parsing

All implementation and documentation should remain in **English**.

## Target Folder Structure

The frontend must follow this native architecture:

```txt
/src
├── /astro-components   # Astro layouts and static components
├── /components         # React components
│   ├── /common         # Reusable elements (Buttons, Inputs, etc.)
│   ├── /features       # Domain logic (e.g., Cart, Checkout)
│   └── /ui             # Chakra base components
├── /hooks              # Custom hooks
├── /lib                # Configuration (chakra.ts, query.ts, axios.ts)
├── /services           # API call functions (TanStack Query usage)
├── /store              # Global state (Zustand)
├── /types              # TypeScript interfaces and Zod schemas
└── /utils              # Helpers
```

## Engineering Rules

1. **Strict typing**
   - Use TypeScript strictly.
   - Validate API responses with **Zod** in `/src/services`.
2. **Component split**
   - Astro-only pieces belong in `/src/astro-components`.
   - Interactive UI must be React components using Chakra UI.
3. **State strategy**
   - Use **Zustand** for global shared state.
   - Avoid excessive prop-drilling.
4. **Data fetching**
   - Use **TanStack Query** for all server interactions.
   - Do not call `fetch`/`axios` directly from components.
5. **Style and architecture**
   - Keep code clean, modular, and functional.
   - Reuse common and feature-based components.

## Getting Started (Initial Bootstrap)

If the project has not been scaffolded yet, initialize it with Astro and React:

1. Create Astro project:
   - `npm create astro@latest`
2. Add React integration:
   - `npx astro add react`
3. Install required libraries:
   - `npm install @chakra-ui/react @emotion/react zustand @tanstack/react-query axios zod`
4. Create the `/src` structure shown above.
5. Add foundational config modules in `/src/lib`:
   - `chakra.ts`
   - `query.ts`
   - `axios.ts`
6. Start implementing features through `/src/components/features` and `/src/services`.

## Team Delivery Checklist

- [ ] Folder structure matches the architecture above
- [ ] All API response parsing is validated with Zod
- [ ] Components do not contain direct HTTP calls
- [ ] Global state is handled with Zustand where needed
- [ ] TanStack Query is used for server data flows
- [ ] UI follows Chakra UI design system conventions
