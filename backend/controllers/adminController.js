import Admin from "../models/admin.js"; // ✅ le modèle commence par une majuscule
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // ✅ Correction : variable du modèle doit être en majuscule
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérification mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }


    res.status(200).json({
      message: "Connexion réussie",
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

// admin registration is intentionally disabled; admin is initialized automatically
