const express = require('express');
const router = express.Router();
const pengurusController = require('../controllers/pengurusController');

// Rute untuk setiap halaman pengurus
router.get('/dashboard', pengurusController.showDashboard);
router.get('/program/buat', pengurusController.showCreateProgramForm);
router.post('/program/buat', pengurusController.handleCreateProgram); // Menangani form submission
router.get('/seleksi', pengurusController.showSelectionManagement);
router.get('/validasi', pengurusController.showDocumentValidation);
router.get('/analitik', pengurusController.showAnalytics);
router.get('/jadwal', pengurusController.showJadwalPage);
router.get('/komunikasi', pengurusController.showKomunikasiPage);
router.get('/seleksi', pengurusController.showSelectionManagement);
router.post('/seleksi/:applicationId', pengurusController.updateSelectionStatus);
router.get('/jadwal', pengurusController.showJadwalPage);
router.post('/jadwal/tambah', pengurusController.handleCreateJadwal);
router.get('/komunikasi', pengurusController.showKomunikasiPage);
router.post('/komunikasi/kirim', pengurusController.handleKirimPengumuman);


module.exports = router;
