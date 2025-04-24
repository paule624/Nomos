const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Categories", // Utilise le bon nom de table
    timestamps: true, // Active les timestamps
    createdAt: "created_at", // Nom de la colonne `created_at`
    updatedAt: "updated_at", // Nom de la colonne `updated_at`
  }
);

// Hook pour mettre à jour `updated_at` avant la mise à jour
Category.beforeUpdate((category, options) => {
  category.updated_at = Sequelize.NOW;
});

module.exports = Category;
