/**
 * routes/programRoutes.js (Diperbaiki)
 * * Menyesuaikan nama fungsi controller dengan versi yang sudah tidak menggunakan Sequelize.
 * * Merapikan struktur rute agar lebih konsisten.
 */
const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

// ===================================
// RUTE UNTUK PENGURUS
// ===================================

// Menampilkan halaman dashboard/manajemen program untuk pengurus
// (Mengasumsikan ini adalah halaman utama untuk program bagi pengurus)
router.get('/pengurus/program', programController.getAllProgramsForPengurus);

// Menampilkan halaman form untuk membuat program baru
router.get('/pengurus/program/create', programController.showCreateProgramPage);

// Meng-handle data yang dikirim dari form pembuatan program
router.post('/pengurus/program/create', programController.handleCreateProgram);

// Meng-handle permintaan untuk mempublikasikan program
// Menggunakan metode POST atau PUT lebih cocok untuk aksi yang mengubah data
router.post('/pengurus/program/publish/:id', programController.publishProgram);


// ===================================
// RUTE UNTUK MAHASISWA & UMUM
// ===================================

// Rute untuk melihat detail sebuah program
// Rute ini bisa diakses oleh mahasiswa atau siapa saja
router.get('/program/:id', programController.getProgramDetail);

// RUTE PENCARIAN & LIST PROGRAM UNTUK MAHASISWA
router.get('/mahasiswa/program', require('../controllers/programController').searchProgramsForUser);

module.exports = router;