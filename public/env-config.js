// This file is used in production/QA to inject environment variables at runtime.
// In development, the values are loaded from Vite's import.meta.env or this file.
window.env = {
  VITE_API_BASE_URL: "",
  VITE_CLERK_PUBLISHABLE_KEY: "",
  VITE_APP_ENV: ""
};
