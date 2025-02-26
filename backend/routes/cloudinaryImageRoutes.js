// routes/cloudinaryImageRoutes.js
const express = require("express");
const router = express.Router();
const cloudinaryImageController = require("../controllers/cloudinaryImageController");

// Route pour obtenir tous les utilisateurs
router.get("/", cloudinaryImageController.getCloudinaryImages);

// Route pour créer un utilisateur
router.post("/", cloudinaryImageController.createCloudinaryImage);

module.exports = router;
