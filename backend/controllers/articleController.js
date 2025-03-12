// controllers/articleController.js
const articleService = require("../services/articleService");

// Modifiez la fonction createArticle dans votre contrôleur
const createArticle = async (req, res) => {
  try {
    // Ajouter l'ID de l'utilisateur connecté comme auteur
    const articleData = {
      ...req.body,
      author_id: req.user.id,
    };

    const article = await articleService.createArticle(articleData);
    res.status(201).json(article);
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

const getArticleById = async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await articleService.updateArticle(
      req.params.id,
      req.body
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticlesByCategory = async (req, res) => {
  try {
    const articles = await articleService.getArticlesByCategory(
      req.params.categoryId
    );
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const deleted = await articleService.deleteArticle(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update your module.exports to include the new function
module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  getArticlesByCategory,
  deleteArticle,
};
