import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@clerk/clerk-react', () => ({
    useAuth: () => ({ getToken: vi.fn().mockResolvedValue(null), isSignedIn: false }),
    useUser: () => ({ isLoaded: true, isSignedIn: false }),
}));

vi.mock('../lib/socketManager', () => ({
    connectSocket: vi.fn(),
    disconnectSocket: vi.fn(),
    setTokenGetter: vi.fn(),
    getSocket: vi.fn(() => ({ on: vi.fn(), off: vi.fn(), connect: vi.fn(), disconnect: vi.fn() })),
}));

import App from '../App';
import theme from '../theme';

describe('App smoke test', () => {
    it('renders the landing route without crashing', async () => {
        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <ChakraProvider value={theme}>
                    <App />
                </ChakraProvider>
            </QueryClientProvider>
        );

        expect(await screen.findByText('Iniciar Sesión')).toBeInTheDocument();
    });
});
