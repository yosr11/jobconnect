import Admin from "../models/admin.js"; // ✅ le modèle commence par une majuscule
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Candidat from "../models/candidat.js";
import Recruteur from "../models/recruteur.js";
import Offre from "../models/offre.js";
import Notification from "../models/Notification.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Vérifie si l'admin existe
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // 🔥 Génération du token (le mettre ici)
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,  // 🔥 renvoyé au frontend
      admin: {
        id: admin._id,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// 🔹 CANDIDATS
export const getCandidats = async (req, res) => {
  const candidats = await Candidat.find();
  res.json(candidats);
};

export const acceptCandidat = async (req, res) => {
  await Candidat.findByIdAndUpdate(req.params.id, { etat: "accepted" });
  res.json({ message: "Candidat accepté !" });
};

export const rejectCandidat = async (req, res) => {
  await Candidat.findByIdAndUpdate(req.params.id, { etat: "rejected" });
  res.json({ message: "Candidat rejeté !" });
};

// 🔹 RECRUTEURS
export const getRecruteurs = async (req, res) => {
  const recruteurs = await Recruteur.find().populate("entreprise");
  res.json(recruteurs);
};

export const acceptRecruteur = async (req, res) => {
  await Recruteur.findByIdAndUpdate(req.params.id, { etat: "accepted" });
  res.json({ message: "Recruteur accepté !" });
};

export const rejectRecruteur = async (req, res) => {
  await Recruteur.findByIdAndUpdate(req.params.id, { etat: "rejected" });
  res.json({ message: "Recruteur rejeté !" });
};

// 🔹 OFFRES
export const getPendingOffers = async (req, res) => {
  const offres = await Offre.find({ etat: "pending" }).populate("recruteur");
  res.json(offres);
};

export const validateOffer = async (req, res) => {
  await Offre.findByIdAndUpdate(req.params.id, { etat: "active" });
  res.json({ message: "Offre validée !" });
};

export const rejectOffer = async (req, res) => {
  await Offre.findByIdAndUpdate(req.params.id, { etat: "rejected" });
  res.json({ message: "Offre rejetée !" });
};

export const deleteOffer = async (req, res) => {
  await Offre.findByIdAndDelete(req.params.id);
  res.json({ message: "Offre supprimée !" });
};

// 🔹 STATISTIQUES
export const getStats = async (req, res) => {
  const candidats = await Candidat.countDocuments();
  const recruteurs = await Recruteur.countDocuments();
  const offres = await Offre.countDocuments({ etat: "active" });

  res.json({
    totalCandidats: candidats,
    totalRecruteurs: recruteurs,
    offresActives: offres,
  });
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
// admin registration is intentionally disabled; admin is initialized automatically
