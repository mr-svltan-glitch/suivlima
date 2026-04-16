const { Op, fn, col, literal } = require('sequelize');
const { Paiement, Dossier, Client, Relance } = require('../models');
const sequelize = require('../config/database');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * KPIs globaux pour le dashboard
 * GET /api/dashboard/stats
 */
const getStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Chiffre d'affaires mensuel
    const caMensuel = await Paiement.sum('montant', {
      where: {
        statut: 'paye',
        date_paiement: { [Op.gte]: startOfMonth },
      },
    });

    // Chiffre d'affaires annuel
    const caAnnuel = await Paiement.sum('montant', {
      where: {
        statut: 'paye',
        date_paiement: { [Op.gte]: startOfYear },
      },
    });

    // Nombre total de clients
    const totalClients = await Client.count();
    const clientsActifs = await Client.count({ where: { statut_actif: true } });

    // Dossiers par statut
    const dossiersByStatut = await Dossier.findAll({
      attributes: [
        'statut',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['statut'],
    });

    // Paiements en retard (non payés avec dossier en relance)
    const paiementsEnRetard = await Paiement.count({
      where: { statut: 'non_paye' },
    });

    // Total paiements reçus
    const totalPaiements = await Paiement.sum('montant', {
      where: { statut: 'paye' },
    });

    // Évolution CA mensuel (12 derniers mois)
    let evolutionCA;
    if (sequelize.getDialect() === 'sqlite') {
      evolutionCA = await sequelize.query(`
        SELECT 
          strftime('%Y-%m', date_paiement) AS mois,
          COALESCE(SUM(montant), 0) AS total
        FROM paiements
        WHERE statut = 'paye'
          AND date_paiement >= date('now', '-12 months')
        GROUP BY mois
        ORDER BY mois ASC
      `, { type: sequelize.QueryTypes.SELECT });
    } else {
      evolutionCA = await sequelize.query(`
        SELECT 
          TO_CHAR(date_paiement, 'YYYY-MM') AS mois,
          COALESCE(SUM(montant), 0) AS total
        FROM paiements
        WHERE statut = 'paye'
          AND date_paiement >= NOW() - INTERVAL '12 months'
        GROUP BY TO_CHAR(date_paiement, 'YYYY-MM')
        ORDER BY mois ASC
      `, { type: sequelize.QueryTypes.SELECT });
    }

    // Relances récentes
    const relancesPending = await Relance.count({
      where: { statut: 'non_envoyee' },
    });

    return successResponse(res, {
      ca_mensuel: caMensuel || 0,
      ca_annuel: caAnnuel || 0,
      total_clients: totalClients,
      clients_actifs: clientsActifs,
      dossiers_par_statut: dossiersByStatut,
      paiements_en_retard: paiementsEnRetard,
      total_paiements: totalPaiements || 0,
      evolution_ca: evolutionCA,
      relances_en_attente: relancesPending,
    }, 'Statistiques récupérées.');
  } catch (error) {
    console.error('Erreur getStats:', error);
    return errorResponse(res, 'Erreur lors du calcul des statistiques.');
  }
};

/**
 * Top clients (par nombre de dossiers ou CA)
 * GET /api/dashboard/top-clients
 */
const getTopClients = async (req, res) => {
  try {
    const { limit = 10, by = 'ca' } = req.query;

    let topClients;

    if (by === 'dossiers') {
      topClients = await Client.findAll({
        attributes: {
          include: [
            [fn('COUNT', col('dossiers.id')), 'nombre_dossiers'],
          ],
        },
        include: [{ model: Dossier, as: 'dossiers', attributes: [] }],
        group: ['Client.id'],
        order: [[literal('nombre_dossiers'), 'DESC']],
        limit: +limit,
        subQuery: false,
      });
    } else {
      // Par chiffre d'affaires
      topClients = await sequelize.query(`
        SELECT 
          c.id, c.nom, c.prenom, c.email,
          COALESCE(SUM(p.montant), 0) AS chiffre_affaires,
          COUNT(DISTINCT d.id) AS nombre_dossiers
        FROM clients c
        LEFT JOIN dossiers d ON d.client_id = c.id
        LEFT JOIN paiements p ON p.dossier_id = d.id AND p.statut = 'paye'
        GROUP BY c.id, c.nom, c.prenom, c.email
        ORDER BY chiffre_affaires DESC
        LIMIT :limit
      `, {
        replacements: { limit: +limit },
        type: sequelize.QueryTypes.SELECT,
      });
    }

    return successResponse(res, { top_clients: topClients }, 'Top clients récupérés.');
  } catch (error) {
    console.error('Erreur getTopClients:', error);
    return errorResponse(res, 'Erreur lors de la récupération des top clients.');
  }
};

/**
 * Statistiques des relances
 * GET /api/dashboard/relances-stats
 */
const getRelancesStats = async (req, res) => {
  try {
    const relancesByStatut = await Relance.findAll({
      attributes: [
        'statut',
        'type_relance',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['statut', 'type_relance'],
    });

    const totalRelances = await Relance.count();
    const relancesEnvoyees = await Relance.count({ where: { statut: 'envoyee' } });
    const tauxReussite = totalRelances > 0
      ? ((relancesEnvoyees / totalRelances) * 100).toFixed(1)
      : 0;

    return successResponse(res, {
      relances_par_statut: relancesByStatut,
      total_relances: totalRelances,
      relances_envoyees: relancesEnvoyees,
      taux_reussite: `${tauxReussite}%`,
    }, 'Statistiques des relances récupérées.');
  } catch (error) {
    console.error('Erreur getRelancesStats:', error);
    return errorResponse(res, 'Erreur lors du calcul des statistiques de relances.');
  }
};

/**
 * Journaux d'activité récents pour le dashboard
 * GET /api/dashboard/logs
 */
const getActivityLogs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const { Log, User } = require('../models');
    
    const logs = await Log.findAll({
      limit: +limit,
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'nom', 'prenom'] }
      ]
    });

    return successResponse(res, { logs }, 'Logs d\'activité récupérés.');
  } catch (error) {
    console.error('Erreur getActivityLogs:', error);
    return errorResponse(res, 'Erreur lors de la récupération des logs.');
  }
};

module.exports = { getStats, getTopClients, getRelancesStats, getActivityLogs };
