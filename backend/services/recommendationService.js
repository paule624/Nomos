// services/recommendationService.js
const Recommendation = require("../models/recommendation");
const User = require("../models/user");
const Article = require("../models/article");
const { Op } = require("sequelize");

const createRecommendation = async (data) => {
  try {
    // Vérifier que user_id et article_id sont présents
    if (!data.user_id) {
      throw new Error("user_id is required");
    }

    if (!data.article_id) {
      throw new Error("article_id is required");
    }

    console.log("Données reçues:", data);

    // Convertir user_id en nombre (INTEGER)
    const userId = Number(data.user_id);

    // S'assurer que article_id est bien une chaîne (UUID)
    const articleId = String(data.article_id);

    try {
      // Vérifier si l'utilisateur existe
      const user = await User.findByPk(userId);
      if (!user) {
        console.error(`User with id ${userId} not found`);
        throw new Error(`User with id ${userId} not found`);
      }

      // Vérifier si l'article existe
      const article = await Article.findByPk(articleId);
      if (!article) {
        console.error(`Article with id ${articleId} not found`);
        throw new Error(`Article with id ${articleId} not found`);
      }

      // Vérifier si une recommendation existe déjà
      const existingRecommendation = await Recommendation.findOne({
        where: {
          user_id: userId,
          article_id: articleId,
        },
      });

      if (existingRecommendation) {
        // Si la recommendation existe déjà, on la retourne simplement
        console.log(
          "Recommendation existante trouvée:",
          existingRecommendation.id
        );
        return existingRecommendation;
      }

      console.log("Création d'une nouvelle recommendation avec:", {
        user_id: userId,
        article_id: articleId,
      });

      // Créer la recommendation
      const recommendation = await Recommendation.create({
        user_id: userId,
        article_id: articleId,
        created_at: new Date(),
      });

      console.log("Recommendation créée avec succès:", recommendation.id);
      return recommendation;
    } catch (error) {
      console.error("Erreur lors de la requête à la base de données:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans createRecommendation:", error);
    throw new Error("Error creating recommendation: " + error.message);
  }
};

const getAllRecommendations = async () => {
  try {
    const recommendations = await Recommendation.findAll();
    return recommendations;
  } catch (error) {
    throw new Error("Error fetching recommendations: " + error.message);
  }
};

const deleteRecommendation = async (id) => {
  try {
    const recommendation = await Recommendation.findByPk(id);
    if (!recommendation) {
      throw new Error("Recommendation not found");
    }
    await recommendation.destroy();
    return true;
  } catch (error) {
    throw new Error("Error deleting recommendation: " + error.message);
  }
};

// Cette fonction est utile pour le frontend qui gère les "likes"
const findUserRecommendation = async (userId, articleId) => {
  try {
    return await Recommendation.findOne({
      where: {
        user_id: Number(userId),
        article_id: String(articleId),
      },
    });
  } catch (error) {
    throw new Error("Error finding user recommendation: " + error.message);
  }
};

module.exports = {
  createRecommendation,
  getAllRecommendations,
  deleteRecommendation,
  findUserRecommendation,
};
