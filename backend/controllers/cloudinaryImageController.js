// controllers/cloudinaryImageController.js
const cloudinaryImageService = require("../services/cloudinaryImageService");

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

module.exports = {
  createCloudinaryImage,
  getCloudinaryImages,
};
