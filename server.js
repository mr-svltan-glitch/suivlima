require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const schedulerService = require('./services/scheduler.service');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// ── Routes ──
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const dossierRoutes = require('./routes/dossier.routes');
const paiementRoutes = require('./routes/paiement.routes');
const interactionRoutes = require('./routes/interaction.routes');
const relanceRoutes = require('./routes/relance.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const exportRoutes = require('./routes/export.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting : 100 requêtes par 15 minutes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de requêtes effectuées depuis cette IP, veuillez réessayer plus tard.'
  }
});

// Appliquer le limiter à toutes les routes /api
app.use('/api', limiter);

// ── Route de santé ──
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API Suivlima 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clients: '/api/clients',
      dossiers: '/api/dossiers',
      paiements: '/api/paiements',
      interactions: '/api/interactions',
      relances: '/api/relances',
      dashboard: '/api/dashboard',
      exports: '/api/export',
    },
  });
});

// ── Montage des routes ──
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/dossiers', dossierRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/relances', relanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);

// ── Gestion des erreurs 404 ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} introuvable.`,
  });
});

// ── Gestion globale des erreurs ──
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur.',
  });
});

// ── Démarrage ──
const startServer = async () => {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL établie.');

    // Sync des modèles
    await sequelize.sync();
    console.log('✅ Modèles synchronisés avec la base de données.');

    // Démarrer le scheduler de relances
    schedulerService.start();

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`\n🚀 Serveur Suivlima démarré sur http://localhost:${PORT}`);
      console.log(`📊 Dashboard : http://localhost:${PORT}/api/dashboard/stats`);
      console.log(`📋 API Docs  : http://localhost:${PORT}/\n`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

startServer();
