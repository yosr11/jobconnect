import React, { useState } from "react";
import { Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("candidat");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  // ✅ Validation simple de l'email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    // Vérification du format email
    if (!validateEmail(email)) {
      setEmailError("Adresse email invalide");
      return;
    } else {
      setEmailError("");
    }

    setIsLoading(true);

    try {
      const url =
        role === "candidat"
          ? "http://localhost:5000/api/candidat/login"
          : "http://localhost:5000/api/recruteur/login";

      const response = await axios.post(url, {
        email,
        mot_de_passe: motDePasse,
      });

      console.log("Login response:", response.data);
      const connectedUser = response.data.user || response.data.candidat || response.data;

      setMessage(response.data.message || "Connexion réussie !");
      sessionStorage.setItem("user", JSON.stringify(connectedUser));

      const roleFromServer = connectedUser?.role || role;
      if (roleFromServer === "candidat") {
        navigate("/dashboard-candidat");
      } else {
        navigate("/dashboard-recruteur");
      }
    } catch (error) {
      console.error("Login error:", error?.response?.data ?? error);
      setMessage(error?.response?.data?.message || error.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url(recrutement.jpg)" }}
      ></div>
      <div className="absolute inset-0 bg-blue-900 opacity-40"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Bienvenue
            </h2>
            <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
          </div>

          <div className="space-y-5">
            {/* Sélection du rôle */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Vous êtes</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("candidat")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    role === "candidat"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Candidat
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruteur")}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    role === "recruteur"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Recruteur
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  required
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 ${
                    emailError ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/* Mot de passe avec œil */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl ${
                  message.includes("réussie")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.includes("réussie") ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            {/* Bouton Se connecter */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-semibold"
              onClick={() => navigate("/register")}
            >
              S'inscrire
            </button>
          </div>
          <div className="mt-6 text-center text-sm text-gray-600">
             
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-semibold"
              onClick={() => navigate("/mot_de_passe_oublié")}
            >
              Mot de passe oublié
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
