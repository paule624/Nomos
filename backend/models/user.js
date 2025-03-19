const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true, // Changed from false to true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true, // Changed from false to true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    selectedCategories: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [], // Tableau vide par défaut
    },
  },
  {
    tableName: "Users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Synchronisation avec la base de données
sequelize
  .sync({ alter: true }) // Using alter:true to update the table structure
  .then(() => console.log("User table updated successfully"))
  .catch((err) => console.error("Error updating User table:", err));

module.exports = User;
