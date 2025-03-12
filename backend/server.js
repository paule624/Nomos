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

    // Utiliser alter: true pour préserver les données existantes
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

initializeDatabase();

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
