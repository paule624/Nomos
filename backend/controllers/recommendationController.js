// controllers/recommendationController.js
const recommendationService = require("../services/recommendationService");

const createRecommendation = async (req, res) => {
  try {
    const recommendation = await recommendationService.createRecommendation(
      req.body
    );
    res.status(201).json(recommendation); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const recommendations = await recommendationService.getAllRecommendations();
    res.status(200).json(recommendations); // Réponse en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecommendation = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await recommendationService.deleteRecommendation(id);
    res
      .status(200)
      .json({ success: true, message: "Recommendation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecommendation,
  getRecommendations,
  deleteRecommendation,
};
