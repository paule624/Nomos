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
});

// Relation avec Articles
Recommendation.belongsTo(Article, {
  foreignKey: "article_id",
  as: "article",
});

module.exports = Recommendation;
