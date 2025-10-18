import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import candidatRoutes from "./routes/candidatRoutes.js";
import recruteurRoutes from "./routes/recruteurRoutes.js";
import entrepriseRoutes from "./routes/entrepriseRoutes.js";
import { initializeDefaultAdmin } from "./initAdmin.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
app.use("/api/entreprises", entrepriseRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => res.send("API Recrutement intelligente fonctionne !"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
