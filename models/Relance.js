const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Relance = sequelize.define('Relance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  dossier_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'dossiers', key: 'id' },
  },
  type_relance: {
    type: DataTypes.ENUM('whatsapp', 'email'),
    allowNull: false,
  },
  date_programmee: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('envoyee', 'non_envoyee', 'echouee'),
    allowNull: false,
    defaultValue: 'non_envoyee',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Message personnalisé de la relance',
  },
}, {
  tableName: 'relances',
  indexes: [
    {
      fields: ['dossier_id'],
    },
    {
      fields: ['statut'],
    },
    {
      fields: ['date_programmee'],
    },
    {
      fields: ['type_relance'],
    },
  ],
});

module.exports = Relance;
