// controllers/userController.js
const reactionService = require("../services/reactionService");

const createReaction = async (req, res) => {
  try {
    const reaction = await reactionService.createReaction(req.body);
    res.status(201).json(reaction); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
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



module.exports = {
  createReaction,
  getReactions,
};
