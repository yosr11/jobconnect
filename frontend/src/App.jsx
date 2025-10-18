import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import RegisterCandidat from "./pages/RegisterCandidat";
import RegisterRecruteur from "./pages/RegisterRecruteur";
import ResetPassword from "./pages/ResetPassword";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCandidat from "./pages/DashboardCandidat";
import DashboardRecruteur from "./pages/DashboardRecruteur";
import DashboardLayout from "./layouts/DashboardLayout";
import Entreprise from "./pages/Entreprise";

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
      

      {/* Routes protégées sous le layout recruteur */}
      <Route element={<DashboardLayout />}>
        
        <Route path="/entreprise" element={<Entreprise />} />
        <Route path="/dashboard-recruteur" element={<DashboardRecruteur />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
