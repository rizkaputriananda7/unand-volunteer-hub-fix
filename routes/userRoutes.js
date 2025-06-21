const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// --- AWAL TAMBAHAN ---
const authController = require('../controllers/authController'); // Impor authController

// Rute untuk menampilkan halaman login mahasiswa
router.get('/login', authController.showMahasiswaLoginPage);

// Rute untuk menangani submit form login mahasiswa
router.post('/login', authController.handleMahasiswaLogin);
// --- AKHIR TAMBAHAN ---


// 1. Dashboard
// router.get('/dashboard', userController.showMahasiswaDashboard); // Duplikat
router.get('/dashboard', userController.showMahasiswaDashboard);

// 2. Program Volunteer
// (Belum ada fungsi program volunteer di userController, bisa tambahkan jika perlu)

// 3. Pendaftaran
router.get('/pendaftaran', userController.getHalamanPendaftaran);

// 4. Deadline
//router.get('/deadline', userController.getDeadline);

// 5. Status Pendaftaran
router.get('/status-pendaftaran', userController.getStatusPendaftaran);

// 6. Pengumuman
// (Belum ada fungsi pengumuman di userController, bisa tambahkan jika perlu)

// 7. Kalender Pendaftaran
router.get('/kalender', userController.getKalender);

// 8. Riwayat Pendaftaran
router.get('/riwayat-pendaftaran', userController.getRiwayatPendaftaran);

// 9. FAQ
// (Belum ada fungsi FAQ di userController, bisa tambahkan jika perlu)

// Bookmark Program
router.get('/bookmark', userController.getBookmark);
router.post('/program/:id/bookmark', userController.addBookmark);
router.post('/bookmark/:id/delete', userController.deleteBookmark);
// router.get('/mahasiswa/bookmark', userController.getBookmark); // Duplikat
router.post('/mahasiswa/program/:id/bookmark', userController.addBookmark);

// router.get('/mahasiswa/status-pendaftaran', userController.getStatusPendaftaran); // Duplikat

module.exports = router;