import Candidature from "../models/candidature.js";
import Offre from "../models/offre.js";
import Candidat from "../models/candidat.js";

// ➕ Ajouter une candidature (postuler)
export const ajouterCandidature = async (req, res) => {
  try {
    const { id_offre, id_candidat, score } = req.body;

    // Vérifier si l'offre et le candidat existent
    const offre = await Offre.findById(id_offre);
    const candidat = await Candidat.findById(id_candidat);

    if (!offre) return res.status(404).json({ message: "Offre non trouvée" });
    if (!candidat) return res.status(404).json({ message: "Candidat non trouvé" });

    // Vérifier si le candidat a déjà postulé à cette offre
    const existe = await Candidature.findOne({ id_offre, id_candidat });
    if (existe)
      return res.status(400).json({ message: "Candidature déjà existante pour cette offre" });

    // Créer la candidature
    const candidature = new Candidature({
      id_offre,
      id_candidat,
      score: score || 0,
      date_postulation: new Date(),
      etat: "en attente",
    });

    await candidature.save();

    res.status(201).json({
      message: "Candidature ajoutée avec succès",
      candidature,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔍 Obtenir toutes les candidatures
export const getAllCandidatures = async (req, res) => {
  try {
    const candidatures = await Candidature.find()
      .populate("id_offre", "titre description")
      .populate("id_candidat", "nom prenom email");

    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔍 Obtenir les candidatures d’un candidat spécifique
export const getCandidaturesByCandidat = async (req, res) => {
  try {
    const { id_candidat } = req.params;
    const candidatures = await Candidature.find({ id_candidat })
      .populate("id_offre", "titre description");

    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✏️ Mettre à jour l’état d’une candidature (par admin ou recruteur)
export const updateEtatCandidature = async (req, res) => {
  try {
    const { id } = req.params;
    const { etat } = req.body;

    const candidature = await Candidature.findByIdAndUpdate(
      id,
      { etat },
      { new: true }
    );

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.status(200).json({
      message: "État de la candidature mis à jour avec succès",
      candidature,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
