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

module.exports = {
  createCategory,
  getAllCategorys,
};
