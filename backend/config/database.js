require("dotenv").config();
const { Sequelize } = require("sequelize");

// Détermine si nous sommes en environnement de production (Vercel) ou local
const isProduction = process.env.NODE_ENV === "production";

// Configuration de la base de données - différente selon l'environnement
let sequelize;

if (isProduction) {
  // Utiliser les variables Supabase en production
  sequelize = new Sequelize(
    process.env.SUPABASE_DB_NAME,
    process.env.SUPABASE_DB_USER,
    process.env.SUPABASE_DB_PASSWORD,
    {
      host: process.env.SUPABASE_DB_HOST,
      port: process.env.SUPABASE_DB_PORT,
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Important pour la connexion à Supabase
        },
      },
      logging: false,
    }
  );
  console.log("Using production database configuration (Supabase)");
} else {
  // Utiliser la configuration locale pour le développement
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
  console.log("Using local database configuration");
}

module.exports = sequelize;
