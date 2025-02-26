const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CloudinaryImage = sequelize.define(
  "CloudinaryImage",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["article", "profile", "banner", "thumbnail"]], // Exemples de types possibles
      },
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

module.exports = CloudinaryImage;
