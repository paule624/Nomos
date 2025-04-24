const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
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

module.exports = Reaction;
