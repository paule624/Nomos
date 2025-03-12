// controllers/cloudinaryImageController.js
const cloudinaryImageService = require("../services/cloudinaryImageService");
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    // Appelle le service pour uploader l'image
    const cloudinaryImage = await cloudinaryImageService.createCloudinaryImage(req.file);

    res.status(201).json(cloudinaryImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCloudinaryImage = async (req, res) => {
  try {
    const cloudinaryImage = await userService.createCloudinaryImage(req.body);
    res.status(201).json(cloudinaryImage); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCloudinaryImages = async (req, res) => {
  try {
    const cloudinaryImages =
      await cloudinaryImageService.getAllCloudinaryImages();
    res.status(200).json(cloudinaryImages); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCloudinaryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await cloudinaryImageService.deleteCloudinaryImage(id);
    if (!success) {
      return res.status(404).json({ message: "Image non trouvée" });
    }
    res.status(200).json({ message: "Image supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createCloudinaryImage,
  getCloudinaryImages,
  deleteCloudinaryImage,
  uploadImage
};
