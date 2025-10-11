import React, { useState } from "react";
import { UserPlus, Mail, Lock, Phone, User, AlertCircle, CheckCircle } from "lucide-react";
import api from "../services/axiosConfig.js";

const RegisterCandidat = () => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    num_tel: "",
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const { nom, prenom, email, num_tel, mot_de_passe, confirmer_mot_de_passe } = form;
    if (!nom || !prenom || !email || !num_tel || !mot_de_passe || !confirmer_mot_de_passe)
      return "Veuillez remplir tous les champs.";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      return "Adresse email invalide.";
    if (!/^\d{8}$/.test(num_tel))
      return "Le numéro de téléphone doit contenir 8 chiffres.";
    if (mot_de_passe.length < 6)
      return "Mot de passe trop court (6 caractères minimum).";
    if (mot_de_passe !== confirmer_mot_de_passe)
      return "Les mots de passe ne correspondent pas.";
    return "";
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/candidat/register", form);
      setMessage(data?.message || "Inscription réussie !");
      setForm({
        nom: "",
        prenom: "",
        email: "",
        num_tel: "",
        mot_de_passe: "",
        confirmer_mot_de_passe: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur serveur lors de l’inscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url(recrutement.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-900 opacity-40"></div>

      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inscription Candidat
            </h2>
            <p className="text-gray-500 mt-2">
              Créez votre compte pour postuler facilement
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Nom</label>
                <input
                  name="nom"
                  value={form.nom}
                  onChange={onChange}
                  placeholder="Nom"
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Prénom</label>
                <input
                  name="prenom"
                  value={form.prenom}
                  onChange={onChange}
                  placeholder="Prénom"
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="nom@exemple.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Numéro de téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="num_tel"
                  value={form.num_tel}
                  onChange={onChange}
                  placeholder="8 chiffres"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Mots de passe */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="mot_de_passe"
                    value={form.mot_de_passe}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Confirmer
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmer_mot_de_passe"
                    value={form.confirmer_mot_de_passe}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Création du compte...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Déjà inscrit ?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-semibold"
              onClick={() => (window.location.href = "/login")}
            >
              Se connecter
            </button>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Protégé par reCAPTCHA et soumis aux{" "}
          <button type="button" className="underline hover:text-gray-700">
            conditions d'utilisation
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterCandidat;
