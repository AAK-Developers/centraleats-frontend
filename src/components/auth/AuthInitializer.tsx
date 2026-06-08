import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptor } from '../../api/axiosConfig';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { getToken } = useAuth();

    useEffect(() => {
        setupAxiosInterceptor(getToken);
    }, [getToken]);

    return <>{children}</>;
}