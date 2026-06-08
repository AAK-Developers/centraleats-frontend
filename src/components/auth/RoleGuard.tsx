import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export function RoleGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <div>Cargando...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const role = user.publicMetadata.role;

    if (!role) {
        return <Navigate to="/role-selection" replace />;
    }

    return children;
}