// controllers/articleController.js
const articleService = require("../services/articleService");

const createArticle = async (req, res) => {
  try {
    const article = await articleService.createArticle(req.body);
    res.status(201).json(article); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticles = async (req, res) => {
  try {
    const articles = await articleService.getAllArticles();
    res.status(200).json(articles); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createArticle,
  getArticles,
};
