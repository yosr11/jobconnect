import Entreprise from "../models/entreprise.js";
import fs from 'fs';
import path from 'path';

// Fonction helper pour supprimer un fichier
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Créer une nouvelle entreprise
export const createEntreprise = async (req, res) => {
  try {
    const { nom, adresse, secteur, site_web, description } = req.body;
    const logo = req.file ? `/uploads/logos/${req.file.filename}` : null;

    console.log("🔄 Tentative de création d'entreprise:", { nom, adresse, secteur, site_web, description, logo });

    // Validation des champs requis
    if (!nom || nom.trim() === "") {
      // Supprimer le fichier uploadé si validation échoue
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Le nom de l'entreprise est obligatoire"
      });
    }

    // Validation de la longueur du nom
    if (nom.trim().length < 2) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Le nom de l'entreprise doit contenir au moins 2 caractères"
      });
    }

    if (nom.trim().length > 100) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Le nom de l'entreprise ne peut pas dépasser 100 caractères"
      });
    }

    // Vérifier si l'entreprise existe déjà
    const existingEntreprise = await Entreprise.findOne({ nom: nom.trim() });
    if (existingEntreprise) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Une entreprise avec ce nom existe déjà"
      });
    }

    // Validation optionnelle du site web
    if (site_web && site_web.trim() !== "") {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(site_web.trim())) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Format d'URL invalide (doit commencer par http:// ou https://)"
        });
      }
    }

    // Créer l'entreprise
    const entreprise = await Entreprise.create({
      nom: nom.trim(),
      adresse: adresse?.trim() || "",
      secteur: secteur?.trim() || "",
      site_web: site_web?.trim() || "",
      description: description?.trim() || "",
      logo:  req.file ? `uploads/logos/${req.file.filename}` : null,
    });

    console.log("✅ Entreprise créée avec succès:", entreprise);
    
    // Réponse avec l'entreprise créée
    return res.status(201).json({
      success: true,
      message: "Entreprise créée avec succès",
      entreprise: {
        id: entreprise._id,
        _id: entreprise._id,
        nom: entreprise.nom,
        adresse: entreprise.adresse,
        secteur: entreprise.secteur,
        site_web: entreprise.site_web,
        description: entreprise.description,
        logo: entreprise.logo,
        date_creation: entreprise.date_creation,
        createdAt: entreprise.createdAt,
        updatedAt: entreprise.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'entreprise:", error);
    
    // Supprimer le fichier en cas d'erreur
    if (req.file) deleteFile(req.file.path);
    
    // Gestion des erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: validationErrors
      });
    }

    // Gestion des erreurs de duplication
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Une entreprise avec ce nom existe déjà"
      });
    }

    // Erreur serveur générique
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de l'entreprise",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
    });
  }
};

// Récupérer toutes les entreprises
export const getAllEntreprises = async (req, res) => {
  try {
    const entreprises = await Entreprise.find({})
      .select('_id nom adresse secteur site_web description logo date_creation')
      .sort({ nom: 1 }); // Trier par nom alphabétiquement

    console.log("✅ Entreprises récupérées:", entreprises.length, "entreprises");
    return res.status(200).json({
      success: true,
      message: "Entreprises récupérées avec succès",
      entreprises: entreprises.map(entreprise => ({
        id: entreprise._id,
        _id: entreprise._id,
        nom: entreprise.nom,
        adresse: entreprise.adresse,
        secteur: entreprise.secteur,
        site_web: entreprise.site_web,
        description: entreprise.description,
        logo: entreprise.logo,
        date_creation: entreprise.date_creation,
      })),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des entreprises:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des entreprises",
      error: error.message,
    });
  }
};

// Récupérer une entreprise par ID
export const getEntrepriseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de l'entreprise requis"
      });
    }

    const entreprise = await Entreprise.findById(id)
      .select('_id nom adresse secteur site_web description logo date_creation');

    if (!entreprise) {
      return res.status(404).json({
        success: false,
        message: "Entreprise non trouvée"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Entreprise récupérée avec succès",
      entreprise,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'entreprise:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de l'entreprise",
      error: error.message,
    });
  }
};

// Mettre à jour une entreprise
export const updateEntreprise = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, adresse, secteur, site_web, description } = req.body;
    const newLogo = req.file ? `/uploads/logos/${req.file.filename}` : null;

    if (!id) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: "ID de l'entreprise requis"
      });
    }

    const entreprise = await Entreprise.findById(id);
    if (!entreprise) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Entreprise non trouvée"
      });
    }

    // Vérifier si le nouveau nom existe déjà (si différent de l'actuel)
    if (nom && nom.trim() !== entreprise.nom) {
      const existingEntreprise = await Entreprise.findOne({ nom: nom.trim() });
      if (existingEntreprise) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Une entreprise avec ce nom existe déjà"
        });
      }
    }

    // Si un nouveau logo est uploadé, supprimer l'ancien
    if (newLogo && entreprise.logo) {
      const oldLogoPath = path.join('.', entreprise.logo);
      deleteFile(oldLogoPath);
    }

    // Mettre à jour l'entreprise
    const updatedEntreprise = await Entreprise.findByIdAndUpdate(
      id,
      {
        nom: nom?.trim() || entreprise.nom,
        adresse: adresse?.trim() || entreprise.adresse,
        secteur: secteur?.trim() || entreprise.secteur,
        site_web: site_web?.trim() || entreprise.site_web,
        description: description?.trim() || entreprise.description,
        logo: newLogo || entreprise.logo,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Entreprise mise à jour avec succès",
      entreprise: {
        id: updatedEntreprise._id,
        nom: updatedEntreprise.nom,
        adresse: updatedEntreprise.adresse,
        secteur: updatedEntreprise.secteur,
        site_web: updatedEntreprise.site_web,
        description: updatedEntreprise.description,
        logo: updatedEntreprise.logo,
        date_creation: updatedEntreprise.date_creation,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise:", error);
    if (req.file) deleteFile(req.file.path);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de l'entreprise",
      error: error.message,
    });
  }
};

// Supprimer une entreprise
export const deleteEntreprise = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de l'entreprise requis"
      });
    }

    const entreprise = await Entreprise.findById(id);
    if (!entreprise) {
      return res.status(404).json({
        success: false,
        message: "Entreprise non trouvée"
      });
    }

    // Supprimer le logo s'il existe
    if (entreprise.logo) {
      const logoPath = path.join('.', entreprise.logo);
      deleteFile(logoPath);
    }

    await Entreprise.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Entreprise supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entreprise:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression de l'entreprise",
      error: error.message,
    });
  }
};
