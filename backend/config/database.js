// Charger les variables d'environnement - priorité aux variables d'environnement système
const { Sequelize } = require("sequelize");

// Détermine si nous sommes en environnement de production
const isProduction = process.env.NODE_ENV === "production";
console.log(`Mode: ${isProduction ? "Production" : "Développement"}`);

// Configuration de la base de données
let sequelize;

// Utiliser les variables Supabase à la fois en production et en développement
// puisque .env.development contient les informations Supabase
try {
  console.log("Tentative de connexion à Supabase...");

  // Construire la chaîne de connexion à partir des variables individuelles
  // ou utiliser DATABASE_URL si elle est fournie
  let connectionString = process.env.DATABASE_URL;

  if (!connectionString && process.env.SUPABASE_DB_USER) {
    // Construire la chaîne à partir des variables individuelles
    connectionString = `postgresql://${process.env.SUPABASE_DB_USER}:${process.env.SUPABASE_DB_PASSWORD}@${process.env.SUPABASE_DB_HOST}:${process.env.SUPABASE_DB_PORT}/${process.env.SUPABASE_DB_NAME}`;
    console.log(
      "Chaîne de connexion construite à partir des variables individuelles SUPABASE_*"
    );
  }

  if (!connectionString) {
    throw new Error(
      "Aucune information de connexion à la base de données n'est disponible"
    );
  }

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
      max: 3,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  console.log("Configuration Supabase initialisée");
} catch (error) {
  console.error(
    "Erreur lors de l'initialisation de la configuration Supabase:",
    error
  );
  throw error;
}

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données établie avec succès");
    return true;
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error);
    console.error("Détails de l'erreur:", error.message);
    if (error.original) {
      console.error("Erreur originale:", error.original.message);
    }
    return false;
  }
};

module.exports = { sequelize, testConnection };
