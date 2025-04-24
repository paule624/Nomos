// Charger les variables d'environnement - priorité aux variables d'environnement système
const { Sequelize } = require("sequelize");

// Détermine si nous sommes en environnement de production
const isProduction = process.env.NODE_ENV === "production";
console.log(`Mode: ${isProduction ? "Production" : "Développement"}`);

// Configuration de la base de données
let sequelize;

if (isProduction) {
  // PRODUCTION - Supabase avec URL de connexion complète
  console.log("Tentative de connexion à Supabase via URI...");

  try {
    // Chaîne de connexion complète pour Supabase
    const connectionString =
      "postgresql://postgres:rUqZIBG8223i2mNO@db.hrzzkzqevlbaycllebhb.supabase.co:5432/postgres";

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

    console.log("Configuration Supabase initialisée avec URI");
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la configuration Supabase:",
      error
    );
    throw error;
  }
} else {
  // DÉVELOPPEMENT - Base locale
  console.log("Connexion à la base de données locale");

  try {
    sequelize = new Sequelize(
      process.env.DB_NAME || "Nomos_bdd",
      process.env.DB_USER || "postgres",
      process.env.DB_PASSWORD || "paule624",
      {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: false,
      }
    );
    console.log("Configuration locale initialisée");
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la configuration locale:",
      error
    );
    throw error;
  }
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
