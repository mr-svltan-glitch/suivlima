const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  target_type: {
    type: DataTypes.STRING, // 'client', 'dossier', 'paiement', etc.
    allowNull: true,
  },
  target_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'logs',
  updatedAt: false,
  indexes: [
    {
      fields: ['user_id'],
    },
    {
      fields: ['action'],
    },
    {
      fields: ['target_type', 'target_id'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

module.exports = Log;
