import jwt from "jsonwebtoken";

// ✅ Middleware pour vérifier le token JWT
export const authMiddleware = (req, res, next) => {
  try {
    // Récupère le token depuis les headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Accès non autorisé : token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

    // Stocke les infos du user dans req.user
    req.user = decoded;

    next(); // continuer vers la route suivante
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export default authMiddleware;
