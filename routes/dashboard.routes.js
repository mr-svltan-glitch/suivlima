const router = require('express').Router();
const { getStats, getTopClients, getRelancesStats, getActivityLogs } = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

router.use(authenticate);

// GET /api/dashboard/stats
router.get('/stats', getStats);

// GET /api/dashboard/top-clients
router.get('/top-clients', getTopClients);

// GET /api/dashboard/relances-stats
router.get('/relances-stats', getRelancesStats);

// GET /api/dashboard/logs
router.get('/logs', getActivityLogs);

module.exports = router;
