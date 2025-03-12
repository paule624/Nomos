// routes/cloudinaryImageRoutes.js
const express = require("express");
const router = express.Router();
const cloudinaryImageController = require("../controllers/cloudinaryImageController");
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), cloudinaryImageController.uploadImage);

// Route pour obtenir tous les utilisateurs
router.get("/", cloudinaryImageController.getCloudinaryImages);

// Route pour créer un utilisateur
router.post("/", cloudinaryImageController.createCloudinaryImage);

// Route pour supprimer une image
router.delete("/:id", cloudinaryImageController.deleteCloudinaryImage);

module.exports = router;
