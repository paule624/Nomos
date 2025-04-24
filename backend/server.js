// Ne pas charger dotenv en production sur Vercel
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
  });
}

const app = require("./config/app");
const { sequelize, testConnection } = require("./config/database");
const models = require("./models");

// Initialiser la base de données de façon plus robuste
async function initializeDatabase() {
  try {
    console.log("Tentative de connexion à la base de données...");
    const connected = await testConnection();

    if (connected) {
      // Utiliser force: false, alter: false pour éviter les problèmes de contraintes
      console.log("Synchronisation des modèles...");
      await sequelize.sync({ force: false, alter: false });
      console.log("Database synchronization completed successfully");
      return true;
    } else {
      console.log("Database connection failed, but continuing...");
      return false;
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
    // En production, on ne veut pas échouer complètement si la DB n'est pas accessible immédiatement
    console.log("Database initialization error, but continuing...");
    return false;
  }
}

// Ajouter une route de statut/santé pour vérifier si le serveur fonctionne
app.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Pour les environnements non serverless (développement local)
if (process.env.NODE_ENV !== "production") {
  // Initialiser la base de données et démarrer le serveur local
  initializeDatabase().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
    });
  });
} else {
  // En production (Vercel)
  // Initialisation au premier démarrage - mais ne bloque pas l'application
  console.log("Production mode - initializing database in background");

  // Ne pas bloquer le serveur en attendant la connexion à la base de données
  initializeDatabase().catch((err) => {
    console.error("Database initialization failed in production:", err);
  });
}

// Gestionnaire de route par défaut pour les 404
app.use((req, res) => {
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

// Middleware de gestion d'erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur non gérée:", err);
  res.status(500).json({
    message: "Une erreur interne s'est produite",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

// Exporter l'application pour Vercel
module.exports = app;
