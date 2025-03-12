// services/categoryService.js
const Category = require("../models/category");

const createCategory = async (data) => {
  try {
    const category = await Category.create(data);
    return category;
  } catch (error) {
    throw new Error("Error creating category: " + error.message);
  }
};

const getAllCategorys = async () => {
  try {
    const categorys = await Category.findAll();
    return categorys;
  } catch (error) {
    throw new Error("Error fetching categorys: " + error.message);
  }
};

const updateCategory = async (id, data) => {
  try {
    // Récupère la catégorie par l'ID
    const category = await Category.findByPk(id);
    console.log("Catégorie trouvée :", category); // Log de la catégorie trouvée

    if (!category) return null;

    // Mise à jour de la catégorie
    await category.update(data);
    return category;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour de la catégorie : " + error.message);
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await Category.findByPk(id);
    if (!category) return null;
    
    await category.destroy();
    return true;
  } catch (error) {
    throw new Error("Erreur lors de la suppression de la catégorie : " + error.message);
  }
};

module.exports = {
  createCategory,
  getAllCategorys,
  deleteCategory,
  updateCategory
};
