import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthInitializer } from './components/auth/AuthInitializer';

import { isCapacitorNative } from './mobile';

// Router selection: HashRouter ONLY for Capacitor (file:// or capacitor:// protocol)
// Electron uses BrowserRouter because it loads real HTTP URLs (localhost or remote)
// Web uses BrowserRouter (standard)
const Router = isCapacitorNative() ? HashRouter : BrowserRouter;

import PresentationPage from './pages/landing/PresentationPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

import StudentDashboardPage from './pages/student/StudentDashboardPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import RestaurantRegistrationPage from './pages/vendor/RestaurantRegistrationPage';
import RegisterMenuPage from './pages/vendor/RegisterMenuPage';
import VendorMetricsPage from './pages/vendor/VendorMetricsPage';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AuthInitializer>
        <Routes>

          <Route path="/" element={<PresentationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth-callback" element={<OAuthCallbackPage />} />

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
