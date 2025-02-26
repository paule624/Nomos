// services/ArticleService.js
const Article = require("../models/article");

const createArticle = async (data) => {
  try {
    const article = await User.create(data);
    return user;
  } catch (error) {
    throw new Error("Error creating article: " + error.message);
  }
};

const getAllArticles = async () => {
  try {
    const articles = await Article.findAll();
    return Articles;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

module.exports = {
  createArticle,
  getAllArticles,
};
