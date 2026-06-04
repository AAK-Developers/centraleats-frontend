// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PresentationPage from './pages/PresentationPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PresentationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}