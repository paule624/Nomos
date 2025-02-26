// routes/recommendationRoutes.js
const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");

// Route pour obtenir tous les utilisateurs
router.get("/", recommendationController.getRecommendations);

// Route pour créer un utilisateur
router.post("/", recommendationController.createRecommendation);

module.exports = router;
