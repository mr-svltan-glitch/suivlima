const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dossier = sequelize.define('Dossier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'clients', key: 'id' },
  },
  titre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'en_cours', 'termine', 'relance_necessaire'),
    allowNull: false,
    defaultValue: 'en_attente',
  },
}, {
  tableName: 'dossiers',
});

module.exports = Dossier;
