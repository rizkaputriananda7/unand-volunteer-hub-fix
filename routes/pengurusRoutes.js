// routes/pengurusRoutes.js

const express = require('express');
const router = express.Router();
const pengurusController = require('../controllers/pengurusController');

// Rute ini mengasumsikan semua logika program ada di pengurusController
// Jika beberapa ada di programController, sesuaikan require di atas dan pemanggilan di bawah

// Dashboard
router.get('/dashboard', pengurusController.showDashboard);

// Manajemen Program (CRUD)
router.get('/program/create', pengurusController.showCreateProgramForm);
router.post('/program/create', pengurusController.handleCreateProgram);
router.get('/program/:id/edit', pengurusController.showEditProgramForm);
router.post('/program/:id/update', pengurusController.handleUpdateProgram);
router.post('/program/:id/delete', pengurusController.handleDeleteProgram);

// Fitur Pengurus Lainnya
router.get('/seleksi', pengurusController.showSelectionManagement);
router.get('/jadwal', pengurusController.showJadwalPage);
router.post('/jadwal/create', pengurusController.handleCreateJadwal);
router.get('/komunikasi', pengurusController.showKomunikasiPage);
router.get('/statistik', pengurusController.showStatistikPage);


// Pastikan ini ada di baris paling akhir
module.exports = router;