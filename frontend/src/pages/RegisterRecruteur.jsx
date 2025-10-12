import React, { useState, useEffect } from "react";
import { Building2, Mail, Lock, Phone, User, AlertCircle, CheckCircle, Plus, X, ChevronDown, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosConfig.js";
import EntrepriseForm from "../components/EntrepriseForm.jsx";

const RegisterRecruteur = () => {
  // États pour le formulaire recruteur
  const [recruteurForm, setRecruteurForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    num_tel: "",
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
    entreprise_id: "",
  });

  // États pour le formulaire entreprise (supprimé car maintenant géré par EntrepriseForm)

  // États généraux
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [showCreateEntreprise, setShowCreateEntreprise] = useState(false);
  
  // États pour les messages et chargement
  const [recruteurMessage, setRecruteurMessage] = useState("");
  const [recruteurError, setRecruteurError] = useState("");
  
  // États pour le chargement
  const [isLoadingRecruteur, setIsLoadingRecruteur] = useState(false);
  const [isLoadingEntreprises, setIsLoadingEntreprises] = useState(false);

  const navigate = useNavigate();

  // Charger les entreprises au montage du composant
  useEffect(() => {
    loadEntreprises();
  }, []);

  // Fonction pour charger la liste des entreprises
  const loadEntreprises = async () => {
    try {
      setIsLoadingEntreprises(true);
      console.log("🔄 Chargement des entreprises...");
      const { data } = await api.get("/entreprises");
      console.log("📡 Réponse API entreprises:", data);
      
      if (data.success) {
        setEntreprises(data.entreprises);
        console.log("✅ Entreprises chargées:", data.entreprises.length);
      } else {
        console.error("❌ Erreur dans la réponse:", data.message);
        setRecruteurError("Erreur lors du chargement des entreprises");
      }
    } catch (err) {
      console.error("❌ Erreur lors du chargement des entreprises:", err);
      setRecruteurError("Erreur lors du chargement des entreprises: " + (err?.response?.data?.message || err.message));
    } finally {
      setIsLoadingEntreprises(false);
    }
  };

  // Validation du formulaire recruteur
  const validateRecruteur = () => {
    const { nom, prenom, email, num_tel, mot_de_passe, confirmer_mot_de_passe, entreprise_id } = recruteurForm;
    
    if (!nom || !prenom || !email || !num_tel || !mot_de_passe || !confirmer_mot_de_passe || !entreprise_id) {
      return "Veuillez remplir tous les champs obligatoires.";
    }
    
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return "Adresse email invalide.";
    }
    
    if (!/^\d{8}$/.test(num_tel)) {
      return "Le numéro de téléphone doit contenir exactement 8 chiffres.";
    }
    
    if (mot_de_passe.length < 6) {
      return "Mot de passe trop court (6 caractères minimum).";
    }
    
    if (mot_de_passe !== confirmer_mot_de_passe) {
      return "Les mots de passe ne correspondent pas.";
    }
    
    return "";
  };

  // Validation du formulaire entreprise (supprimé car maintenant géré par EntrepriseForm)

  // Gestionnaires de changement pour le formulaire recruteur
  const onChangeRecruteur = (e) => {
    setRecruteurForm({ ...recruteurForm, [e.target.name]: e.target.value });
    // Effacer les messages d'erreur quand l'utilisateur commence à taper
    if (recruteurError) {
      setRecruteurError("");
    }
  };

  // Gestionnaires de changement pour le formulaire entreprise (supprimé car maintenant géré par EntrepriseForm)

  // Sélection d'une entreprise existante
  const handleEntrepriseSelect = (entreprise) => {
    setSelectedEntreprise(entreprise);
    setRecruteurForm({ ...recruteurForm, entreprise_id: entreprise._id });
    setShowCreateEntreprise(false);
  };

  // Callback appelé quand une entreprise est créée avec succès
  const handleEntrepriseCreated = (newEntreprise) => {
    console.log("✅ Nouvelle entreprise créée:", newEntreprise);
    
    // Ajouter la nouvelle entreprise à la liste
    setEntreprises([...entreprises, newEntreprise]);
    
    // Sélectionner automatiquement la nouvelle entreprise
    handleEntrepriseSelect(newEntreprise);
    
    // Fermer le formulaire après succès
    setTimeout(() => {
      setShowCreateEntreprise(false);
    }, 2000);
  };

  // Création d'un nouveau recruteur
  const handleCreateRecruteur = async (e) => {
    e.preventDefault();
    setRecruteurMessage("");
    setRecruteurError("");
    setIsLoadingRecruteur(true);

    const validationError = validateRecruteur();
    if (validationError) {
      setRecruteurError(validationError);
      setIsLoadingRecruteur(false);
      return;
    }

    try {
      console.log("🔄 Création du recruteur:", recruteurForm);
      
      const { data } = await api.post("/recruteur/register", recruteurForm);
      console.log("📡 Réponse API création recruteur:", data);
      
      if (data.success) {
        setRecruteurMessage("Recruteur créé avec succès !");
        
        // Réinitialiser le formulaire recruteur
        setRecruteurForm({
          nom: "",
          prenom: "",
          email: "",
          num_tel: "",
          mot_de_passe: "",
          confirmer_mot_de_passe: "",
          entreprise_id: "",
        });
        setSelectedEntreprise(null);
        
        console.log("✅ Recruteur créé avec succès");
        
        // Effacer les messages après 5 secondes
        setTimeout(() => {
          setRecruteurMessage("");
        }, 5000);
      } else {
        console.error("❌ Erreur dans la réponse:", data.message);
        setRecruteurError(data.message || "Erreur lors de la création du recruteur");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la création du recruteur:", err);
      setRecruteurError(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur serveur lors de la création du recruteur"
      );
    } finally {
      setIsLoadingRecruteur(false);
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

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inscription Recruteur
            </h2>
            <p className="text-gray-500 mt-2">
              Créez votre compte pour publier vos offres d'emploi
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateRecruteur} className="space-y-4">
            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Nom *</label>
                <input
                  name="nom"
                  value={recruteurForm.nom}
                  onChange={onChangeRecruteur}
                  placeholder="Nom"
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Prénom *</label>
                <input
                  name="prenom"
                  value={recruteurForm.prenom}
                  onChange={onChangeRecruteur}
                  placeholder="Prénom"
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Adresse email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={recruteurForm.email}
                  onChange={onChangeRecruteur}
                  placeholder="nom@entreprise.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Numéro de téléphone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="num_tel"
                  value={recruteurForm.num_tel}
                  onChange={onChangeRecruteur}
                  placeholder="8 chiffres"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Sélection d'entreprise */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Entreprise *
              </label>
              {isLoadingEntreprises ? (
                <div className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-center text-gray-500">
                  Chargement des entreprises...
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Dropdown des entreprises */}
                  <div className="relative">
                    <select
                      name="entreprise_id"
                      value={recruteurForm.entreprise_id}
                      onChange={(e) => {
                        const entreprise = entreprises.find(emp => emp._id === e.target.value);
                        if (entreprise) {
                          handleEntrepriseSelect(entreprise);
                        }
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Sélectionnez une entreprise</option>
                      {entreprises.map((entreprise) => (
                        <option key={entreprise.id} value={entreprise._id}>
                          {entreprise.nom}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Bouton pour créer une nouvelle entreprise */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateEntreprise(!showCreateEntreprise);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {showCreateEntreprise ? "Annuler" : "Créer une nouvelle entreprise"}
                    </span>
                  </button>

                  {/* Formulaire de création d'entreprise */}
                  {showCreateEntreprise && (
                    <div className="mt-4">
                      <EntrepriseForm
                        onEntrepriseCreated={handleEntrepriseCreated}
                        onCancel={() => setShowCreateEntreprise(false)}
                        className="shadow-none border-0 bg-gray-50"
                      />
                    </div>
                  )}

                  {/* Affichage de l'entreprise sélectionnée */}
                  {selectedEntreprise && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Entreprise sélectionnée: {selectedEntreprise.nom}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mots de passe */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Mot de passe *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="mot_de_passe"
                    value={recruteurForm.mot_de_passe}
                    onChange={onChangeRecruteur}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Confirmer *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmer_mot_de_passe"
                    value={recruteurForm.confirmer_mot_de_passe}
                    onChange={onChangeRecruteur}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Messages pour le recruteur */}
            {recruteurMessage && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{recruteurMessage}</span>
              </div>
            )}
            {recruteurError && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{recruteurError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoadingRecruteur}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoadingRecruteur ? (
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
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>
          </div>

          {/* Bouton Retour à l'accueil */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              Retour à l'accueil
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

export default RegisterRecruteur;