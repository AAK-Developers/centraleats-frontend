import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export function RoleGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) return <div>Cargando...</div>;

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    const role = user?.publicMetadata?.role as string | undefined;

    if (!role) {
        return <Navigate to="/role-selection" replace />;
    }

    return <>{children}</>;
}