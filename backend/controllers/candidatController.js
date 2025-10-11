import Candidat from "../models/candidat.js"; // ✅ le modèle commence par une majuscule
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginCandidat = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // ✅ Correction : variable du modèle doit être en majuscule
    const candidat = await Candidat.findOne({ email });

    if (!candidat) {
      return res.status(404).json({ message: "candidat non trouvé" });
    }

    // Vérification mot de passe en clair
    if (candidat.mot_de_passe !== mot_de_passe) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }


    res.status(200).json({
      message: "Connexion réussie",
      candidat: {
        id: candidat._id,
        nom: candidat.nom,
        prenom: candidat.prenom,
        email: candidat.email,
        role: candidat.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const registerCandidat = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      num_tel,
      mot_de_passe,
      confirmer_mot_de_passe,
      date_naissance,
      cv,
      competences,
      adresse,
    } = req.body;

    const existing = await Candidat.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
    const hashedConfirm = await bcrypt.hash(confirmer_mot_de_passe, salt);

    const candidat = await Candidat.create({
      nom,
      prenom,
      email,
      num_tel,
      mot_de_passe: hashedPassword,
      confirmer_mot_de_passe: hashedConfirm,
      date_naissance,
      cv,
      competences,
      adresse,
    });

    const token = jwt.sign(
      { id: candidat._id, role: candidat.role, email: candidat.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      token,
      user: {
        id: candidat._id,
        nom: candidat.nom,
        email: candidat.email,
        role: candidat.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
