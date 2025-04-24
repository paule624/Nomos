// routes/recommendationRoutes.js
const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");

// Route pour obtenir toutes les recommendations
router.get("/", recommendationController.getRecommendations);

// Route pour créer une recommendation
router.post("/", recommendationController.createRecommendation);

// Route pour supprimer une recommendation
router.delete("/:id", recommendationController.deleteRecommendation);

module.exports = router;
