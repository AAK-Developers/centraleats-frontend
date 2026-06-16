import React, { useEffect } from 'react';

import PresentationPage from '../../pages/landing/PresentationPage';

import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthMe } from '../../hooks/useAuthMe';
import { useAuthStore } from '../../store/authStore';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded: isClerkLoaded, isSignedIn, user: clerkUser } = useUser();
    const { profile, isLoadingProfile, fetchProfile, error } = useAuthMe();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const location = useLocation();

    useEffect(() => {
        // Solo intentamos sincronizar si no hay un error previo, para evitar bucles infinitos
        if (isClerkLoaded && isSignedIn && !profile && !isLoadingProfile && !error) {
            fetchProfile().catch(() => {
                console.error("No se pudo sincronizar el perfil con el backend. Verifique la conexión.");
            });
        }
    }, [isClerkLoaded, isSignedIn, profile, isLoadingProfile, fetchProfile, error]);

    // Limpiar auth si Clerk no está firmado
    useEffect(() => {
        if (isClerkLoaded && !isSignedIn) {
            clearAuth();
        }
    }, [isClerkLoaded, isSignedIn, clearAuth]);

    if (!isClerkLoaded || (isSignedIn && isLoadingProfile && !profile)) {
        return <PresentationPage />;
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    // Si tenemos el perfil del backend, usamos esa fuente de verdad
    const role = profile?.role || (clerkUser?.publicMetadata?.role as string | undefined);
    const isActive = profile ? profile.isActive : true;

    // Bloquear si la cuenta está desactivada en el backend
    if (profile && !isActive) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Cuenta Desactivada</h2>
                <p>Por favor contacta al administrador.</p>
            </div>
        );
    }

    if (!role && location.pathname !== "/role-selection") {
        return <Navigate to="/role-selection" replace />;
    }

    return <>{children}</>;
};