import React from 'react';

import PresentationPage from '../../pages/PresentationPage';

import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const location = useLocation();

    if (!isLoaded) return <PresentationPage />;

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    const role = user?.publicMetadata?.role as string | undefined;

    if (!role && location.pathname !== "/role-selection") {
        return <Navigate to="/role-selection" replace />;
    }

    return <>{children}</>;
};