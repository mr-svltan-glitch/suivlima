/**
 * Service WhatsApp via Twilio API
 * Nécessite un compte Twilio avec WhatsApp Business activé
 */
class WhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    this.client = null;
    this.isMock = true;

    // Init Twilio uniquement si les credentials sont configurées
    if (this.accountSid && this.authToken && this.accountSid !== 'your_twilio_account_sid') {
      try {
        const twilio = require('twilio');
        this.client = twilio(this.accountSid, this.authToken);
        this.isMock = false;
        console.log('✅ WhatsApp (Twilio) service initialisé.');
      } catch (error) {
        console.warn('⚠️  Twilio non configuré. Le service WhatsApp est en mode MOCK.');
      }
    } else {
      console.log('⚠️  WhatsAppService en mode MOCK. Les messages seront affichés dans la console.');
    }
  }

  /**
   * Envoie un message WhatsApp
   * @param {string} to - Numéro au format international (ex: +22370000000)
   * @param {string} body - Message texte
   */
  async sendMessage(to, body) {
    if (this.isMock) {
      console.log(`\n--- 📱 MOCK WHATSAPP ---`);
      console.log(`À      : ${to}`);
      console.log(`Message: ${body}`);
      console.log(`------------------------\n`);
      return { success: true, sid: `mock-wa-${Date.now()}` };
    }

    if (!this.client) {
      return { success: false, error: 'WhatsApp non configuré.' };
    }

    try {
      const message = await this.client.messages.create({
        body,
        from: this.fromNumber,
        to: `whatsapp:${to}`,
      });

      console.log(`📱 WhatsApp envoyé à ${to}: ${message.sid}`);
      return { success: true, sid: message.sid };
    } catch (error) {
      console.error(`❌ Erreur WhatsApp à ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Message de relance paiement via WhatsApp
   */
  async sendPaymentReminder(client, dossier, paiement) {
    const body = `Bonjour ${client.prenom} ${client.nom} 👋\n\n` +
      `📋 *Suivlima — Rappel de paiement*\n\n` +
      `Dossier : *${dossier.titre}*\n` +
      `Montant : *${paiement.montant} FCFA*\n\n` +
      `${paiement.lien_paiement ? `🔗 Lien de paiement : ${paiement.lien_paiement}\n\n` : ''}` +
      `Merci de régulariser votre situation.\n\n` +
      `— L'équipe Suivlima`;

    return this.sendMessage(client.telephone, body);
  }

  /**
   * Message de relance générique dossier
   */
  async sendDossierReminder(client, dossier, customMessage) {
    const body = `Bonjour ${client.prenom} ${client.nom} 👋\n\n` +
      `📋 *Suivlima — Mise à jour dossier*\n\n` +
      `Dossier : *${dossier.titre}*\n` +
      `Statut : *${dossier.statut}*\n\n` +
      `${customMessage || 'Nous souhaitons vous contacter à propos de votre dossier.'}\n\n` +
      `— L'équipe Suivlima`;

    return this.sendMessage(client.telephone, body);
  }
}

module.exports = new WhatsAppService();
