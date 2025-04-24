// Charger le bon fichier d'environnement selon NODE_ENV
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
const { Sequelize } = require("sequelize");

console.log(`Environnement: ${process.env.NODE_ENV || "development"}`);

// Détermine si nous sommes en environnement de production
const isProduction = process.env.NODE_ENV === "production";

// Configuration de la base de données - différente selon l'environnement
let sequelize;

if (isProduction) {
  // Utiliser les variables Supabase en production
  console.log("Connexion à la base de données Supabase (production)");
  const connectionString = `postgresql://${process.env.SUPABASE_DB_USER}:${process.env.SUPABASE_DB_PASSWORD}@${process.env.SUPABASE_DB_HOST}:${process.env.SUPABASE_DB_PORT}/${process.env.SUPABASE_DB_NAME}`;

  sequelize = new Sequelize(connectionString, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Utiliser la configuration locale pour le développement
  console.log("Connexion à la base de données locale (développement)");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      logging: false,
    }
  );
}

// Exporter une fonction pour tester la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
};

module.exports = { sequelize, testConnection };
