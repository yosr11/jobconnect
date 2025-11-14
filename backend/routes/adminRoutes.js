import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";
import {
loginAdmin ,
  getCandidats,
  acceptCandidat,
  rejectCandidat,
  getRecruteurs,
  acceptRecruteur,
  rejectRecruteur,
  getPendingOffers,
  validateOffer,
  rejectOffer,
  deleteOffer,
  getStats
} from "../controllers/adminController.js";
import { getNotifications } from "../controllers/adminController.js";

const router = express.Router();


router.post("/login", loginAdmin);
// Candidats
router.get("/candidats", authMiddleware, isAdmin, getCandidats);
router.put("/candidats/:id/accept", authMiddleware, isAdmin, acceptCandidat);
router.put("/candidats/:id/reject", authMiddleware, isAdmin, rejectCandidat);

// Recruteurs
router.get("/recruteurs", authMiddleware, isAdmin, getRecruteurs);
router.put("/recruteurs/:id/accept", authMiddleware, isAdmin, acceptRecruteur);
router.put("/recruteurs/:id/reject", authMiddleware, isAdmin, rejectRecruteur);

// Offres
router.get("/offres", authMiddleware, isAdmin, getPendingOffers);
router.put("/offres/:id/validate", authMiddleware, isAdmin, validateOffer);
router.put("/offres/:id/reject", authMiddleware, isAdmin, rejectOffer);
router.delete("/offres/:id/delete", authMiddleware, isAdmin, deleteOffer);

// Statistiques
router.get("/stats", authMiddleware, isAdmin, getStats);

router.get("/notifications", authMiddleware, isAdmin, getNotifications);

export default router;
