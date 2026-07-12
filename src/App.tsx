import { Suspense, lazy } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthInitializer } from './components/auth/AuthInitializer';
import { Center, Spinner } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';

const isElectron = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron');

const Router = isElectron ? HashRouter : BrowserRouter;

const PresentationPage = lazy(() => import('./pages/landing/PresentationPage'));
const RoleSelectionPage = lazy(() => import('./pages/auth/RoleSelectionPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const StudentDashboardPage = lazy(() => import('./pages/student/StudentDashboardPage'));
const VendorDashboardPage = lazy(() => import('./pages/vendor/VendorDashboardPage'));
const RestaurantRegistrationPage = lazy(() => import('./pages/vendor/RestaurantRegistrationPage'));
const RegisterMenuPage = lazy(() => import('./pages/vendor/RegisterMenuPage'));
const VendorMetricsPage = lazy(() => import('./pages/vendor/VendorMetricsPage'));

const LoadingFallback = () => (
  <Center h="100vh" w="100vw">
    <Spinner size="xl" color="primaryOrange" />
  </Center>
);

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AuthInitializer>
        <Suspense fallback={<LoadingFallback />}>
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

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthInitializer>

    </Router>
  );
}
