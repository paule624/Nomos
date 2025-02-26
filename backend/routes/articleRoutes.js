// routes/articleRoutes.js
const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

// Route pour obtenir tous les utilisateurs
router.get("/", articleController.getArticles);

// Route pour créer un utilisateur
router.post("/", articleController.createArticle);

module.exports = router;
