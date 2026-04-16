const { validationResult } = require('express-validator');
const { Interaction, Client } = require('../models');
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/helpers');

/**
 * Historique des interactions (filtré par client)
 * GET /api/interactions
 */
const getAll = async (req, res) => {
  try {
    const { page = 1, size = 20, client_id, type_interaction } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (client_id) where.client_id = client_id;
    if (type_interaction) where.type_interaction = type_interaction;

    const data = await Interaction.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date', 'DESC']],
      include: [
        { model: Client, as: 'client', attributes: ['id', 'nom', 'prenom'] },
      ],
    });

    const result = getPagingData(data, page, limit);
    return successResponse(res, result, 'Interactions récupérées.');
  } catch (error) {
    console.error('Erreur getAll interactions:', error);
    return errorResponse(res, 'Erreur lors de la récupération des interactions.');
  }
};

/**
 * Ajout d'une interaction
 * POST /api/interactions
 */
const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const { client_id, type_interaction, contenu } = req.body;

    const client = await Client.findByPk(client_id);
    if (!client) {
      return errorResponse(res, 'Client introuvable.', 404);
    }

    const interaction = await Interaction.create({
      client_id,
      type_interaction,
      contenu,
      date: new Date(),
    });

    return successResponse(res, { interaction }, 'Interaction enregistrée.', 201);
  } catch (error) {
    console.error('Erreur create interaction:', error);
    return errorResponse(res, 'Erreur lors de l\'enregistrement de l\'interaction.');
  }
};

module.exports = { getAll, create };
