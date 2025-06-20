const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const programController = require('../controllers/programController');

// 1. Dashboard
router.get('/dashboard', userController.showMahasiswaDashboard);

// 2. Program Volunteer
router.get('/program', userController.showProgramVolunteer);

// 3. Pendaftaran
router.get('/pendaftaran', userController.showPendaftaran);

// 4. Deadline
router.get('/deadline', userController.showDeadline);

// 5. Status Pendaftaran
router.get('/status', userController.showStatusPendaftaran);

// 6. Pengumuman
router.get('/pengumuman', userController.showPengumumanPage);
router.get('/pengumuman/:id', userController.showPengumumanDetailPage);

// 7. Kalender Pendaftaran
router.get('/kalender', userController.showKalenderPendaftaran);

// 8. Riwayat Pendaftaran
router.get('/riwayat', userController.showRiwayatPendaftaran);

// 9. FAQ
router.get('/faq', userController.showFaqPage);
router.get('/mahasiswa/status-pendaftaran', userController.getStatusPendaftaran);

// Bookmark Program
router.get('/bookmark', userController.showBookmarkPage);
router.post('/program/:id/bookmark', userController.addBookmark);
router.post('/bookmark/:id/delete', userController.deleteBookmark);

module.exports = router;