import express from "express";
import {
  loginCandidat,
  registerCandidat,
  getCandidat,
  updateCandidat
} from "../controllers/candidatController.js";
import upload from "../config/multer.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // ✅ si tu veux protéger les routes

const router = express.Router();

// Authentification
router.post("/login", loginCandidat);
router.post("/register", upload.single('cv'), registerCandidat);

// Dashboard Candidat
router.get("/:id", authMiddleware, getCandidat);
router.put("/:id", authMiddleware, upload.single('cv'), updateCandidat);

export default router;
