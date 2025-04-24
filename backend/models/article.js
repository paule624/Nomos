const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const CloudinaryImage = require("./cloudinaryImage");
const Category = require("./category");
const User = require("./user");

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "draft",
      validate: {
        isIn: [["draft", "published", "archived"]],
      },
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "Articles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Remove all association definitions from here
// They should only be defined in models/index.js

module.exports = Article;
