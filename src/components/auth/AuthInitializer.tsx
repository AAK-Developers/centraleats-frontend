import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptor } from '../../api/axiosConfig';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { getToken } = useAuth();

    useEffect(() => {
        const ejectInterceptor = setupAxiosInterceptor(getToken);

        return () => {
            ejectInterceptor();
        };
    }, [getToken]);

    return <>{children}</>;
}