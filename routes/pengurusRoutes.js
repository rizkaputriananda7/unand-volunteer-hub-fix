const express = require('express');
const router = express.Router();
const pengurusController = require('../controllers/pengurusController');
const { authenticateToken, authorizeRole } = require('../utils/authUtils');
const upload = require('../utils/uploadMiddleware');

// Semua rute pengurus dilindungi oleh otentikasi dan role 'pengurus'
router.use(authenticateToken, authorizeRole('pengurus'));

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
router.get('/umpan-balik', pengurusController.showFeedbackPage);
router.get('/program/edit/:id', pengurusController.showEditProgramForm);
router.post('/program/edit/:id', pengurusController.handleUpdateProgram);
router.post('/program/delete/:id', pengurusController.handleDeleteProgram);
router.get('/program', pengurusController.showProgramListPage);
router.get('/jadwal/edit/:id', pengurusController.showEditJadwalForm);
router.post('/jadwal/edit/:id', pengurusController.handleUpdateJadwal);
router.post('/jadwal/delete/:id', pengurusController.handleDeleteJadwal);
router.get('/validasi', pengurusController.showDocumentValidation);
router.post('/validasi/update/:id', pengurusController.handleUpdateValidation);
router.get('/konten', pengurusController.showKontenPage);
router.get('/konten/tambah', pengurusController.showKontenForm);
router.post('/konten/tambah', upload.single('gambar_konten'), pengurusController.handleCreateKonten);
router.get('/konten/edit/:id', pengurusController.showEditKontenForm);
router.post('/konten/edit/:id', upload.single('gambar_konten'), pengurusController.handleUpdateKonten);
router.post('/konten/delete/:id', pengurusController.handleDeleteKonten);

module.exports = router;
