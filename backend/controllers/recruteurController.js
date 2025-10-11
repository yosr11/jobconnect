import Recruteur from "../models/recruteur.js"; // ✅ le modèle commence par une majuscule
//import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginRecruteur = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // ✅ Correction : variable du modèle doit être en majuscule
    const recruteur= await Recruteur.findOne({ email });

    if (!recruteur) {
      return res.status(404).json({ message: "Recruteur non trouvé" });
    }

    // Vérification mot de passe en clair
    if (recruteur.mot_de_passe !== mot_de_passe) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }


    res.status(200).json({
      message: "Connexion réussie",
      recruteur: {
        id: recruteur._id,
        nom: recruteur.nom,
        prenom: recruteur.prenom,
        email: recruteur.email,
        role: recruteur.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const registerRecruteur = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      num_tel,
      mot_de_passe,
      confirmer_mot_de_passe,
    } = req.body;

    const existing = await Recruteur.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });
    }

    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
    //const hashedConfirm = await bcrypt.hash(confirmer_mot_de_passe, salt);

    const recruteur = await Recruteur.create({
      nom,
      prenom,
      email,
      num_tel,
      mot_de_passe,
      confirmer_mot_de_passe,
    });

    const token = jwt.sign(
      { id: recruteur._id, role: recruteur.role, email: recruteur.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      token,
      user: {
        id: recruteur._id,
        nom: recruteur.nom,
        email: recruteur.email,
        role: recruteur.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
