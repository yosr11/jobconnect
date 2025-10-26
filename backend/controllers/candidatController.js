import Candidat from "../models/candidat.js"; // ✅ le modèle commence par une majuscule
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
export const loginCandidat = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // ✅ Correction : variable du modèle doit être en majuscule
    const candidat = await Candidat.findOne({ email });

    if (!candidat) {
      return res.status(404).json({ message: "candidat non trouvé" });
    }

    // Vérification du mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(mot_de_passe, candidat.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    // 🔹 Générer le token
    const token = jwt.sign(
      { id: candidat._id, role: candidat.role, email: candidat.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );



    res.status(200).json({
      message: "Connexion réussie",
      token, // <-- ici le token
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
    //console.log("📝 Corps de la requête:", req.body);
    //console.log("📎 Fichier uploadé:", req.file);
    const {
      nom,
      prenom,
      email,
      num_tel,
      mot_de_passe,
      confirmer_mot_de_passe,
      date_naissance,
      competences,
      adresse,
    } = req.body;

    // Validation des champs requis
    if (!nom || !prenom || !email || !num_tel || !mot_de_passe || !confirmer_mot_de_passe) {
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
    const existing = await Candidat.findOne({ email });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: "Un compte avec cet email existe déjà" 
      });
    }

// Récupérer seulement le chemin relatif depuis 'uploads/'
const cvPath = req.file ? path.join('uploads/cv', req.file.filename) : null;

    // Hasher les mots de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
    const hashedConfirm = await bcrypt.hash(confirmer_mot_de_passe, salt);

    // Créer le candidat
    const candidat = await Candidat.create({
      nom,
      prenom,
      email,
      num_tel,
      mot_de_passe: hashedPassword,
      confirmer_mot_de_passe: hashedConfirm,
      date_naissance,
      cv: cvPath,
      competences,
      adresse,
    });

    // Générer le token JWT
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
        prenom: candidat.prenom,
        email: candidat.email,
        role: candidat.role,
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
// ✅ Récupérer le profil d'un candidat
export const getCandidat = async (req, res) => {
  try {
    const candidat = await Candidat.findById(req.params.id).select('-mot_de_passe -confirmer_mot_de_passe');
    if (!candidat) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }
    res.status(200).json(candidat);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Mettre à jour le profil du candidat


export const updateCandidat = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Hasher le mot de passe si présent
    if (updates.mot_de_passe) {
      const salt = await bcrypt.genSalt(10);
      updates.mot_de_passe = await bcrypt.hash(updates.mot_de_passe, salt);
    } else {
      delete updates.mot_de_passe; // pour ne pas écraser si vide
    }

    // Si un fichier CV a été uploadé
    if (req.file) {
        updates.cv = path.join('uploads/cv', req.file.filename);
    }


    const updatedCandidat = await Candidat.findByIdAndUpdate(id, updates, { new: true })
      .select('-mot_de_passe -confirmer_mot_de_passe');

    if (!updatedCandidat) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      candidat: updatedCandidat,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
