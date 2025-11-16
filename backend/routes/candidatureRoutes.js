import express from "express";
import {
  ajouterCandidature,
  getAllCandidatures,
  getCandidaturesByCandidat,
  deleteCandidature
} from "../controllers/candidatureController.js";
import { uploadLettreMotivation } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ajouter une candidature
router.post("/", authMiddleware, uploadLettreMotivation, ajouterCandidature);

// ✅ CORRECTION : id_candidat au lieu de :id_candidat pour matcher le controller
router.get("/candidat/:id_candidat", authMiddleware, getCandidaturesByCandidat);

// Supprimer une candidature
router.delete("/:id", authMiddleware, deleteCandidature);

// Obtenir toutes les candidatures (admin)
router.get("/", authMiddleware, getAllCandidatures);

export default router;