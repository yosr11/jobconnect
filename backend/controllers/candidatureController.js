import Candidature from "../models/candidature.js";
import Offre from "../models/offre.js";
import Candidat from "../models/candidat.js";

// ➕ Ajouter une candidature (postuler)
export const ajouterCandidature = async (req, res) => {
  console.log("📥 Body reçu:", req.body);
  console.log("📎 Fichier reçu:", req.file);

  try {
    const { id_offre, id_candidat, score } = req.body;

    // Vérifier si l'offre et le candidat existent
    const offre = await Offre.findById(id_offre);
    const candidat = await Candidat.findById(id_candidat);

    if (!offre) return res.status(404).json({ message: "Offre non trouvée" });
    if (!candidat) return res.status(404).json({ message: "Candidat non trouvé" });

    // Vérifier si candidature existe déjà
    const existe = await Candidature.findOne({ id_offre, id_candidat });
    if (existe)
      return res.status(400).json({ message: "Candidature déjà existante pour cette offre" });

    // Récupérer le chemin du fichier
    const lettre_motivation_fichier = req.file ? req.file.path : null;

    // Créer la candidature
    const candidature = new Candidature({
      id_offre,
      id_candidat,
      score: score || 0,
      date_postulation: new Date(),
      etat: "en attente",
      lettre_motivation_fichier,
    });

    await candidature.save();

    console.log("✅ Candidature créée:", candidature);

    res.status(201).json({
      message: "Candidature ajoutée avec succès",
      candidature,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔍 Obtenir toutes les candidatures
export const getAllCandidatures = async (req, res) => {
  try {
    const candidatures = await Candidature.find()
      .populate("id_candidat", "nom prenom email")  // ✅ Sélectionnez les champs nécessaires
      .populate({
        path: "id_offre",
        select: "titre entrepriseId recruteur",  // ✅ Sélectionnez les champs
        populate: [
          { path: "entrepriseId", select: "nom" },
          { path: "recruteur", select: "nom" }
        ]
      })
      .sort({ createdAt: -1 });  // ✅ Maintenant createdAt existe
    
    res.json(candidatures);
  } catch (error) {
    console.error("❌ Erreur candidatures:", error);  // ✅ Ajoutez un log
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 📋 Récupérer les candidatures d'un candidat spécifique
export const getCandidaturesByCandidat = async (req, res) => {
  try {
    // ✅ CORRECTION ICI : utiliser id_candidat au lieu de candidatId
    const { id_candidat } = req.params;

    console.log("🔍 Recherche des candidatures pour candidat ID:", id_candidat);

    const candidatures = await Candidature.find({ id_candidat })
      .populate("id_offre", "titre nom_entreprise description date_debut niveau")
      .sort({ date_postulation: -1 });

    console.log(`✅ ${candidatures.length} candidature(s) trouvée(s)`);

    res.status(200).json({
      message: "Candidatures du candidat récupérées avec succès",
      count: candidatures.length,
      candidatures,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🗑️ Supprimer une candidature
export const deleteCandidature = async (req, res) => {
  try {
    const { id } = req.params;

    const candidature = await Candidature.findByIdAndDelete(id);

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.status(200).json({
      message: "Candidature supprimée avec succès",
      candidature,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};