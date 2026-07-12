import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptor } from '../../api/axiosConfig';
import { connectSocket, disconnectSocket, setTokenGetter } from '../../lib/socketManager';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        const ejectInterceptor = setupAxiosInterceptor(getToken);

        return () => {
            ejectInterceptor();
        };
    }, [getToken]);

    useEffect(() => {
        if (isSignedIn) {
            setTokenGetter(getToken);
            connectSocket();
        } else {
            disconnectSocket();
            setTokenGetter(null);
        }
    }, [isSignedIn, getToken]);

    useEffect(() => {
        return () => {
            disconnectSocket();
            setTokenGetter(null);
        };
    }, []);

    return <>{children}</>;
}