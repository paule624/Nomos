// services/userService.js
const CloudinaryImage = require("../models/cloudinaryImage");

const createCloudinaryImage = async (data) => {
  try {
    const cloudinaryImage = await CloudinaryImage.create(data);
    return cloudinaryImage;
  } catch (error) {
    throw new Error("Error creating cloudinaryImage: " + error.message);
  }
};

const getAllCloudinaryImages = async () => {
  try {
    const cloudinaryImages = await CloudinaryImage.findAll();
    return cloudinaryImages;
  } catch (error) {
    throw new Error("Error fetching cloudinaryImages: " + error.message);
  }
};

module.exports = {
  createCloudinaryImage,
  getAllCloudinaryImages,
};
