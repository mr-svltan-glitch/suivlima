const router = require('express').Router();
const {
  exportClientsPDF,
  exportClientsExcel,
  exportPaiementsPDF,
  exportPaiementsExcel,
  exportDashboardPDF,
} = require('../controllers/export.controller');
const authenticate = require('../middleware/auth.middleware');

router.use(authenticate);

// Clients
router.get('/clients/pdf', exportClientsPDF);
router.get('/clients/excel', exportClientsExcel);

// Paiements
router.get('/paiements/pdf', exportPaiementsPDF);
router.get('/paiements/excel', exportPaiementsExcel);

// Dashboard
router.get('/dashboard/pdf', exportDashboardPDF);

module.exports = router;
