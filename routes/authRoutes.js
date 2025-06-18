// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.showRoleSelection);

// Rute Mahasiswa
router.get('/mahasiswa/login', authController.showMahasiswaLoginPage);
router.post('/mahasiswa/login', authController.handleMahasiswaLogin);

// Rute Pengurus
router.get('/pengurus/login', authController.showPengurusLoginPage);
router.post('/pengurus/login', authController.handlePengurusLogin);

// --- RUTE BARU UNTUK LOGIN ADMIN ---
router.get('/admin/login', authController.showAdminLoginPage);
router.post('/admin/login', authController.handleAdminLogin);

module.exports = router; // <-- PASTIKAN BARIS INI ADA
