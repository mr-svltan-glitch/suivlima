const { v4: uuidv4 } = require('uuid');

/**
 * Génère un lien de paiement unique
 */
const generatePaymentLink = (paiementId) => {
  const baseUrl = process.env.PAYMENT_BASE_URL || 'https://pay.suivlima.com';
  return `${baseUrl}/pay/${paiementId}`;
};

/**
 * Helper de pagination
 */
const getPagination = (page = 1, size = 20) => {
  const limit = Math.min(Math.max(+size, 1), 100);
  const offset = (Math.max(+page, 1) - 1) * limit;
  return { limit, offset };
};

/**
 * Format de réponse paginée
 */
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = +page || 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, items, totalPages, currentPage };
};

/**
 * Réponse standard succès
 */
const successResponse = (res, data, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Réponse standard erreur
 */
const errorResponse = (res, message = 'Erreur serveur', statusCode = 500, errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = {
  generatePaymentLink,
  getPagination,
  getPagingData,
  successResponse,
  errorResponse,
};
