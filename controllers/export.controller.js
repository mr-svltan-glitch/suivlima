const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Client, Dossier, Paiement } = require('../models');
const { Op } = require('sequelize');
const { errorResponse } = require('../utils/helpers');

/**
 * Export liste clients en PDF
 * GET /api/export/clients/pdf
 */
const exportClientsPDF = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [['nom', 'ASC']],
      include: [{ model: Dossier, as: 'dossiers', attributes: ['id', 'titre', 'statut'] }],
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=clients_suivlima.pdf');
    doc.pipe(res);

    // En-tête
    doc.fontSize(20).text('Suivlima — Liste des Clients', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.moveDown(2);

    // Contenu
    clients.forEach((client, index) => {
      doc.fontSize(12).text(`${index + 1}. ${client.nom} ${client.prenom}`, { underline: true });
      doc.fontSize(10)
        .text(`   Email : ${client.email || 'N/A'}`)
        .text(`   Téléphone : ${client.telephone || 'N/A'}`)
        .text(`   Statut : ${client.statut_actif ? 'Actif' : 'Inactif'}`)
        .text(`   Dossiers : ${client.dossiers.length}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Erreur export clients PDF:', error);
    return errorResponse(res, 'Erreur lors de l\'export PDF.');
  }
};

/**
 * Export liste clients en Excel
 * GET /api/export/clients/excel
 */
const exportClientsExcel = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [['nom', 'ASC']],
      include: [{ model: Dossier, as: 'dossiers', attributes: ['id'] }],
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Suivlima';
    const sheet = workbook.addWorksheet('Clients');

    sheet.columns = [
      { header: 'Nom', key: 'nom', width: 20 },
      { header: 'Prénom', key: 'prenom', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Téléphone', key: 'telephone', width: 18 },
      { header: 'Adresse', key: 'adresse', width: 30 },
      { header: 'Statut', key: 'statut', width: 12 },
      { header: 'Nb Dossiers', key: 'nb_dossiers', width: 14 },
      { header: 'Date Création', key: 'date_creation', width: 16 },
    ];

    // Style header
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };

    clients.forEach((client) => {
      sheet.addRow({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email || '',
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        statut: client.statut_actif ? 'Actif' : 'Inactif',
        nb_dossiers: client.dossiers.length,
        date_creation: client.created_at
          ? new Date(client.created_at).toLocaleDateString('fr-FR')
          : '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=clients_suivlima.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erreur export clients Excel:', error);
    return errorResponse(res, 'Erreur lors de l\'export Excel.');
  }
};

/**
 * Export rapport paiements en PDF
 * GET /api/export/paiements/pdf
 */
const exportPaiementsPDF = async (req, res) => {
  try {
    const { date_debut, date_fin } = req.query;
    const where = {};
    if (date_debut && date_fin) {
      where.date_paiement = { [Op.between]: [date_debut, date_fin] };
    }

    const paiements = await Paiement.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{
        model: Dossier,
        as: 'dossier',
        attributes: ['titre'],
        include: [{ model: Client, as: 'client', attributes: ['nom', 'prenom'] }],
      }],
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=paiements_suivlima.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Suivlima — Rapport des Paiements', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.moveDown(2);

    let totalPaye = 0;
    let totalNonPaye = 0;

    paiements.forEach((p, index) => {
      const clientName = p.dossier?.client
        ? `${p.dossier.client.nom} ${p.dossier.client.prenom}`
        : 'N/A';
      const dossierName = p.dossier?.titre || 'N/A';

      doc.fontSize(10)
        .text(`${index + 1}. Client: ${clientName} | Dossier: ${dossierName}`)
        .text(`   Montant: ${p.montant} | Statut: ${p.statut} | Mode: ${p.mode_paiement || 'N/A'}`);
      doc.moveDown(0.5);

      if (p.statut === 'paye') totalPaye += parseFloat(p.montant);
      else totalNonPaye += parseFloat(p.montant);
    });

    doc.moveDown(2);
    doc.fontSize(12)
      .text(`Total payé : ${totalPaye.toFixed(2)}`, { underline: true })
      .text(`Total impayé : ${totalNonPaye.toFixed(2)}`);

    doc.end();
  } catch (error) {
    console.error('Erreur export paiements PDF:', error);
    return errorResponse(res, 'Erreur lors de l\'export PDF des paiements.');
  }
};

/**
 * Export rapport paiements en Excel
 * GET /api/export/paiements/excel
 */
const exportPaiementsExcel = async (req, res) => {
  try {
    const { date_debut, date_fin } = req.query;
    const where = {};
    if (date_debut && date_fin) {
      where.date_paiement = { [Op.between]: [date_debut, date_fin] };
    }

    const paiements = await Paiement.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{
        model: Dossier,
        as: 'dossier',
        attributes: ['titre'],
        include: [{ model: Client, as: 'client', attributes: ['nom', 'prenom'] }],
      }],
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Suivlima';
    const sheet = workbook.addWorksheet('Paiements');

    sheet.columns = [
      { header: 'Client', key: 'client', width: 25 },
      { header: 'Dossier', key: 'dossier', width: 25 },
      { header: 'Montant', key: 'montant', width: 15 },
      { header: 'Statut', key: 'statut', width: 12 },
      { header: 'Mode', key: 'mode', width: 15 },
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Lien Paiement', key: 'lien', width: 40 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } };

    paiements.forEach((p) => {
      sheet.addRow({
        client: p.dossier?.client
          ? `${p.dossier.client.nom} ${p.dossier.client.prenom}`
          : 'N/A',
        dossier: p.dossier?.titre || 'N/A',
        montant: parseFloat(p.montant),
        statut: p.statut,
        mode: p.mode_paiement || '',
        date: p.date_paiement || '',
        lien: p.lien_paiement || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=paiements_suivlima.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erreur export paiements Excel:', error);
    return errorResponse(res, 'Erreur lors de l\'export Excel des paiements.');
  }
};

/**
 * Export dashboard en PDF
 * GET /api/export/dashboard/pdf
 */
const exportDashboardPDF = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const caMensuel = (await Paiement.sum('montant', {
      where: { statut: 'paye', date_paiement: { [Op.gte]: startOfMonth } },
    })) || 0;

    const caAnnuel = (await Paiement.sum('montant', {
      where: { statut: 'paye', date_paiement: { [Op.gte]: startOfYear } },
    })) || 0;

    const totalClients = await Client.count();
    const totalDossiers = await Dossier.count();
    const paiementsEnRetard = await Paiement.count({ where: { statut: 'non_paye' } });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard_suivlima.pdf');
    doc.pipe(res);

    doc.fontSize(22).text('Suivlima — Rapport Dashboard', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Généré le : ${now.toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.moveDown(2);

    doc.fontSize(14).text('Indicateurs Clés', { underline: true });
    doc.moveDown();
    doc.fontSize(12)
      .text(`CA Mensuel : ${caMensuel.toFixed(2)} FCFA`)
      .text(`CA Annuel : ${caAnnuel.toFixed(2)} FCFA`)
      .text(`Nombre de Clients : ${totalClients}`)
      .text(`Nombre de Dossiers : ${totalDossiers}`)
      .text(`Paiements en Retard : ${paiementsEnRetard}`);

    doc.end();
  } catch (error) {
    console.error('Erreur export dashboard PDF:', error);
    return errorResponse(res, 'Erreur lors de l\'export du dashboard.');
  }
};

module.exports = {
  exportClientsPDF,
  exportClientsExcel,
  exportPaiementsPDF,
  exportPaiementsExcel,
  exportDashboardPDF,
};
