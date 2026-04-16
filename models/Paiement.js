const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paiement = sequelize.define('Paiement', {
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
  montant: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  date_paiement: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  mode_paiement: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Ex: virement, carte, espèces, mobile money',
  },
  statut: {
    type: DataTypes.ENUM('paye', 'non_paye'),
    allowNull: false,
    defaultValue: 'non_paye',
  },
  lien_paiement: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'paiements',
});

module.exports = Paiement;
