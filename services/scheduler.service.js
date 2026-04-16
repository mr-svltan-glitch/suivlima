const cron = require('node-cron');
const { Op } = require('sequelize');
const { Relance, Dossier, Client, Paiement, Interaction } = require('../models');
const emailService = require('./email.service');
const whatsappService = require('./whatsapp.service');

/**
 * Service de planification des relances automatiques
 * Vérifie chaque heure les relances à envoyer
 */
class SchedulerService {
  start() {
    console.log('⏰ Scheduler de relances automatiques démarré.');

    // Chaque heure : vérifier les relances à envoyer
    cron.schedule('0 * * * *', async () => {
      console.log(`[${new Date().toISOString()}] Vérification des relances en attente...`);
      await this.processRelances();
    });

    // Chaque jour à 8h : vérifier les paiements en retard
    cron.schedule('0 8 * * *', async () => {
      console.log(`[${new Date().toISOString()}] Vérification des paiements en retard...`);
      await this.checkOverduePayments();
    });
  }

  /**
   * Traite les relances programmées dont la date est passée
   */
  async processRelances() {
    try {
      const relancesToSend = await Relance.findAll({
        where: {
          statut: 'non_envoyee',
          date_programmee: { [Op.lte]: new Date() },
        },
        include: [{
          model: Dossier,
          as: 'dossier',
          include: [{ model: Client, as: 'client' }],
        }],
      });

      console.log(`📬 ${relancesToSend.length} relance(s) à envoyer.`);

      for (const relance of relancesToSend) {
        const { dossier } = relance;
        const { client } = dossier;

        if (!client) {
          await relance.update({ statut: 'echouee' });
          continue;
        }

        let result = { success: false };

        if (relance.type_relance === 'email' && client.email) {
          result = await emailService.sendDossierReminder(client, dossier, relance.message);
        } else if (relance.type_relance === 'whatsapp' && client.telephone) {
          result = await whatsappService.sendDossierReminder(client, dossier, relance.message);
        }

        // Mettre à jour le statut de la relance
        await relance.update({
          statut: result.success ? 'envoyee' : 'echouee',
        });

        // Logger l'interaction
        if (result.success) {
          await Interaction.create({
            client_id: client.id,
            type_interaction: relance.type_relance,
            contenu: `Relance automatique pour le dossier "${dossier.titre}": ${relance.message || 'Rappel standard'}`,
            date: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur processRelances:', error);
    }
  }

  /**
   * Vérifie les paiements non payés et crée des relances automatiques
   */
  async checkOverduePayments() {
    try {
      const unpaidPayments = await Paiement.findAll({
        where: { statut: 'non_paye' },
        include: [{
          model: Dossier,
          as: 'dossier',
          include: [{ model: Client, as: 'client' }],
        }],
      });

      console.log(`💰 ${unpaidPayments.length} paiement(s) en retard détecté(s).`);

      for (const paiement of unpaidPayments) {
        const { dossier } = paiement;
        const { client } = dossier;

        if (!client) continue;

        // Vérifier qu'une relance n'existe pas déjà pour aujourd'hui
        const existingRelance = await Relance.findOne({
          where: {
            dossier_id: dossier.id,
            date_programmee: {
              [Op.gte]: new Date(new Date().toDateString()),
            },
            statut: 'non_envoyee',
          },
        });

        if (!existingRelance) {
          // Créer relance par email si email dispo, sinon WhatsApp
          const type = client.email ? 'email' : (client.telephone ? 'whatsapp' : null);
          if (type) {
            await Relance.create({
              dossier_id: dossier.id,
              type_relance: type,
              date_programmee: new Date(),
              message: `Rappel automatique : paiement de ${paiement.montant} FCFA en attente pour le dossier "${dossier.titre}".`,
            });
          }
        }
      }

      // Mettre à jour les dossiers concernés
      const dossierIds = [...new Set(unpaidPayments.map(p => p.dossier_id))];
      if (dossierIds.length > 0) {
        await Dossier.update(
          { statut: 'relance_necessaire' },
          { where: { id: dossierIds, statut: { [Op.ne]: 'termine' } } }
        );
      }
    } catch (error) {
      console.error('❌ Erreur checkOverduePayments:', error);
    }
  }
}

module.exports = new SchedulerService();
