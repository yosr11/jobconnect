import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  ajouterOffre,
  modifierOffre,
  supprimerOffre,
  getAllOffres,
  getOffreById,
  getOffresValides
} from "../controllers/offreController.js";

const router = express.Router();

// Routes protégées (recruteur)
router.post("/add", authMiddleware, ajouterOffre);
router.put("/update/:id", authMiddleware, modifierOffre);
router.delete("/delete/:id", authMiddleware, supprimerOffre);

// Routes publiques (candidats)
router.get("/filtrer/valides", getOffresValides);
router.get("/", getAllOffres);
router.get("/:id", getOffreById);


export default router;
