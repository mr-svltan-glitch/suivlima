const nodemailer = require('nodemailer');

/**
 * Service d'envoi d'emails
 * Utilise Nodemailer avec SendGrid (ou SMTP classique)
 */
class EmailService {
  constructor() {
    this.isMock = !process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your_sendgrid_api_key';
    
    if (!this.isMock) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else {
      console.log('⚠️  EmailService en mode MOCK. Les emails seront affichés dans la console.');
    }
  }

  /**
   * Envoie un email
   * @param {string} to - Adresse email du destinataire
   * @param {string} subject - Sujet
   * @param {string} html - Contenu HTML
   */
  async sendEmail(to, subject, html) {
    try {
      if (this.isMock) {
        console.log(`\n--- 📧 MOCK EMAIL ---`);
        console.log(`À      : ${to}`);
        console.log(`Sujet  : ${subject}`);
        console.log(`Contenu : [Contenu HTML de ${html.length} caractères]`);
        console.log(`---------------------\n`);
        return { success: true, messageId: `mock-${Date.now()}` };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@suivlima.com',
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email envoyé à ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Erreur envoi email à ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Email de relance pour un paiement
   */
  async sendPaymentReminder(client, dossier, paiement) {
    const subject = `Suivlima — Rappel de paiement pour le dossier "${dossier.titre}"`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #7C3AED); padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Suivlima</h1>
        </div>
        <div style="background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p>Bonjour <strong>${client.prenom} ${client.nom}</strong>,</p>
          <p>Nous vous rappelons qu'un paiement est en attente pour votre dossier :</p>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #2563EB; margin: 15px 0;">
            <p><strong>Dossier :</strong> ${dossier.titre}</p>
            <p><strong>Montant :</strong> ${paiement.montant} FCFA</p>
            <p><strong>Statut :</strong> En attente de paiement</p>
          </div>
          ${paiement.lien_paiement ? `
            <p style="text-align: center; margin: 25px 0;">
              <a href="${paiement.lien_paiement}" 
                 style="background: #2563EB; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Effectuer le paiement
              </a>
            </p>
          ` : ''}
          <p>Cordialement,<br><strong>L'équipe Suivlima</strong></p>
        </div>
      </div>
    `;

    return this.sendEmail(client.email, subject, html);
  }

  /**
   * Email de relance générique pour un dossier
   */
  async sendDossierReminder(client, dossier, customMessage) {
    const subject = `Suivlima — Mise à jour de votre dossier "${dossier.titre}"`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #7C3AED); padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Suivlima</h1>
        </div>
        <div style="background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p>Bonjour <strong>${client.prenom} ${client.nom}</strong>,</p>
          <p>${customMessage || 'Nous souhaitons vous informer d\'une mise à jour concernant votre dossier.'}</p>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #7C3AED; margin: 15px 0;">
            <p><strong>Dossier :</strong> ${dossier.titre}</p>
            <p><strong>Statut :</strong> ${dossier.statut}</p>
          </div>
          <p>Cordialement,<br><strong>L'équipe Suivlima</strong></p>
        </div>
      </div>
    `;

    return this.sendEmail(client.email, subject, html);
  }
}

module.exports = new EmailService();
