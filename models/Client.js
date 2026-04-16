const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { isEmail: true },
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  adresse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  statut_actif: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'clients',
});

module.exports = Client;
