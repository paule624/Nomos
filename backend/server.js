// Ne pas charger dotenv en production sur Vercel
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
  });
}

const app = require("./config/app");
const { sequelize, testConnection } = require("./config/database");
const models = require("./models");

// Variable globale pour suivre l'état de la connexion à la base de données
let databaseInitialized = false;

// Initialiser la base de données de façon plus robuste
async function initializeDatabase() {
  try {
    // Si la base de données est déjà initialisée, ne pas refaire le processus
    if (databaseInitialized) {
      return true;
    }

    console.log("Tentative de connexion à la base de données...");
    const connected = await testConnection();

    if (connected) {
      // Utiliser force: false, alter: false pour éviter les problèmes de contraintes
      console.log("Synchronisation des modèles...");
      await sequelize.sync({ force: false, alter: false });
      console.log("Database synchronization completed successfully");
      databaseInitialized = true;
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

// Middleware pour s'assurer que la base de données est initialisée avant de traiter les requêtes
app.use(async (req, res, next) => {
  // Ignorer la route de statut - elle doit toujours fonctionner même sans DB
  if (req.path === "/status") {
    return next();
  }

  try {
    // Tenter d'initialiser la base de données si ce n'est pas déjà fait
    if (!databaseInitialized) {
      const initialized = await initializeDatabase();
      if (!initialized && req.path !== "/status") {
        console.error(
          "La base de données n'est pas initialisée pour la route:",
          req.path
        );
        return res.status(503).json({
          message:
            "Service temporairement indisponible. Veuillez réessayer plus tard.",
          success: false,
        });
      }
    }
    next();
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error
    );
    res.status(503).json({
      message:
        "Service temporairement indisponible. Veuillez réessayer plus tard.",
      success: false,
    });
  }
});

// Ajouter une route de statut/santé pour vérifier si le serveur fonctionne
app.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    databaseInitialized,
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
  // En production (Vercel), l'initialisation se fait par le middleware
  console.log(
    "Production mode - database will be initialized on first request"
  );
}

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
