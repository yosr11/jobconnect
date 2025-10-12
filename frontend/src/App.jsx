import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Login from './pages/Login.jsx'
import RegisterCandidat from './pages/RegisterCandidat.jsx'
import RegisterRecruteur from './pages/RegisterRecruteur.jsx'
import ResetPassword from "./pages/ResetPassword";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCandidat from "./pages/DashboardCandidat";
import DashboardRecruteur from "./pages/DashboardRecruteur";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-candidat" element={<RegisterCandidat />} />
      <Route path="/register-recruteur" element={<RegisterRecruteur />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-candidat" element={<DashboardCandidat />} />
        <Route path="/dashboard-recruteur" element={<DashboardRecruteur />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


