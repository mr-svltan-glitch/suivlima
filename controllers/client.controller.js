const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Client, Dossier, Interaction } = require('../models');
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/helpers');
const auditService = require('../services/audit.service');

/**
 * Liste des clients avec pagination, recherche et filtres
 * GET /api/clients
 */
const getAll = async (req, res) => {
  try {
    const { page = 1, size = 20, search, statut_actif } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (search) {
      where[Op.or] = [
        { nom: { [Op.iLike]: `%${search}%` } },
        { prenom: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { telephone: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (statut_actif !== undefined) {
      where.statut_actif = statut_actif === 'true';
    }

    const data = await Client.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{ model: Dossier, as: 'dossiers', attributes: ['id', 'titre', 'statut'] }],
    });

    const result = getPagingData(data, page, limit);
    return successResponse(res, result, 'Clients récupérés.');
  } catch (error) {
    console.error('Erreur getAll clients:', error);
    return errorResponse(res, 'Erreur lors de la récupération des clients.');
  }
};

/**
 * Détail d'un client avec ses dossiers et interactions
 * GET /api/clients/:id
 */
const getById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
        { model: Dossier, as: 'dossiers', order: [['created_at', 'DESC']] },
        { model: Interaction, as: 'interactions', order: [['date', 'DESC']], limit: 20 },
      ],
    });

    if (!client) {
      return errorResponse(res, 'Client introuvable.', 404);
    }

    return successResponse(res, { client }, 'Client récupéré.');
  } catch (error) {
    console.error('Erreur getById client:', error);
    return errorResponse(res, 'Erreur lors de la récupération du client.');
  }
};

/**
 * Création d'un client
 * POST /api/clients
 */
const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const { nom, prenom, email, telephone, adresse } = req.body;

    const client = await Client.create({ nom, prenom, email, telephone, adresse });

    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'CREATE_CLIENT',
      target_type: 'client',
      target_id: client.id,
      ip_address: req.ip,
      details: { nom: client.nom, prenom: client.prenom }
    });

    return successResponse(res, { client }, 'Client créé avec succès.', 201);
  } catch (error) {
    console.error('Erreur create client:', error);
    return errorResponse(res, 'Erreur lors de la création du client.');
  }
};

/**
 * Mise à jour d'un client
 * PUT /api/clients/:id
 */
const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return errorResponse(res, 'Client introuvable.', 404);
    }

    const { nom, prenom, email, telephone, adresse, statut_actif } = req.body;
    await client.update({ nom, prenom, email, telephone, adresse, statut_actif });

    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'UPDATE_CLIENT',
      target_type: 'client',
      target_id: client.id,
      ip_address: req.ip,
      details: { nom: client.nom, prenom: client.prenom, statut_actif: client.statut_actif }
    });

    return successResponse(res, { client }, 'Client mis à jour.');
  } catch (error) {
    console.error('Erreur update client:', error);
    return errorResponse(res, 'Erreur lors de la mise à jour du client.');
  }
};

/**
 * Suppression d'un client
 * DELETE /api/clients/:id
 */
const remove = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return errorResponse(res, 'Client introuvable.', 404);
    }

    await client.destroy();

    // Log action
    await auditService.logAction({
      user_id: req.user.id,
      action: 'DELETE_CLIENT',
      target_type: 'client',
      target_id: req.params.id,
      ip_address: req.ip,
      details: { nom: client.nom, prenom: client.prenom }
    });

    return successResponse(res, null, 'Client supprimé.');
  } catch (error) {
    console.error('Erreur remove client:', error);
    return errorResponse(res, 'Erreur lors de la suppression du client.');
  }
};

module.exports = { getAll, getById, create, update, remove };
