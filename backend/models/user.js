const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'Users',
    timestamps: true,  // Active les timestamps
    createdAt: 'created_at', 
    updatedAt: 'updated_at'  
});

// Synchronisation avec la base de données (ajouter les colonnes created_at et updated_at si elles manquent)
sequelize.sync()
    .then(() => console.log('User table created successfully'))
    .catch(err => console.error('Error creating User table:', err));

module.exports = User;
