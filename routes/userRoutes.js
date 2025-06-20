const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 1. Dashboard
router.get('/dashboard', userController.showMahasiswaDashboard);
router.get('/mahasiswa/dashboard', userController.showMahasiswaDashboard);

// 2. Program Volunteer
// (Belum ada fungsi program volunteer di userController, bisa tambahkan jika perlu)

// 3. Pendaftaran
// (Belum ada fungsi pendaftaran di userController, bisa tambahkan jika perlu)

// 4. Deadline
router.get('/deadline', userController.getDeadline);

// 5. Status Pendaftaran
router.get('/status', userController.getStatusPendaftaran);

// 6. Pengumuman
// (Belum ada fungsi pengumuman di userController, bisa tambahkan jika perlu)

// 7. Kalender Pendaftaran
router.get('/kalender', userController.getKalender);

// 8. Riwayat Pendaftaran
router.get('/riwayat', userController.getRiwayat);

// 9. FAQ
// (Belum ada fungsi FAQ di userController, bisa tambahkan jika perlu)

// Bookmark Program
router.get('/bookmark', userController.getBookmark);
router.post('/program/:id/bookmark', userController.addBookmark);
router.post('/bookmark/:id/delete', userController.deleteBookmark);
router.get('/mahasiswa/bookmark', userController.getBookmark);
router.post('/mahasiswa/program/:id/bookmark', userController.addBookmark);

router.get('/mahasiswa/status-pendaftaran', userController.getStatusPendaftaran);

module.exports = router;