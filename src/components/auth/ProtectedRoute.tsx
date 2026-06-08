import React from 'react';
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) return <div>Cargando...</div>;

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    const role = user.publicMetadata.role as string | undefined;

    if (!role && window.location.pathname !== "/role-selection") {
        return <Navigate to="/role-selection" replace />;
    }

    return <>{children}</>;
};