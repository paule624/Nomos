const { Article, User, Category, CloudinaryImage } = require("../models");
const { slugify } = require("../utils/stringUtils");

const createArticle = async (articleData) => {
  try {
    const { title, content, author_id, category_id, image_id, status } =
      articleData;

    // Generate slug from title
    const slug = slugify(title);

    const article = await Article.create({
      title,
      content,
      slug,
      author_id,
      category_id,
      image_id,
      status: status || "draft",
    });

    return article;
  } catch (error) {
    throw new Error(`Error creating article: ${error.message}`);
  }
};

const getAllArticles = async () => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "first_name", "last_name"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: CloudinaryImage,
          as: "image",
          attributes: ["id", "image_url"],
        },
      ],
    });

    return articles;
  } catch (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }
};

const getArticleById = async (id) => {
  try {
    const article = await Article.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "first_name", "last_name"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: CloudinaryImage,
          as: "image",
          attributes: ["id", "image_url"],
        },
      ],
    });

    if (article) {
      // Incrémenter le compteur de vues
      article.view_count += 1;
      await article.save();
    }

    return article;
  } catch (error) {
    throw new Error(`Error fetching article: ${error.message}`);
  }
};

const updateArticle = async (id, articleData) => {
  try {
    const article = await Article.findByPk(id);

    if (!article) {
      return null;
    }

    const { title, content, category_id, image_id, status } = articleData;

    // Préparer les mises à jour
    const updates = {
      title: title || article.title,
      content: content || article.content,
      category_id: category_id || article.category_id,
      image_id: image_id || article.image_id,
      status: status || article.status,
    };

    // Si le titre change, mettre à jour le slug
    if (title && title !== article.title) {
      updates.slug = slugify(title);
    }

    await article.update(updates);

    return article;
  } catch (error) {
    throw new Error(`Error updating article: ${error.message}`);
  }
};

const getArticlesByCategory = async (categoryId) => {
  try {
    const articles = await Article.findAll({
      where: { category_id: categoryId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "first_name", "last_name"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: CloudinaryImage,
          as: "image",
          attributes: ["id", "image_url"],
        },
      ],
    });

    return articles;
  } catch (error) {
    throw new Error(`Error fetching articles by category: ${error.message}`);
  }
};

const deleteArticle = async (id) => {
  try {
    const article = await Article.findByPk(id);

    if (!article) {
      return false;
    }

    await article.destroy();
    return true;
  } catch (error) {
    throw new Error(`Error deleting article: ${error.message}`);
  }
};

// Update your module.exports to include the new function
module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  getArticlesByCategory,
  deleteArticle, // Add this line
};
