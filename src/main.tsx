import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { ClerkProvider } from '@clerk/clerk-react';

import App from './App';
import theme from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VITE_CLERK_PUBLISHABLE_KEY, VITE_API_BASE_URL } from './config/env';

// eslint-disable-next-line react-refresh/only-export-components
const PUBLISHABLE_KEY = VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

console.log("API BASE URL:", VITE_API_BASE_URL);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider value={theme}>
                    <App />
                </ChakraProvider>
            </QueryClientProvider>
        </ClerkProvider>
    </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("SW registration failed:", err);
    });
  });
}