// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reactionController");

// Route pour obtenir toutes les actions
router.get("/", reactionController.getReactions);

// Route pour créer une action
router.post("/", reactionController.createReaction);

module.exports = router;
