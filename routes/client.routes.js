const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/client.controller');
const authenticate = require('../middleware/auth.middleware');
const { clientValidators, idParam } = require('../utils/validators');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// GET /api/clients
router.get('/', getAll);

// GET /api/clients/:id
router.get('/:id', idParam, getById);

// POST /api/clients
router.post('/', clientValidators.create, create);

// PUT /api/clients/:id
router.put('/:id', clientValidators.update, update);

// DELETE /api/clients/:id
router.delete('/:id', idParam, remove);

module.exports = router;
