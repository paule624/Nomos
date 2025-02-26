// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route pour obtenir tous les utilisateurs
router.get("/", userController.getUsers);

// Route pour créer un utilisateur
router.post("/", userController.createUser);

module.exports = router;
