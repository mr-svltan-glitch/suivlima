const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');
const Dossier = require('./Dossier');
const Paiement = require('./Paiement');
const Interaction = require('./Interaction');
const Relance = require('./Relance');
const Log = require('./Log');

// ── Associations ──

// Client <-> Dossier
Client.hasMany(Dossier, { foreignKey: 'client_id', as: 'dossiers', onDelete: 'CASCADE' });
Dossier.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Dossier <-> Paiement
Dossier.hasMany(Paiement, { foreignKey: 'dossier_id', as: 'paiements', onDelete: 'CASCADE' });
Paiement.belongsTo(Dossier, { foreignKey: 'dossier_id', as: 'dossier' });

// Client <-> Interaction
Client.hasMany(Interaction, { foreignKey: 'client_id', as: 'interactions', onDelete: 'CASCADE' });
Interaction.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Dossier <-> Relance
Dossier.hasMany(Relance, { foreignKey: 'dossier_id', as: 'relances', onDelete: 'CASCADE' });
Relance.belongsTo(Dossier, { foreignKey: 'dossier_id', as: 'dossier' });
 
// User <-> Log
User.hasMany(Log, { foreignKey: 'user_id', as: 'logs' });
Log.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Client,
  Dossier,
  Paiement,
  Interaction,
  Relance,
  Log,
};
