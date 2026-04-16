const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/dossier.controller');
const authenticate = require('../middleware/auth.middleware');
const { dossierValidators, idParam } = require('../utils/validators');

router.use(authenticate);

// GET /api/dossiers
router.get('/', getAll);

// GET /api/dossiers/:id
router.get('/:id', idParam, getById);

// POST /api/dossiers
router.post('/', dossierValidators.create, create);

// PUT /api/dossiers/:id
router.put('/:id', dossierValidators.update, update);

// DELETE /api/dossiers/:id
router.delete('/:id', idParam, remove);

module.exports = router;
