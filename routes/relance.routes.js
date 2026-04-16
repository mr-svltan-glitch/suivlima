const router = require('express').Router();
const { getAll, create, update } = require('../controllers/relance.controller');
const authenticate = require('../middleware/auth.middleware');
const { relanceValidators, idParam } = require('../utils/validators');

router.use(authenticate);

// GET /api/relances
router.get('/', getAll);

// POST /api/relances
router.post('/', relanceValidators.create, create);

// PUT /api/relances/:id
router.put('/:id', relanceValidators.update, update);

module.exports = router;
