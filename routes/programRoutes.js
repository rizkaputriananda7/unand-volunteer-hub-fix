// routes/programRoutes.js
const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

// Rute untuk Mahasiswa melihat program yang sudah terbit
router.get('/mahasiswa/program', programController.showProgramPageForMahasiswa);

// Rute untuk Pengurus menampilkan form buat program
router.get('/pengurus/program/baru', programController.showCreateProgramPage);

// Rute untuk Pengurus mengirim data dari form buat program
router.post('/pengurus/program/baru', programController.handleCreateProgram);

// Rute untuk Pengurus mempublikasikan program (jika masih digunakan)
router.post('/pengurus/program/:id/publish', programController.publishProgram);


module.exports = router; // <-- PASTIKAN BARIS INI ADA
