// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import controller yang relevan
const authController = require('../controllers/authController');

// Ketika ada request GET ke alamat utama ('/'),
// jalankan fungsi showRoleSelection dari authController
router.get('/', authController.showRoleSelection);

// Rute untuk menampilkan halaman login mahasiswa
router.get('/mahasiswa/login', authController.showMahasiswaLoginPage);
// Rute untuk menangani form login
router.post('/mahasiswa/login', authController.handleMahasiswaLogin);


module.exports = router;