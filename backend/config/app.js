const express = require("express");
const cors = require("cors");

// Importation des routes
const userRoutes = require("../routes/userRoutes");
const articleRoutes = require("../routes/articleRoutes");
const recommendationRoutes = require("../routes/recommendationRoutes");
const cloudinaryImageRoutes = require("../routes/cloudinaryImageRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const authRoutes = require("../routes/authRoutes");
const reactionRoutes = require("../routes/reactionRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/articles", articleRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/upload", cloudinaryImageRoutes);
app.use("/auth", authRoutes);
app.use("/cloudinary-images", cloudinaryImageRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/reactions", reactionRoutes);

module.exports = app;
