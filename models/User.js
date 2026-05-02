const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  mot_de_passe_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'commercial', 'support'),
    allowNull: false,
    defaultValue: 'commercial',
  },
}, {
  tableName: 'users',
  indexes: [
    {
      fields: ['email'],
      unique: true,
    },
    {
      fields: ['role'],
    },
  ],
});

module.exports = User;
