const router = require('express').Router();
const { getAll, create, update, remove } = require('../controllers/paiement.controller');
const authenticate = require('../middleware/auth.middleware');
const { paiementValidators, idParam } = require('../utils/validators');

router.use(authenticate);

// GET /api/paiements
router.get('/', getAll);

// POST /api/paiements
router.post('/', paiementValidators.create, create);

// PUT /api/paiements/:id
router.put('/:id', paiementValidators.update, update);

// DELETE /api/paiements/:id
router.delete('/:id', idParam, remove);

module.exports = router;
