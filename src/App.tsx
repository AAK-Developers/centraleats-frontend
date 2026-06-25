import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthInitializer } from './components/auth/AuthInitializer';

import PresentationPage from './pages/landing/PresentationPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import StudentDashboardPage from './pages/student/StudentDashboardPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import RestaurantRegistrationPage from './pages/vendor/RestaurantRegistrationPage';
import RegisterMenuPage from './pages/vendor/RegisterMenuPage';
import { ActiveOrderProvider } from './context/ActiveOrderContext';


export default function App() {
  return (
    <BrowserRouter>
      <ActiveOrderProvider>
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

          </Routes>
        </AuthInitializer>
      </ActiveOrderProvider>
    </BrowserRouter>
  );
}