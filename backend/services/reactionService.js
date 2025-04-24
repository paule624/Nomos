// services/reactionService.js
const Reaction = require("../models/reaction");
const User = require("../models/user");
const Article = require("../models/article");
const { Op } = require("sequelize");

const createReaction = async (data) => {
  try {
    // Ajouter un type de réaction par défaut si non fourni
    if (!data.reaction_type) {
      data.reaction_type = "like";
    }

    // Vérifier que user_id et article_id sont présents
    if (!data.user_id) {
      throw new Error("user_id is required");
    }

    if (!data.article_id) {
      throw new Error("article_id is required");
    }

    console.log("Données reçues:", data);

    // Convertir user_id en nombre (puisque c'est un INTEGER dans la DB)
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

      // Vérifier si une réaction existe déjà en utilisant des contraintes de type explicites
      const existingReaction = await Reaction.findOne({
        where: {
          user_id: {
            [Op.eq]: userId, // Utiliser Op.eq pour une comparaison plus stricte
          },
          article_id: {
            [Op.eq]: articleId,
          },
        },
      });

      if (existingReaction) {
        // Si la réaction existe déjà, on la retourne simplement
        console.log("Réaction existante trouvée:", existingReaction.id);
        return existingReaction;
      }

      console.log("Création d'une nouvelle réaction avec:", {
        user_id: userId,
        article_id: articleId,
        reaction_type: data.reaction_type,
      });

      // Créer la réaction avec les types correctement convertis
      const reaction = await Reaction.create({
        user_id: userId,
        article_id: articleId,
        reaction_type: data.reaction_type,
        created_at: new Date(),
      });

      console.log("Réaction créée avec succès:", reaction.id);
      return reaction;
    } catch (error) {
      console.error("Erreur lors de la requête à la base de données:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans createReaction:", error);
    throw new Error("Error creating reaction: " + error.message);
  }
};

const getAllReactions = async () => {
  try {
    const reactions = await Reaction.findAll();
    return reactions;
  } catch (error) {
    throw new Error("Error fetching reactions: " + error.message);
  }
};

const deleteReaction = async (id) => {
  try {
    const reaction = await Reaction.findByPk(id);
    if (!reaction) {
      throw new Error("Reaction not found");
    }
    await reaction.destroy();
    return true;
  } catch (error) {
    throw new Error("Error deleting reaction: " + error.message);
  }
};

module.exports = {
  createReaction,
  getAllReactions,
  deleteReaction,
};
