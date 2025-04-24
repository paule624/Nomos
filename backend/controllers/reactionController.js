// controllers/userController.js
const reactionService = require("../services/reactionService");

const createReaction = async (req, res) => {
  try {
    console.log("Données reçues dans le contrôleur:", JSON.stringify(req.body));

    // Vérifier que les données nécessaires sont présentes
    if (!req.body.user_id) {
      return res.status(400).json({ message: "user_id est requis" });
    }

    if (!req.body.article_id) {
      return res.status(400).json({ message: "article_id est requis" });
    }

    if (!req.body.reaction_type) {
      req.body.reaction_type = "like"; // Valeur par défaut
    }

    // Tentative de création de la réaction
    try {
      const reaction = await reactionService.createReaction(req.body);
      return res.status(201).json(reaction);
    } catch (serviceError) {
      console.error("Erreur du service:", serviceError);
      return res.status(500).json({
        message: serviceError.message,
        stack: serviceError.stack,
        error: "Service error",
      });
    }
  } catch (error) {
    console.error("Erreur générale dans le contrôleur:", error);
    return res.status(500).json({
      message: error.message,
      stack: error.stack,
      error: "Controller error",
    });
  }
};

const getReactions = async (req, res) => {
  try {
    const reactions = await reactionService.getAllReactions();
    res.status(200).json(reactions); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReaction = async (req, res) => {
  try {
    const { id } = req.params;
    await reactionService.deleteReaction(id);
    res.status(200).json({ message: "Reaction deleted successfully" });
  } catch (error) {
    res
      .status(error.message.includes("not found") ? 404 : 500)
      .json({ message: error.message });
  }
};

module.exports = {
  createReaction,
  getReactions,
  deleteReaction,
};
