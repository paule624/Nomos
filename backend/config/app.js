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

// Déterminer les origines autorisées en fonction de l'environnement
let allowedOrigins = [];
if (process.env.NODE_ENV === "production") {
  // En production, utiliser l'URL du frontend depuis .env
  allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://nomos-seven.vercel.app",
    "https://nomos-project.vercel.app",
  ];
  console.log("CORS configuré pour l'environnement de production");
} else {
  // En développement, autoriser localhost
  allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
  console.log("CORS configuré pour l'environnement de développement");
}

console.log("Origines autorisées:", allowedOrigins);

// Utiliser le middleware cors d'Express directement
app.use(
  cors({
    origin: function (origin, callback) {
      // Autoriser les requêtes sans origine (comme les appels mobiles ou curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Origine non autorisée:", origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Date",
      "X-Api-Version",
      "X-User-ID",
    ],
  })
);

// S'assurer que les requêtes OPTIONS sont correctement traitées
app.options("*", cors());

// Middleware (après CORS)
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
