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
    console.log("AUTH PROFILE:", profile);

    useEffect(() => {
        // Only attempt to sync if no previous error occurred to avoid infinite request loops
        if (isClerkLoaded && isSignedIn && !profile && !isLoadingProfile && !error) {
            fetchProfile().catch(() => {
                console.error("Profile synchronization failed. Please check your connection.");
            });
        }
    }, [isClerkLoaded, isSignedIn, profile, isLoadingProfile, fetchProfile, error]);

    // Clear local auth state if Clerk session is invalid
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

    // Backend uses uppercase roles (STUDENT, VENDOR), normalize for consistency
    const rawRole = profile?.role || (clerkUser?.publicMetadata?.role as string | undefined);
    const normalizedRole = rawRole?.toUpperCase();
    const isActive = profile ? profile.isActive : true;

    // Block access if account is deactivated in the backend
    if (profile && !isActive) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
                <h2 style={{ color: '#E65100', fontSize: '2rem' }}>Account Deactivated</h2>
                <p style={{ color: '#042E63' }}>Please contact the system administrator for assistance.</p>
            </div>
        );
    }

    if (!normalizedRole && location.pathname !== "/role-selection") {
        return <Navigate to="/role-selection" replace />;
    }

    return <>{children}</>;
};