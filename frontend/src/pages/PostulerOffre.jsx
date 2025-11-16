// src/pages/PostulerOffre.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Send, Briefcase, ArrowLeft, Building2, Calendar, Award, AlertCircle, FileText, X } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

const PostulerOffre = () => {
  const { offreId } = useParams();
  const navigate = useNavigate();
  
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState("");
  const [lettreMotivation, setLettreMotivation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffre = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Token manquant, veuillez vous connecter.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/offres/${offreId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Erreur serveur");

        setOffre(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setMessage(error.message);
        setLoading(false);
      }
    };

    fetchOffre();
  }, [offreId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5 MB

      if (!allowedTypes.includes(file.type)) {
        setError('Seuls les fichiers PDF et DOCX sont acceptés');
        return;
      }

      if (file.size > maxSize) {
        setError('Le fichier ne doit pas dépasser 5 MB');
        return;
      }

      setLettreMotivation(file);
      setError('');
    }
  };

  const removeFile = () => {
    setLettreMotivation(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!lettreMotivation) {
      setError('Veuillez ajouter votre lettre de motivation');
      return;
    }

    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem('token');
      const candidatId = localStorage.getItem('candidatId');

      if (!candidatId) {
        throw new Error('ID candidat introuvable. Veuillez vous reconnecter.');
      }

      // Créer FormData pour l'upload
      const formDataToSend = new FormData();
      formDataToSend.append('id_offre', offreId);
      formDataToSend.append('id_candidat', candidatId);
      formDataToSend.append('score', 0);
      formDataToSend.append('lettre_motivation', lettreMotivation);

      const response = await fetch(`${API_URL}/candidatures`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur lors de la candidature');

      alert('🎉 Candidature envoyée avec succès !');
      //navigate('/AllOffresCandidat');
    } catch (error) {
      console.error(error);
      alert('❌ ' + error.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getNiveauColor = (niveau) => {
    const colors = {
      'Junior': 'bg-blue-100 text-blue-700 border-blue-200',
      'Intermédiaire': 'bg-purple-100 text-purple-700 border-purple-200',
      'Senior': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Expert': 'bg-pink-100 text-pink-700 border-pink-200',
    };
    return colors[niveau] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (message || !offre) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-lg flex items-center gap-3">
          <AlertCircle size={24} />
          <p className="font-medium">{message || "Offre introuvable"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Retour aux offres
        </button>

        {/* Carte de l'offre */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Building2 className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{offre.titre}</h1>
              <p className="text-gray-600 font-medium mb-3">{offre.nom_entreprise}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getNiveauColor(offre.niveau)}`}>
                  <Award size={12} />
                  {offre.niveau}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  Début : {formatDate(offre.date_debut)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{offre.description}</p>
        </div>

        {/* Formulaire simplifié */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={24} />
                <h2 className="text-2xl font-bold">Postuler à cette offre</h2>
              </div>
              <p className="text-blue-100 text-sm">Ajoutez votre lettre de motivation pour candidater</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  Lettre de motivation <span className="text-red-500">*</span>
                </div>
              </label>
              
              {!lettreMotivation ? (
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  error 
                    ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
                }`}>
                  <div className="flex flex-col items-center justify-center py-8">
                    <Upload className={error ? 'text-red-500' : 'text-blue-500'} size={48} />
                    <p className="mt-4 text-base text-gray-700 font-semibold">
                      Cliquez pour télécharger votre lettre de motivation
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Formats acceptés : PDF, DOC, DOCX</p>
                    <p className="text-xs text-gray-400 mt-1">Taille maximale : 5 MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-5 bg-green-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                      <FileText className="text-green-600" size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{lettreMotivation.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{formatFileSize(lettreMotivation.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                  >
                    <X className="text-gray-500 group-hover:text-red-600" size={22} />
                  </button>
                </div>
              )}
              
              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Champ obligatoire
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loadingSubmit || !lettreMotivation}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
              >
                {loadingSubmit ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Envoyer ma candidature
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostulerOffre;