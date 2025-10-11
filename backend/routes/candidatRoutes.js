import express from "express";
import { loginCandidat, registerCandidat } from "../controllers/candidatController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/login", loginCandidat);
router.post("/register", upload.single('cv'), registerCandidat);

export default router;
