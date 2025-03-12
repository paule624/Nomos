const categoryService = require("../services/categoryService");

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategorys = async (req, res) => {
  try {
    const categorys = await categoryService.getAllCategorys();
    res.status(200).json(categorys); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const putCategory = async (req, res) => {
  try {
    const categoryId = req.params.id; // ID passé dans l'URL
    console.log("ID de la catégorie reçu :", categoryId); // Log de l'ID pour vérifier

    const updatedCategory = await categoryService.updateCategory(categoryId, req.body);
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée avec cet ID." });
    }

    res.status(200).json(updatedCategory); // Retourner la catégorie mise à jour
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id; // Récupère l'ID depuis les paramètres
    const deletedCategory = await categoryService.deleteCategory(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategorys,
  putCategory,
  deleteCategory,
};
