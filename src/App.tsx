import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthInitializer } from './components/auth/AuthInitializer';
import { useState, useEffect } from 'react';
import { SplashScreen } from './components/shared/organisms/SplashScreen';

// Detect natively wrapped environments (Capacitor/Electron)


const isNative = typeof window !== 'undefined' && (
  !!(window as any).Capacitor ||
  window.location.protocol === 'file:' ||
  navigator.userAgent.toLowerCase().includes('electron')
);

const Router = isNative ? HashRouter : BrowserRouter;

import PresentationPage from './pages/landing/PresentationPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import StudentDashboardPage from './pages/student/StudentDashboardPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import RestaurantRegistrationPage from './pages/vendor/RestaurantRegistrationPage';
import RegisterMenuPage from './pages/vendor/RegisterMenuPage';
import VendorMetricsPage from './pages/vendor/VendorMetricsPage';
import { Toaster } from 'react-hot-toast';
import { SplashScreen as CapacitorSplashScreen } from '@capacitor/splash-screen'; 

export default function App() {
  const [showSplash, setShowSplash] = useState(isNative);
  const [splashFadingOut, setSplashFadingOut] = useState(false);

  useEffect(() => {
    if (isNative) {
      CapacitorSplashScreen.hide();
      const fadeTimer = setTimeout(() => setSplashFadingOut(true), 1600);
      const removeTimer = setTimeout(() => setShowSplash(false), 2200);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (showSplash) {
    return <SplashScreen fadeOut={splashFadingOut} />;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <AuthInitializer>
        <Routes>

          <Route path="/" element={<PresentationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/role-selection"
            element={
              <ProtectedRoute>
                <RoleSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute>
                <VendorDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor-dashboard/metrics"
            element={
              <ProtectedRoute>
                <VendorMetricsPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/register-restaurant"
            element={
              <ProtectedRoute>
                <RestaurantRegistrationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register-menu"
            element={
              <ProtectedRoute>
                <RegisterMenuPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-menu"
            element={
              <ProtectedRoute>
                <RegisterMenuPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthInitializer>

    </Router>
  );
}
