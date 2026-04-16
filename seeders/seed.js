require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Client, Dossier, Paiement, Interaction, Relance } = require('../models');

/**
 * Script de peuplement de la base de données avec des données de test
 * Usage : node seeders/seed.js
 */
const seed = async () => {
  try {
    console.log('🌱 Début du peuplement de la base...');

    // Sync (force = reset tables)
    await sequelize.sync({ force: true });
    console.log('✅ Tables recréées.');

    // ── Utilisateurs ──
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash('Admin123!', salt);

    const admin = await User.create({
      nom: 'Admin Suivlima',
      email: 'admin@suivlima.com',
      mot_de_passe_hash: hash,
      role: 'admin',
    });

    const commercial = await User.create({
      nom: 'Amadou Koné',
      email: 'amadou@suivlima.com',
      mot_de_passe_hash: hash,
      role: 'commercial',
    });

    console.log('✅ Utilisateurs créés.');

    // ── Clients ──
    const clients = await Client.bulkCreate([
      { nom: 'Diallo', prenom: 'Mamadou', email: 'mamadou.diallo@email.com', telephone: '+22370123456', adresse: 'Bamako, Mali' },
      { nom: 'Touré', prenom: 'Fatoumata', email: 'fatoumata.toure@email.com', telephone: '+22371234567', adresse: 'Bamako, Mali' },
      { nom: 'Coulibaly', prenom: 'Ousmane', email: 'ousmane.coulibaly@email.com', telephone: '+22372345678', adresse: 'Sikasso, Mali' },
      { nom: 'Traoré', prenom: 'Aïssata', email: 'aissata.traore@email.com', telephone: '+22373456789', adresse: 'Mopti, Mali' },
      { nom: 'Keïta', prenom: 'Ibrahim', email: 'ibrahim.keita@email.com', telephone: '+22374567890', adresse: 'Ségou, Mali' },
    ]);

    console.log('✅ Clients créés.');

    // ── Dossiers ──
    const dossiers = await Dossier.bulkCreate([
      { client_id: clients[0].id, titre: 'Création Entreprise SARL', description: 'Dossier de création d\'entreprise au Mali', statut: 'en_cours' },
      { client_id: clients[0].id, titre: 'Licence d\'importation', description: 'Demande de licence commerciale', statut: 'en_attente' },
      { client_id: clients[1].id, titre: 'Visa Business France', description: 'Visa court séjour affaires', statut: 'termine' },
      { client_id: clients[2].id, titre: 'Permis de construire', description: 'Construction bâtiment commercial', statut: 'relance_necessaire' },
      { client_id: clients[3].id, titre: 'Contrat de bail commercial', description: 'Rédaction et négociation bail', statut: 'en_cours' },
      { client_id: clients[4].id, titre: 'Immatriculation véhicule', description: 'Carte grise véhicule professionnel', statut: 'en_attente' },
    ]);

    console.log('✅ Dossiers créés.');

    // ── Paiements ──
    await Paiement.bulkCreate([
      { dossier_id: dossiers[0].id, montant: 250000, date_paiement: '2026-03-01', mode_paiement: 'mobile money', statut: 'paye', lien_paiement: 'https://pay.suivlima.com/pay/001' },
      { dossier_id: dossiers[0].id, montant: 150000, date_paiement: null, mode_paiement: 'virement', statut: 'non_paye', lien_paiement: 'https://pay.suivlima.com/pay/002' },
      { dossier_id: dossiers[1].id, montant: 100000, date_paiement: null, mode_paiement: null, statut: 'non_paye', lien_paiement: 'https://pay.suivlima.com/pay/003' },
      { dossier_id: dossiers[2].id, montant: 500000, date_paiement: '2026-02-15', mode_paiement: 'carte', statut: 'paye', lien_paiement: 'https://pay.suivlima.com/pay/004' },
      { dossier_id: dossiers[3].id, montant: 350000, date_paiement: null, mode_paiement: null, statut: 'non_paye', lien_paiement: 'https://pay.suivlima.com/pay/005' },
      { dossier_id: dossiers[4].id, montant: 200000, date_paiement: '2026-03-20', mode_paiement: 'espèces', statut: 'paye', lien_paiement: null },
    ]);

    console.log('✅ Paiements créés.');

    // ── Interactions ──
    await Interaction.bulkCreate([
      { client_id: clients[0].id, type_interaction: 'email', contenu: 'Envoi des documents pour la création d\'entreprise.', date: new Date('2026-03-01') },
      { client_id: clients[0].id, type_interaction: 'whatsapp', contenu: 'Rappel pour le complément de dossier.', date: new Date('2026-03-10') },
      { client_id: clients[1].id, type_interaction: 'app', contenu: 'Visa approuvé — notification client.', date: new Date('2026-02-20') },
      { client_id: clients[2].id, type_interaction: 'telephone', contenu: 'Appel pour demander les pièces manquantes.', date: new Date('2026-03-15') },
      { client_id: clients[3].id, type_interaction: 'email', contenu: 'Envoi du contrat de bail pour signature.', date: new Date('2026-03-18') },
    ]);

    console.log('✅ Interactions créées.');

    // ── Relances ──
    await Relance.bulkCreate([
      { dossier_id: dossiers[1].id, type_relance: 'email', date_programmee: new Date('2026-04-05'), statut: 'non_envoyee', message: 'Rappel paiement licence d\'importation.' },
      { dossier_id: dossiers[3].id, type_relance: 'whatsapp', date_programmee: new Date('2026-04-04'), statut: 'non_envoyee', message: 'Rappel paiement permis de construire.' },
      { dossier_id: dossiers[0].id, type_relance: 'email', date_programmee: new Date('2026-03-25'), statut: 'envoyee', message: 'Rappel complément de dossier.' },
    ]);

    console.log('✅ Relances créées.');

    console.log('\n🎉 Base de données peuplée avec succès !');
    console.log('📧 Admin: admin@suivlima.com / Admin123!');
    console.log('📧 Commercial: amadou@suivlima.com / Admin123!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    process.exit(1);
  }
};

seed();
