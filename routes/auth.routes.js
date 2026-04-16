const router = require('express').Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');
const { authValidators } = require('../utils/validators');

// POST /api/auth/register
router.post('/register', authValidators.register, register);

// POST /api/auth/login
router.post('/login', authValidators.login, login);

// GET /api/auth/profile
router.get('/profile', authenticate, getProfile);

module.exports = router;
