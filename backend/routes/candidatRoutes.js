import express from "express";
import { loginCandidat, registerCandidat } from "../controllers/candidatController.js";

const router = express.Router();


router.post("/login", loginCandidat);
router.post("/register", registerCandidat);

export default router;
