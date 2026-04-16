const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Paiement, Dossier, Client } = require('../models');
const { successResponse, errorResponse, getPagination, getPagingData, generatePaymentLink } = require('../utils/helpers');
const auditService = require('../services/audit.service');

/**
 * Liste des paiements avec filtres
 * GET /api/paiements
 */
const getAll = async (req, res) => {
  try {
    const { page = 1, size = 20, statut, dossier_id, date_debut, date_fin } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (statut) where.statut = statut;
    if (dossier_id) where.dossier_id = dossier_id;
    if (date_debut && date_fin) {
      where.date_paiement = { [Op.between]: [date_debut, date_fin] };
    }

    const data = await Paiement.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Dossier,
          as: 'dossier',
          attributes: ['id', 'titre'],
          include: [{ model: Client, as: 'client', attributes: ['id', 'nom', 'prenom'] }],
        },
      ],
    });

    const result = getPagingData(data, page, limit);
    return successResponse(res, result, 'Paiements récupérés.');
  } catch (error) {
    console.error('Erreur getAll paiements:', error);
    return errorResponse(res, 'Erreur lors de la récupération des paiements.');
  }
};

/**
 * Création d'un paiement avec génération du lien
 * POST /api/paiements
 */
const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const { dossier_id, montant, mode_paiement, date_paiement, statut, reference } = req.body;

    // Vérifier dossier
    const dossier = await Dossier.findByPk(dossier_id);
    if (!dossier) {
      return errorResponse(res, 'Dossier introuvable.', 404);
    }

    const paiement = await Paiement.create({
      dossier_id,
      montant,
      mode_paiement,
      date_paiement,
      statut: statut || 'non_paye',
      reference
    });

    // Générer lien de paiement
    const lien = generatePaymentLink(paiement.id);
    await paiement.update({ lien_paiement: lien });

    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'RECEIVE_PAYMENT',
      target_type: 'paiement',
      target_id: paiement.id,
      ip_address: req.ip,
      details: { montant: paiement.montant, reference: paiement.reference }
    });

    return successResponse(res, { paiement }, 'Paiement enregistré.', 201);
  } catch (error) {
    console.error('Erreur create paiement:', error);
    return errorResponse(res, 'Erreur lors de l\'enregistrement du paiement.');
  }
};

/**
 * Mise à jour d'un paiement
 * PUT /api/paiements/:id
 */
const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return errorResponse(res, 'Paiement introuvable.', 404);
    }

    const { montant, statut, mode_paiement, date_paiement } = req.body;
    await paiement.update({ montant, statut, mode_paiement, date_paiement });

    return successResponse(res, { paiement }, 'Paiement mis à jour.');
  } catch (error) {
    console.error('Erreur update paiement:', error);
    return errorResponse(res, 'Erreur lors de la mise à jour du paiement.');
  }
};

/**
 * Suppression d'un paiement
 * DELETE /api/paiements/:id
 */
const remove = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return errorResponse(res, 'Paiement introuvable.', 404);
    }

    await paiement.destroy();
    return successResponse(res, null, 'Paiement supprimé.');
  } catch (error) {
    console.error('Erreur remove paiement:', error);
    return errorResponse(res, 'Erreur lors de la suppression du paiement.');
  }
};

module.exports = { getAll, create, update, remove };
