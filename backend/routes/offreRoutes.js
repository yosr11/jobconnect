import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  ajouterOffre,
  modifierOffre,
  supprimerOffre,
  getAllOffres,
  getOffreById,
  getOffresValides,
  getOffresRecruteur
} from "../controllers/offreController.js";
import Offre from "../models/offre.js"; // ← c'est indispensable !


const router = express.Router();
// Routes spécifiques pour recruteur
router.get("/mes-offres", authMiddleware, getOffresRecruteur);
// Recruteur : opérations protégées
router.post("/add", authMiddleware, ajouterOffre);
router.put("/update/:id", authMiddleware, modifierOffre);
router.delete("/delete/:id", authMiddleware, supprimerOffre);

// Public (candidats)
router.get("/filtrer/valides", getOffresValides);
router.get("/", getAllOffres);
router.get("/:id", getOffreById);

export default router;
