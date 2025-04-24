const { sequelize } = require("../config/database");
const User = require("./user");
const Article = require("./article");
const Category = require("./category");
const CloudinaryImage = require("./cloudinaryImage");
const Recommendation = require("./recommendation");
const Reaction = require("./reaction");

// Define associations only once, here
Article.belongsTo(User, { foreignKey: "author_id", as: "author" });
Article.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Article.belongsTo(CloudinaryImage, { foreignKey: "image_id", as: "image" });

User.hasMany(Article, { foreignKey: "author_id", as: "articles" });
Category.hasMany(Article, { foreignKey: "category_id", as: "articles" });
CloudinaryImage.hasMany(Article, { foreignKey: "image_id", as: "articles" });

module.exports = {
  sequelize,
  User,
  Article,
  Category,
  CloudinaryImage,
  Recommendation,
  Reaction,
};
