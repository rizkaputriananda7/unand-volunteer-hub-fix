// routes/pengurusRoutes.js

const express = require('express');
const router = express.Router();
const pengurusController = require('../controllers/pengurusController');
// --- AWAL TAMBAHAN ---
const authController = require('../controllers/authController'); // Impor authController

// Rute untuk menampilkan halaman login pengurus
router.get('/login', authController.showPengurusLoginPage);

// Rute untuk menangani submit form login pengurus
router.post('/login', authController.handlePengurusLogin);
// --- AKHIR TAMBAHAN ---


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

// Manajemen Jadwal
router.get('/program/:programId/jadwal', pengurusController.showJadwalPage);
router.post('/program/:programId/jadwal/create', pengurusController.handleCreateJadwal);
router.post('/program/:programId/jadwal/:jadwalId/delete', pengurusController.handleDeleteJadwal);

// --- RUTE BARU UNTUK MANAJEMEN FAQ ---
router.get('/faq', pengurusController.showFaqManagementPage);
router.post('/faq/create', pengurusController.handleCreateFaq);
router.post('/faq/:id/delete', pengurusController.handleDeleteFaq);
// Rute untuk update FAQ bisa ditambahkan di sini nanti

// Fitur Pengurus Lainnya (yang belum diimplementasi penuh)
router.get('/seleksi', pengurusController.showSelectionManagement);
// router.get('/jadwal', pengurusController.showJadwalPage); // Duplikat, sudah ada di atas
// router.post('/jadwal/create', pengurusController.handleCreateJadwal); // Duplikat, sudah ada di atas
router.get('/komunikasi', pengurusController.showKomunikasiPage);
router.get('/statistik', pengurusController.showStatistikPage);


// Pastikan ini ada di baris paling akhir
module.exports = router;