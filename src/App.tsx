import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthInitializer } from './components/auth/AuthInitializer';

import PresentationPage from './pages/PresentationPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage';

import StudentDashboardPage from './pages/StudentDashboardPage';
import VendorDashboardPage from './pages/VendorDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>

          <Route path="/" element={<PresentationPage />} />
          <Route path="/login" element={<LoginPage />} />

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

        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}