const { Sequelize } = require("sequelize");

// Configuration de la connexion à la base de données PostgreSQL
const sequelize = new Sequelize(
  "postgres://root:paule624@localhost:5432/Nomos_bdd",
  {
    dialect: "postgres",
    logging: false, // Désactiver le logging des requêtes SQL
  }
);

module.exports = sequelize;
