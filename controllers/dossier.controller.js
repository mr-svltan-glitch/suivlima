const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Dossier, Client, Paiement, Relance } = require('../models');
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/helpers');
const auditService = require('../services/audit.service');

/**
 * Liste des dossiers avec filtres
 * GET /api/dossiers
 */
const getAll = async (req, res) => {
  try {
    const { page = 1, size = 20, statut, client_id, search } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (statut) where.statut = statut;
    if (client_id) where.client_id = client_id;
    if (search) {
      where.titre = { [Op.iLike]: `%${search}%` };
    }

    const data = await Dossier.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        { model: Client, as: 'client', attributes: ['id', 'nom', 'prenom'] },
      ],
    });

    const result = getPagingData(data, page, limit);
    return successResponse(res, result, 'Dossiers récupérés.');
  } catch (error) {
    console.error('Erreur getAll dossiers:', error);
    return errorResponse(res, 'Erreur lors de la récupération des dossiers.');
  }
};

/**
 * Détail d'un dossier avec paiements et relances
 * GET /api/dossiers/:id
 */
const getById = async (req, res) => {
  try {
    const dossier = await Dossier.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client' },
        { model: Paiement, as: 'paiements', order: [['created_at', 'DESC']] },
        { model: Relance, as: 'relances', order: [['date_programmee', 'DESC']] },
      ],
    });

    if (!dossier) {
      return errorResponse(res, 'Dossier introuvable.', 404);
    }

    return successResponse(res, { dossier }, 'Dossier récupéré.');
  } catch (error) {
    console.error('Erreur getById dossier:', error);
    return errorResponse(res, 'Erreur lors de la récupération du dossier.');
  }
};

/**
 * Création d'un dossier
 * POST /api/dossiers
 */
const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const { client_id, titre, description, statut, date_echeance } = req.body;

    // Vérifier que le client existe
    const client = await Client.findByPk(client_id);
    if (!client) {
      return errorResponse(res, 'Client introuvable.', 404);
    }

    const dossier = await Dossier.create({ client_id, titre, description, statut, date_echeance });

    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'CREATE_DOSSIER',
      target_type: 'dossier',
      target_id: dossier.id,
      ip_address: req.ip,
      details: { titre: dossier.titre }
    });

    return successResponse(res, { dossier }, 'Dossier créé avec succès.', 201);
  } catch (error) {
    console.error('Erreur create dossier:', error);
    return errorResponse(res, 'Erreur lors de la création du dossier.');
  }
};

/**
 * Mise à jour d'un dossier
 * PUT /api/dossiers/:id
 */
const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const dossier = await Dossier.findByPk(req.params.id);
    if (!dossier) {
      return errorResponse(res, 'Dossier introuvable.', 404);
    }

    const { titre, description, statut } = req.body;
    await dossier.update({ titre, description, statut });

    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'UPDATE_DOSSIER',
      target_type: 'dossier',
      target_id: dossier.id,
      ip_address: req.ip,
      details: { titre: dossier.titre, statut: dossier.statut }
    });

    return successResponse(res, { dossier }, 'Dossier mis à jour.');
  } catch (error) {
    console.error('Erreur update dossier:', error);
    return errorResponse(res, 'Erreur lors de la mise à jour du dossier.');
  }
};

/**
 * Suppression d'un dossier
 * DELETE /api/dossiers/:id
 */
const remove = async (req, res) => {
  try {
    const dossier = await Dossier.findByPk(req.params.id);
    if (!dossier) {
      return errorResponse(res, 'Dossier introuvable.', 404);
    }

    await dossier.destroy();

    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'DELETE_DOSSIER',
      target_type: 'dossier',
      target_id: req.params.id,
      ip_address: req.ip,
      details: { titre: dossier.titre }
    });

    return successResponse(res, null, 'Dossier supprimé.');
  } catch (error) {
    console.error('Erreur remove dossier:', error);
    return errorResponse(res, 'Erreur lors de la suppression du dossier.');
  }
};

module.exports = { getAll, getById, create, update, remove };
