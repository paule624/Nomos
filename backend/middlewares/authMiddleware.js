const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Article = require("../models/article");

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Vérifier le token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide ou expiré" });
      }

      // Ajouter les informations de l'utilisateur à la requête
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Accès refusé. Droits administrateur requis." });
  }
};

// Middleware pour vérifier si l'utilisateur est l'auteur ou un admin
const isAuthorOrAdmin = async (req, res, next) => {
  try {
    // Récupérer l'ID de l'article
    const articleId = req.params.id;

    // Si l'utilisateur est admin, autoriser
    if (req.user.role === "admin") {
      return next();
    }

    // Récupérer l'article
    const article = await Article.findByPk(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    // Vérifier si l'utilisateur est l'auteur
    if (article.author_id === req.user.id) {
      return next();
    }

    // Sinon, refuser l'accès
    res
      .status(403)
      .json({
        message: "Accès refusé. Vous n'êtes pas l'auteur de cet article.",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isAuthorOrAdmin,
};
