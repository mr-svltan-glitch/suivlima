const router = require('express').Router();
const { getAll, create } = require('../controllers/interaction.controller');
const authenticate = require('../middleware/auth.middleware');
const { interactionValidators } = require('../utils/validators');

router.use(authenticate);

// GET /api/interactions
router.get('/', getAll);

// POST /api/interactions
router.post('/', interactionValidators.create, create);

module.exports = router;
