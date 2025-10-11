import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Login from './pages/Login.jsx'
import RegisterCandidat from './pages/RegisterCandidat.jsx'
import RegisterRecruteur from './pages/RegisterRecruteur.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-candidat" element={<RegisterCandidat />} />
      <Route path="/register-recruteur" element={<RegisterRecruteur />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


