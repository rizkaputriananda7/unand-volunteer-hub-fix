// routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Mengimpor controller yang akan menangani logika untuk halaman pengguna
const userController = require('../controllers/userController');

// Mendefinisikan rute untuk menampilkan dashboard mahasiswa
// Saat ada request GET ke URL '/dashboard', jalankan fungsi showMahasiswaDashboard
router.get('/dashboard', userController.showMahasiswaDashboard);

// (Nantinya, rute lain untuk mahasiswa seperti melihat profil, dll. bisa ditambahkan di sini)

module.exports = router;