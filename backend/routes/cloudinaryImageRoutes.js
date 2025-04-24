// routes/cloudinaryImageRoutes.js
const express = require("express");
const router = express.Router();
const cloudinaryImageController = require("../controllers/cloudinaryImageController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route pour télécharger une image
router.post(
  "/upload",
  upload.single("image"),
  cloudinaryImageController.uploadImage
);

// Route pour obtenir toutes les images
router.get("/", cloudinaryImageController.getCloudinaryImages);

// Route pour créer une référence d'image manuellement
router.post("/create", cloudinaryImageController.createCloudinaryImage);

// Route pour supprimer une image
router.delete("/:id", cloudinaryImageController.deleteCloudinaryImage);

module.exports = router;
