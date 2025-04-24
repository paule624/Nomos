const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Article = require("./article");

const Reaction = sequelize.define(
  "Reaction",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    user_id: {
      type: DataTypes.INTEGER, // Remis à INTEGER pour correspondre au type d'ID de User
      allowNull: false,
    },
    article_id: {
      type: DataTypes.UUID, // Reste UUID car les articles utilisent des UUID
      allowNull: false,
    },
    reaction_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
Reaction.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  // Désactiver temporairement les contraintes de clé étrangère pour éviter les erreurs lors de la synchronisation
  constraints: false,
});

// Relation avec Articles
Reaction.belongsTo(Article, {
  foreignKey: "article_id",
  as: "article",
  // Désactiver temporairement les contraintes de clé étrangère pour éviter les erreurs lors de la synchronisation
  constraints: false,
});

// Modifier la stratégie de synchronisation pour éviter les erreurs de contrainte
sequelize
  .sync({ alter: false }) // Utiliser alter: false pour éviter de modifier les contraintes existantes
  .then(() => console.log("Reaction table synchronized"))
  .catch((err) => console.error("Error synchronizing Reaction table:", err));

module.exports = Reaction;
