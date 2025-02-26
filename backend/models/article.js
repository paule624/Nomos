const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const CloudinaryImage = require("./cloudinaryImage");
const Category = require("./category");

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
    published_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    source: {
      type: DataTypes.STRING(255),
    },
  },
  {
    timestamps: true, // Active createdAt et updatedAt automatiquement
  }
);

// Relation avec CloudinaryImages
Article.belongsTo(CloudinaryImage, {
  foreignKey: "image_id",
  as: "image",
});

// Relation avec Categories
Article.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

module.exports = Article;
