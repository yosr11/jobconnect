import Offre from "../models/offre.js";

// ➕ Ajouter une offre
export const ajouterOffre = async (req, res) => {
  try {
    const offre = new Offre(req.body);
    await offre.save();
    res.status(201).json({ message: "Offre ajoutée avec succès", offre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Modifier une offre
export const modifierOffre = async (req, res) => {
  try {
    const offre = await Offre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offre) return res.status(404).json({ message: "Offre non trouvée" });
    res.json({ message: "Offre mise à jour avec succès", offre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Supprimer une offre
export const supprimerOffre = async (req, res) => {
  try {
    const offre = await Offre.findByIdAndDelete(req.params.id);
    if (!offre) return res.status(404).json({ message: "Offre non trouvée" });
    res.json({ message: "Offre supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👀 Consulter toutes les offres
export const getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.find().sort({ createdAt: -1 });

    res.json(offres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Consulter une offre spécifique
export const getOffreById = async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id);
    if (!offre) return res.status(404).json({ message: "Offre non trouvée" });
    res.json(offre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📅 Consulter les offres valides (avant la deadline)
export const getOffresValides = async (req, res) => {
  try {
    const today = new Date();
    const offres = await Offre.find({ date_limite: { $gte: today } });
    res.json(offres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
