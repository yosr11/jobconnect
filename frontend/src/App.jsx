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
import AllOffresCandidat from  "./pages/AllOffresCandidat";
import ProfilCandidat from "./pages/profilCandidat";
import Entreprise from "./pages/Entreprise";
import Profil from "./pages/Profil";
import OffreEmploi from "./pages/OffreEmploi";

export default function App() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-candidat" element={<RegisterCandidat />} />
      <Route path="/register-recruteur" element={<RegisterRecruteur />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      
       {/* Dashboard Candidat avec son layout */}
        <Route element={<DashboardCandidatLayout />}>
          <Route
            path="/dashboard-candidat"
            element={token ? <DashboardCandidat /> : <Navigate to="/login" />}
          />
          <Route
            path="/AllOffresCandidat"
            element={token ? <AllOffresCandidat /> : <Navigate to="/login" />}
          />

           <Route
            path="/ProfilCandidat"
            element={token ? <ProfilCandidat /> : <Navigate to="/login" />}
          />
          {/* Ici tu peux ajouter d'autres pages candidat */}
        </Route>

      {/* Routes protégées sous le layout recruteur */}
      <Route element={<DashboardLayout />}>
        
        <Route path="/entreprise" element={<Entreprise />} />
        <Route path="/dashboard-recruteur" element={<DashboardRecruteur />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/offres" element={token ? <OffreEmploi /> : <Navigate to="/login" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
