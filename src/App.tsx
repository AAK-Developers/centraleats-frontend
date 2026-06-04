import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PresentationPage from './pages/PresentationPage'
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  )
}