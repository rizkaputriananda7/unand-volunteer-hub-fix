// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// --- AWAL PERUBAHAN ---
// Hanya menangani halaman pemilihan peran
router.get('/', authController.showRoleSelection);

// Rute logout bisa ditambahkan di sini jika ingin global
router.get('/logout', authController.logout);
// --- AKHIR PERUBAHAN ---

module.exports = router;