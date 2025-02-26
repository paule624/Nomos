// services/recommendationService.js
const Recommendation = require("../models/recommendation");

const createRecommendation = async (data) => {
  try {
    const recommendation = await Recommendation.create(data);
    return recommendation;
  } catch (error) {
    throw new Error("Error creating recommendation: " + error.message);
  }
};

const getAllRecommendations = async () => {
  try {
    const recommendations = await Recommendation.findAll();
    return Recommendations;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

module.exports = {
  createRecommendation,
  getAllRecommendations,
};
