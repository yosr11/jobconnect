import express from "express";
import {
  ajouterCandidature,
  getAllCandidatures,
  getCandidaturesByCandidat,
  updateEtatCandidature,
} from "../controllers/candidatureController.js";

const router = express.Router();

router.post("/", ajouterCandidature);
router.get("/", getAllCandidatures);
router.get("/candidat/:id_candidat", getCandidaturesByCandidat);

//router.put("/:id", updateEtatCandidature);

export default router;
