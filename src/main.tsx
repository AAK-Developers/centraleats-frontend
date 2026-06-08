import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { ClerkProvider } from '@clerk/clerk-react';

import App from './App';
import theme from './theme';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <ChakraProvider value={theme}>
                <App />
            </ChakraProvider>
        </ClerkProvider>
    </React.StrictMode>
);