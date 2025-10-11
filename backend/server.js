import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import candidatRoutes from "./routes/candidatRoutes.js";
import recruteurRoutes from "./routes/recruteurRoutes.js";
import { initializeDefaultAdmin } from "./initAdmin.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connexion MongoDB
connectDB();
initializeDefaultAdmin().catch((e) => console.error(e));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/candidat", candidatRoutes);
app.use("/api/recruteur", recruteurRoutes);

app.get("/", (req, res) => res.send("API Recrutement intelligente fonctionne !"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
