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

// Configuration CORS simplifiée - autoriser toutes les origines en production
// C'est plus permissif mais résoudra les problèmes de CORS
if (process.env.NODE_ENV === "production") {
  console.log(
    "Configuration CORS pour la production - toutes origines autorisées"
  );
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
} else {
  // En développement, autoriser seulement localhost
  console.log("Configuration CORS pour le développement");
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
}

// Middleware
app.use(express.json());

// Routes pour l'API SANS le préfixe /api/
app.use("/articles", articleRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/upload", cloudinaryImageRoutes);
app.use("/auth", authRoutes);
app.use("/cloudinary-images", cloudinaryImageRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/reactions", reactionRoutes);

// Ajouter une route pour le statut de l'API
app.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Gestionnaire pour les routes 404 qui renvoie les routes disponibles
app.use((req, res) => {
  // Liste statique des routes principales
  const availableRoutes = [
    "/articles",
    "/users",
    "/categories",
    "/auth/login",
    "/auth/register",
    "/recommendations",
    "/upload",
    "/reactions",
    "/cloudinary-images",
    "/status",
  ];

  res.status(404).json({
    message: `Route ${req.path} not found`,
    availableRoutes,
  });
});

module.exports = app;
