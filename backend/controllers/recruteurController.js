import Recruteur from "../models/recruteur.js";
import Entreprise from "../models/entreprise.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginRecruteur = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // ✅ Correction : variable du modèle doit être en majuscule
    const recruteur= await Recruteur.findOne({ email });

    if (!recruteur) {
      return res.status(404).json({ message: "Recruteur non trouvé" });
    }

    // Vérification du mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(mot_de_passe, recruteur.mot_de_passe);
    if (!isPasswordValid) {
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
      entreprise_id,
    } = req.body;

    // Validation des champs requis
    if (!nom || !prenom || !email || !num_tel || !mot_de_passe || !confirmer_mot_de_passe || !entreprise_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Tous les champs obligatoires doivent être remplis" 
      });
    }

    // Validation de l'email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Format d'email invalide" 
      });
    }

    // Validation du numéro de téléphone
    if (!/^\d{8}$/.test(num_tel)) {
      return res.status(400).json({ 
        success: false, 
        message: "Le numéro de téléphone doit contenir exactement 8 chiffres" 
      });
    }

    // Validation des mots de passe
    if (mot_de_passe.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Le mot de passe doit contenir au moins 6 caractères" 
      });
    }

    if (mot_de_passe !== confirmer_mot_de_passe) {
      return res.status(400).json({ 
        success: false, 
        message: "Les mots de passe ne correspondent pas" 
      });
    }

    // Vérifier si l'email existe déjà
    const existing = await Recruteur.findOne({ email });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: "Un compte avec cet email existe déjà" 
      });
    }

    // Vérifier que l'entreprise existe
    const entreprise = await Entreprise.findById(entreprise_id);
    if (!entreprise) {
      return res.status(400).json({ 
        success: false, 
        message: "Entreprise non trouvée" 
      });
    }

    // Hasher les mots de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
    const hashedConfirm = await bcrypt.hash(confirmer_mot_de_passe, salt);

    // Créer le recruteur
    const recruteur = await Recruteur.create({
      nom,
      prenom,
      email,
      num_tel,
      mot_de_passe: hashedPassword,
      confirmer_mot_de_passe: hashedConfirm,
      entreprise: entreprise_id,
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: recruteur._id, role: recruteur.role, email: recruteur.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    console.log("✅ Recruteur créé avec succès:", recruteur.email);
    return res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      token,
      user: {
        id: recruteur._id,
        nom: recruteur.nom,
        prenom: recruteur.prenom,
        email: recruteur.email,
        role: recruteur.role,
        entreprise: {
          id: entreprise._id,
          nom: entreprise.nom,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la création du compte", 
      error: error.message 
    });
  }
};
