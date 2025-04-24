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

// Configuration CORS pour production et développement
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL, // Frontend en production (depuis .env)
    "http://localhost:5173", // Frontend en développement (Vite)
    "http://localhost:3000", // En cas d'utilisation sur un autre port local
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware personnalisé pour CORS
app.use((req, res, next) => {
  // Origines autorisées
  const allowedOrigins = [
    process.env.FRONTEND_URL, // Frontend en production (depuis .env)
    "http://localhost:5173", // Frontend en développement (Vite)
    "http://localhost:3000", // En cas d'utilisation sur un autre port local
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Permettre les en-têtes et méthodes nécessaires
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Prétraiter les requêtes OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Middleware (après notre middleware CORS personnalisé)
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
