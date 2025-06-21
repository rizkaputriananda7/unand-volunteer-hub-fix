// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// --- AWAL TAMBAHAN ---
const authController = require('../controllers/authController'); // Impor authController

// Rute untuk menampilkan halaman login admin
router.get('/login', authController.showAdminLoginPage);

// Rute untuk menangani submit form login admin
router.post('/login', authController.handleAdminLogin);
// --- AKHIR TAMBAHAN ---

// Rute untuk dashboard admin
router.get('/dashboard', adminController.showDashboard);

// --- RUTE BARU UNTUK KELOLA PENGGUNA ---
// Halaman utama untuk melihat semua pengguna
router.get('/users', adminController.showUserManagementPage);

// Rute untuk menghapus akun mahasiswa
router.post('/users/mahasiswa/:id/delete', adminController.handleDeleteMahasiswa);

// Rute untuk menghapus akun pengurus
router.post('/users/pengurus/:id/delete', adminController.handleDeletePengurus);


// Rute lain yang mungkin sudah ada atau akan ditambahkan nanti
// router.get('/centers', adminController.showVCManagement);
// router.post('/centers/:id/delete', adminController.deleteVC);
// router.get('/analytics', adminController.showAnalyticsPage);


module.exports = router;