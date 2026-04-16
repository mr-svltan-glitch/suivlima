const { Log } = require('../models');

/**
 * Service pour l'audit et le logging d'activité
 */
class AuditService {
  /**
   * Enregistre une action dans les logs
   * @param {Object} params
   * @param {string} params.user_id - ID de l'utilisateur ayant fait l'action
   * @param {string} params.action - Description de l'action (ex: 'CREATE_CLIENT')
   * @param {string} params.target_type - Type de l'objet (client, dossier, etc.)
   * @param {string} params.target_id - ID de l'objet ciblé
   * @param {Object} params.details - Détails supplémentaires (JSON)
   * @param {string} params.ip_address - IP de l'utilisateur
   */
  async logAction({ user_id, action, target_type, target_id, details, ip_address }) {
    try {
      await Log.create({
        user_id,
        action,
        target_type,
        target_id,
        details,
        ip_address,
      });
      console.log(`[AUDIT] Action: ${action} by User: ${user_id || 'SYSTEM'}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement du log d\'audit:', error);
    }
  }
}

module.exports = new AuditService();
