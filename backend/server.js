// Charger les variables d'environnement à partir du fichier .env
require("dotenv").config();

const app = require("./config/app");
const sequelize = require("./config/database");
// Importer tous les modèles depuis l'index
const models = require("./models");

// Test de la connexion à la base de données et sync des modèles
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");

    // Utiliser force: false, alter: false pour éviter les problèmes de contraintes
    // et conserver les données existantes
    await sequelize.sync({ force: false, alter: false });
    console.log("Database synchronization check completed");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    // Continuer l'exécution du serveur même en cas d'erreur de synchronisation
    console.log("Starting server despite synchronization issues...");
  }
}

// Pour les environnements non serverless (développement local)
if (process.env.NODE_ENV !== "production") {
  initializeDatabase();

  // Démarrer le serveur en local
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Exporter l'application pour Vercel
module.exports = app;
