const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Article = require("./article");

const Recommendation = sequelize.define(
  "Recommendation",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    user_id: {
      type: DataTypes.INTEGER, // Explicitement défini comme INTEGER pour correspondre au modèle User
      allowNull: true, // Permettre null pour éviter les problèmes lors de la migration
    },
    article_id: {
      type: DataTypes.UUID, // Type UUID pour article_id
      allowNull: true, // Permettre null pour éviter les problèmes lors de la migration
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false, // Désactive createdAt et updatedAt, car on utilise created_at
  }
);

// Relation avec Users
Recommendation.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  constraints: false, // Désactiver temporairement les contraintes
});

// Relation avec Articles
Recommendation.belongsTo(Article, {
  foreignKey: "article_id",
  as: "article",
  constraints: false, // Désactiver temporairement les contraintes
});

// Synchroniser sans alter pour éviter les problèmes de contraintes
sequelize
  .sync({ alter: false })
  .then(() => console.log("Recommendation table synchronized"))
  .catch((err) =>
    console.error("Error synchronizing Recommendation table:", err)
  );

module.exports = Recommendation;
