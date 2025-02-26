// app.js
const express = require("express");
const app = express();
const userRoutes = require("../routes/userRoutes");
const articleRoutes = require("../routes/articleRoutes");
const recommendationRoutes = require("../routes/recommendationRoutes");
const cloudinaryImageRoutes = require("../routes/cloudinaryImageRoutes");
const categoryRoutes = require("../routes/categoryRoutes");

app.use(express.json()); // Permet de traiter les données JSON envoyées dans les requêtes

// Utilisation des routes
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/cloudinary-images", cloudinaryImageRoutes);
app.use("/categories", categoryRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
