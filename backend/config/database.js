// Charger les variables d'environnement - priorité aux variables d'environnement système
const { Sequelize } = require("sequelize");

// Détermine si nous sommes en environnement de production
const isProduction = process.env.NODE_ENV === "production";
console.log(`Mode: ${isProduction ? "Production" : "Développement"}`);

// Configuration de la base de données
let sequelize;

try {
  let connectionString;

  if (isProduction) {
    console.log(
      "Tentative de connexion à Supabase via Transaction Pooler (idéal pour Vercel serverless)..."
    );

    // En production, utiliser le Transaction Pooler de Supabase (recommandé pour les environnements serverless)
    connectionString =
      process.env.DATABASE_URL ||
      "postgresql://postgres.hrzzkzqevlbaycllebhb:[YOUR-PASSWORD]@aws-0-eu-west-3.pooler.supabase.com:6543/postgres";

    // Remplacer [YOUR-PASSWORD] par le mot de passe réel si défini dans l'environnement
    if (
      connectionString.includes("[YOUR-PASSWORD]") &&
      process.env.SUPABASE_DB_PASSWORD
    ) {
      connectionString = connectionString.replace(
        "[YOUR-PASSWORD]",
        process.env.SUPABASE_DB_PASSWORD
      );
    }
  } else {
    console.log(
      "Tentative de connexion à Supabase via connexion directe (développement)..."
    );

    // En développement, utiliser la connexion directe
    connectionString = process.env.DATABASE_URL;

    if (
      !connectionString &&
      process.env.SUPABASE_DB_USER &&
      process.env.SUPABASE_DB_PASSWORD
    ) {
      // Construire la chaîne à partir des variables individuelles pour la connexion directe
      connectionString = `postgresql://${process.env.SUPABASE_DB_USER}:${process.env.SUPABASE_DB_PASSWORD}@db.hrzzkzqevlbaycllebhb.supabase.co:5432/postgres`;
      console.log(
        "Chaîne de connexion directe construite à partir des variables individuelles SUPABASE_*"
      );
    }
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
      max: isProduction ? 10 : 3, // Plus de connexions en production
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  console.log(
    `Configuration Supabase initialisée en mode ${
      isProduction
        ? "production (Transaction Pooler)"
        : "développement (connexion directe)"
    }`
  );
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
