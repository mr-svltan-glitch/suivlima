const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interaction = sequelize.define('Interaction', {
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
  type_interaction: {
    type: DataTypes.ENUM('whatsapp', 'email', 'app', 'telephone', 'autre'),
    allowNull: false,
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'interactions',
});

module.exports = Interaction;
