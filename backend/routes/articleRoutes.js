// routes/articleRoutes.js
const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const {
  authenticateToken,
  isAdmin,
  isAuthorOrAdmin,
} = require("../middlewares/authMiddleware");

// Routes publiques (accessibles sans authentification)
router.get("/", articleController.getArticles);
router.get("/category/:categoryId", articleController.getArticlesByCategory);
router.get("/:id", articleController.getArticleById);

router.post("/", authenticateToken, articleController.createArticle);
router.put(
  "/:id",
  authenticateToken,
  isAuthorOrAdmin,
  articleController.updateArticle
);
router.delete(
  "/:id",
  authenticateToken,
  isAuthorOrAdmin,
  articleController.deleteArticle
);

module.exports = router;
