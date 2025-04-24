// Charger le bon fichier d'environnement selon NODE_ENV
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const app = require("./config/app");
const { sequelize, testConnection } = require("./config/database");
// Importer tous les modèles depuis l'index
const models = require("./models");

// Initialiser la base de données de façon plus robuste
async function initializeDatabase() {
  try {
    const connected = await testConnection();

    if (connected) {
      // Utiliser force: false, alter: false pour éviter les problèmes de contraintes
      // et conserver les données existantes
      await sequelize.sync({ force: false, alter: false });
      console.log("Database synchronization check completed");
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
  // En production (Vercel), initialisation au premier démarrage
  // mais on n'attend pas que ça se termine pour exporter l'app
  initializeDatabase().catch((err) => {
    console.error("Database initialization failed in production:", err);
  });
}

// Gestionnaire de route par défaut
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

// Exporter l'application pour Vercel
module.exports = app;
