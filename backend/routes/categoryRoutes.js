// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Route pour obtenir tous les utilisateurs
router.get("/", categoryController.getCategorys);

// Route pour créer un utilisateur
router.post("/", categoryController.createCategory);

module.exports = router;
