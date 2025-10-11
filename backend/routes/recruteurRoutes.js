import express from "express";
import { loginRecruteur, registerRecruteur } from "../controllers/recruteurController.js";

const router = express.Router();


router.post("/login", loginRecruteur);
router.post("/register", registerRecruteur);

export default router;
