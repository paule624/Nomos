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
});

// Relation avec Articles
Reaction.belongsTo(Article, {
  foreignKey: "article_id",
  as: "article",
});

module.exports = Reaction;
