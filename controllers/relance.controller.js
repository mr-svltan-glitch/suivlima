const { validationResult } = require('express-validator');
const { Relance, Dossier, Client } = require('../models');
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/helpers');

/**
 * Liste des relances avec filtres
 * GET /api/relances
 */
const getAll = async (req, res) => {
  try {
    const { page = 1, size = 20, statut, type_relance, dossier_id } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (statut) where.statut = statut;
    if (type_relance) where.type_relance = type_relance;
    if (dossier_id) where.dossier_id = dossier_id;

    const data = await Relance.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date_programmee', 'DESC']],
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
    return successResponse(res, result, 'Relances récupérées.');
  } catch (error) {
    console.error('Erreur getAll relances:', error);
    return errorResponse(res, 'Erreur lors de la récupération des relances.');
  }
};

/**
 * Planification d'une relance
 * POST /api/relances
 */
const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const { dossier_id, type_relance, date_programmee, message } = req.body;

    const dossier = await Dossier.findByPk(dossier_id);
    if (!dossier) {
      return errorResponse(res, 'Dossier introuvable.', 404);
    }

    const relance = await Relance.create({
      dossier_id,
      type_relance,
      date_programmee,
      message,
    });

    return successResponse(res, { relance }, 'Relance planifiée.', 201);
  } catch (error) {
    console.error('Erreur create relance:', error);
    return errorResponse(res, 'Erreur lors de la planification de la relance.');
  }
};

/**
 * Mise à jour d'une relance
 * PUT /api/relances/:id
 */
const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const relance = await Relance.findByPk(req.params.id);
    if (!relance) {
      return errorResponse(res, 'Relance introuvable.', 404);
    }

    const { statut, date_programmee, message, type_relance } = req.body;
    await relance.update({ statut, date_programmee, message, type_relance });

    return successResponse(res, { relance }, 'Relance mise à jour.');
  } catch (error) {
    console.error('Erreur update relance:', error);
    return errorResponse(res, 'Erreur lors de la mise à jour de la relance.');
  }
};

module.exports = { getAll, create, update };
