const cloudinary = require("../config/cloudinary");
const CloudinaryImage = require("../models/cloudinaryImage");

/**
 * Upload une image sur Cloudinary à partir d'un buffer
 * @param {Buffer} buffer - Image en mémoire
 * @returns {Promise<Object>} - Résultat de l'upload Cloudinary
 */
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "articles_images" }, // 📂 Dossier Cloudinary (modifiable)
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Upload une image sur Cloudinary et l'enregistre en base de données
 * @param {Object} file - Fichier reçu via Multer
 * @returns {Promise<Object>} - Image enregistrée en BDD
 */
const createCloudinaryImage = async (file) => {
  try {
    if (!file) throw new Error("Aucun fichier reçu");

    // Upload sur Cloudinary
    const uploadResult = await uploadToCloudinary(file.buffer);

    // Vérifie que uploadResult contient un public_id
    console.log(uploadResult); // Log du résultat de l'upload
    if (!uploadResult.public_id) {
      throw new Error("Public ID est manquant dans la réponse de Cloudinary");
    }

    // Enregistrement en base de données
    const cloudinaryImage = await CloudinaryImage.create({
      image_url: uploadResult.secure_url,
      public_id: uploadResult.public_id, // 🔑 Permet de supprimer l’image plus tard
      image_type: "article", // Peut être dynamique selon le contexte
    });

    return cloudinaryImage;
  } catch (error) {
    throw new Error("Erreur lors de l'upload : " + error.message);
  }
};

/**
 * Récupère toutes les images stockées en base de données
 * @returns {Promise<Array>} - Liste des images
 */
const getAllCloudinaryImages = async () => {
  try {
    return await CloudinaryImage.findAll();
  } catch (error) {
    throw new Error("Erreur lors de la récupération des images : " + error.message);
  }
};

/**
 * Supprime une image de Cloudinary et de la base de données
 * @param {string} id - ID de l'image en base de données
 * @returns {Promise<boolean>} - `true` si la suppression a réussi
 */
const deleteCloudinaryImage = async (id) => {
  try {
    // Recherche l'image en BDD
    const cloudinaryImage = await CloudinaryImage.findByPk(id);
    if (!cloudinaryImage) {
      throw new Error("Image non trouvée");
    }

    // Suppression sur Cloudinary
    await cloudinary.uploader.destroy(cloudinaryImage.public_id);

    // Suppression en base de données
    await cloudinaryImage.destroy();

    return true;
  } catch (error) {
    throw new Error("Erreur lors de la suppression de l'image : " + error.message);
  }
};

module.exports = {
  createCloudinaryImage,
  getAllCloudinaryImages,
  deleteCloudinaryImage
};
