import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthInitializer } from './components/auth/AuthInitializer';

import PresentationPage from './pages/landing/PresentationPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import LoginPage from './pages/auth/LoginPage';

import StudentDashboardPage from './pages/student/StudentDashboardPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import RestaurantRegistrationPage from './pages/vendor/RestaurantRegistrationPage';
import RegisterMenuPage from './pages/vendor/RegisterMenuPage';
import FactureDashboard from './pages/payment/FactureDashboard';
import StudentMenuViewPage from './pages/student/StudentMenuViewPage';


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
            path="/facture-dashboard"
            element={
              <ProtectedRoute>
                <FactureDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/menu/:id"
            element={
              <ProtectedRoute>
                <StudentMenuViewPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}