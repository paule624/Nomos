// routes/reactionRoutes.js
const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reactionController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Appliquer l'authentification à toutes les routes individuellement
router.get("/", authenticateToken, reactionController.getReactions);
router.post("/", authenticateToken, reactionController.createReaction);
router.delete("/:id", authenticateToken, reactionController.deleteReaction);

module.exports = router;
