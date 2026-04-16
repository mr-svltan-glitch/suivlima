const { body, query, param } = require('express-validator');

const authValidators = {
  register: [
    body('nom').trim().notEmpty().withMessage('Le nom est obligatoire.'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide.'),
    body('mot_de_passe')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
    body('role')
      .optional()
      .isIn(['admin', 'commercial', 'support'])
      .withMessage('Rôle invalide.'),
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide.'),
    body('mot_de_passe').notEmpty().withMessage('Le mot de passe est obligatoire.'),
  ],
};

const clientValidators = {
  create: [
    body('nom').trim().notEmpty().withMessage('Le nom est obligatoire.'),
    body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire.'),
    body('email').optional().isEmail().withMessage('Email invalide.'),
    body('telephone').optional().trim(),
    body('adresse').optional().trim(),
  ],
  update: [
    param('id').isUUID().withMessage('ID client invalide.'),
    body('nom').optional().trim().notEmpty(),
    body('prenom').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('statut_actif').optional().isBoolean(),
  ],
};

const dossierValidators = {
  create: [
    body('client_id').isUUID().withMessage('ID client invalide.'),
    body('titre').trim().notEmpty().withMessage('Le titre est obligatoire.'),
    body('description').optional().trim(),
    body('statut')
      .optional()
      .isIn(['en_attente', 'en_cours', 'termine', 'relance_necessaire'])
      .withMessage('Statut invalide.'),
  ],
  update: [
    param('id').isUUID().withMessage('ID dossier invalide.'),
    body('titre').optional().trim().notEmpty(),
    body('statut')
      .optional()
      .isIn(['en_attente', 'en_cours', 'termine', 'relance_necessaire']),
  ],
};

const paiementValidators = {
  create: [
    body('dossier_id').isUUID().withMessage('ID dossier invalide.'),
    body('montant')
      .isFloat({ min: 0 })
      .withMessage('Le montant doit être un nombre positif.'),
    body('mode_paiement').optional().trim(),
    body('date_paiement').optional().isISO8601(),
  ],
  update: [
    param('id').isUUID().withMessage('ID paiement invalide.'),
    body('statut').optional().isIn(['paye', 'non_paye']),
    body('montant').optional().isFloat({ min: 0 }),
  ],
};

const interactionValidators = {
  create: [
    body('client_id').isUUID().withMessage('ID client invalide.'),
    body('type_interaction')
      .isIn(['whatsapp', 'email', 'app', 'telephone', 'autre'])
      .withMessage('Type d\'interaction invalide.'),
    body('contenu').trim().notEmpty().withMessage('Le contenu est obligatoire.'),
  ],
};

const relanceValidators = {
  create: [
    body('dossier_id').isUUID().withMessage('ID dossier invalide.'),
    body('type_relance')
      .isIn(['whatsapp', 'email'])
      .withMessage('Type de relance invalide.'),
    body('date_programmee')
      .isISO8601()
      .withMessage('Date programmée invalide.'),
    body('message').optional().trim(),
  ],
  update: [
    param('id').isUUID().withMessage('ID relance invalide.'),
    body('statut')
      .optional()
      .isIn(['envoyee', 'non_envoyee', 'echouee']),
  ],
};

const idParam = [
  param('id').isUUID().withMessage('ID invalide.'),
];

module.exports = {
  authValidators,
  clientValidators,
  dossierValidators,
  paiementValidators,
  interactionValidators,
  relanceValidators,
  idParam,
};
