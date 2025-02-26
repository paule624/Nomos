// services/reactionService.js
const Reaction = require("../models/reaction");

const createReaction = async (data) => {
  try {
    const reaction = await Reaction.create(data);
    return reaction;
  } catch (error) {
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

module.exports = {
  createReaction,
  getAllReactions,
};
