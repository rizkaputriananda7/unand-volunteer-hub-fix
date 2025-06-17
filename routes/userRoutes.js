// routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Mengimpor controller yang akan menangani logika untuk halaman pengguna
const userController = require('../controllers/userController');

// Rute untuk menampilkan dashboard mahasiswa
router.get('/dashboard', userController.showMahasiswaDashboard);

// Rute untuk menampilkan halaman FAQ
router.get('/faq', userController.showFaqPage);

// Rute untuk menampilkan daftar Pengumuman
router.get('/pengumuman', userController.showPengumumanPage);

// Rute dinamis untuk menampilkan detail satu Pengumuman
router.get('/pengumuman/:id', userController.showPengumumanDetailPage);

// Rute untuk Halaman Program Volunteer (dengan filter)
router.get('/program', userController.showProgramPage);

// Rute untuk menampilkan halaman placeholder Bookmark
router.get('/bookmark', userController.showBookmarkPage);

module.exports = router;
