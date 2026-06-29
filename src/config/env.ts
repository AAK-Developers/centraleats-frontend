interface WindowEnv {
  VITE_API_BASE_URL?: string;
  VITE_CLERK_PUBLISHABLE_KEY?: string;
  VITE_APP_ENV?: string;
}

declare global {
  interface Window {
    env?: WindowEnv;
  }
}

export const VITE_API_BASE_URL = window.env?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';
export const VITE_CLERK_PUBLISHABLE_KEY = window.env?.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
export const VITE_APP_ENV = window.env?.VITE_APP_ENV || import.meta.env.VITE_APP_ENV || 'development';
