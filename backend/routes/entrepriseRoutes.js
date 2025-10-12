import express from "express";
import {
  createEntreprise,
  getAllEntreprises,
  getEntrepriseById,
  updateEntreprise,
  deleteEntreprise,
} from "../controllers/entrepriseController.js";

const router = express.Router();

// Middleware pour logger les requêtes
router.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`, req.body);
  next();
});

// Routes pour les entreprises
router.post("/", createEntreprise);           // POST /api/entreprises - Créer une entreprise
router.get("/", getAllEntreprises);           // GET /api/entreprises - Récupérer toutes les entreprises
router.get("/:id", getEntrepriseById);        // GET /api/entreprises/:id - Récupérer une entreprise par ID
router.put("/:id", updateEntreprise);         // PUT /api/entreprises/:id - Mettre à jour une entreprise
router.delete("/:id", deleteEntreprise);      // DELETE /api/entreprises/:id - Supprimer une entreprise

// Route de test pour vérifier que l'API fonctionne
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Entreprises fonctionne correctement",
    timestamp: new Date().toISOString()
  });
});

export default router;

