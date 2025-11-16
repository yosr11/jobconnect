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
import DashboardCandidatLayout from "./layouts/DashboardCandidatLayout";
import AllOffresCandidat from "./pages/AllOffresCandidat";
import ProfilCandidat from "./pages/profilCandidat";
import PostulerOffre from "./pages/PostulerOffre";
import Entreprise from "./pages/Entreprise";
import Profil from "./pages/Profil";
import OffreEmploi from "./pages/OffreEmploi";
import MesCandidatures from "./pages/MesCandidatures";

// ⚡ Composant de protection des routes
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("🔒 Protection route - Token:", !!token, "| Role:", role);

  if (!token) {
    console.log("❌ Pas de token, redirection vers login");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    console.log(`❌ Role incorrect. Attendu: ${requiredRole}, Reçu: ${role}`);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-candidat" element={<RegisterCandidat />} />
      <Route path="/register-recruteur" element={<RegisterRecruteur />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      <Route path="/candidat/mes-candidatures" element={<MesCandidatures />} />

      {/* Routes Candidat protégées */}
      <Route
        element={
          <ProtectedRoute requiredRole="candidat">
            <DashboardCandidatLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard-candidat" element={<DashboardCandidat />} />
        <Route path="/AllOffresCandidat" element={<AllOffresCandidat />} />
        <Route path="/ProfilCandidat" element={<ProfilCandidat />} />
        <Route path="/candidat/postuler/:offreId" element={<PostulerOffre />} />
      </Route>

      {/* Routes Recruteur protégées */}
      <Route
        element={
          <ProtectedRoute requiredRole="recruteur">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard-recruteur" element={<DashboardRecruteur />} />
        <Route path="/entreprise" element={<Entreprise />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/offres" element={<OffreEmploi />} />
      </Route>

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}