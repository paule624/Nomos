// controllers/categoryController.js
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

module.exports = {
  createCategory,
  getCategorys,
};
