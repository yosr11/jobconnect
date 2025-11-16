import Offre from "../models/offre.js";
//import Notification from "../models/Notification.js";

// ➕ Ajouter une offre (Recruteur)
export const ajouterOffre = async (req, res) => {
  try {
    // ⚡ Récupérer l'entrepriseId depuis le JWT (pas du body !)
    const entrepriseId = req.user.entrepriseId;

    console.log("🏢 EntrepriseId du recruteur:", entrepriseId);

    if (!entrepriseId) {
      return res.status(400).json({ message: "Aucune entreprise associée à ce recruteur" });
    }

    // ⚡ Créer l'offre avec l'entrepriseId du recruteur connecté
    const offre = new Offre({
      ...req.body,
      entrepriseId  // ← Toujours prendre l'ID depuis le JWT, pas le body !
    });

    await offre.save();

    console.log("✅ Offre créée:", offre);

    res.status(201).json({ 
      message: "Offre ajoutée avec succès", 
      offre 
    });
  } catch (err) {
    console.error("❌ Erreur ajout offre:", err);
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

// 👀 Récupérer toutes les offres pour un recruteur (protéger)
export const getOffresRecruteur = async (req, res) => {
  try {
    const recruteurEntrepriseId = req.user.entrepriseId; // défini dans le middleware JWT
    const offres = await Offre.find({ entrepriseId: recruteurEntrepriseId }).sort({ createdAt: -1 });
    res.json(offres);
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
// Après avoir créé l'offre
//const offre = await Offre.create(req.body);

// Créer une notification pour admin
/*await Notification.create({
  type: "offre",
  message: `Nouvelle offre publiée : ${offre.titre} par ${offre.recruteur}`
});*/

//res.status(201).json({ message: "Offre ajoutée avec succès", offre });