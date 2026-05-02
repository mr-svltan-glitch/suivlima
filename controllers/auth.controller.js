const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const { nom, email, mot_de_passe, role } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Cet email est déjà utilisé.', 409);
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(12);
    const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, salt);

    // Création
    const user = await User.create({
      nom,
      email,
      mot_de_passe_hash,
      role: role || 'commercial',
    });

    // Génération JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Génération Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    return successResponse(res, {
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    }, 'Inscription réussie.', 201);
  } catch (error) {
    console.error('Erreur register:', error);
    return errorResponse(res, 'Erreur lors de l\'inscription.');
  }
};

/**
 * Connexion
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Erreurs de validation.', 400, errors.array());
    }

    const { email, mot_de_passe } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Email ou mot de passe incorrect.', 401);
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);
    if (!isMatch) {
      return errorResponse(res, 'Email ou mot de passe incorrect.', 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Génération Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    return successResponse(res, {
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    }, 'Connexion réussie.');
  } catch (error) {
    console.error('Erreur login:', error);
    return errorResponse(res, 'Erreur lors de la connexion.');
  }
};

/**
 * Profil de l'utilisateur connecté
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    return successResponse(res, { user: req.user }, 'Profil récupéré.');
  } catch (error) {
    console.error('Erreur getProfile:', error);
    return errorResponse(res, 'Erreur lors de la récupération du profil.');
  }
};

/**
 * Rafraîchir le token JWT
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return errorResponse(res, 'Refresh token manquant.', 400);
    }

    // Vérifier le refresh token
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['mot_de_passe_hash'] },
    });

    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable.', 404);
    }

    // Générer un nouveau token d'accès
    const newToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Générer un nouveau refresh token
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    return successResponse(res, {
      token: newToken,
      refreshToken: newRefreshToken,
    }, 'Token rafraîchi.');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Refresh token expiré. Veuillez vous reconnecter.', 401);
    }
    console.error('Erreur refreshToken:', error);
    return errorResponse(res, 'Erreur lors du rafraîchissement du token.');
  }
};

module.exports = { register, login, getProfile, refreshToken };
