// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/dashboard', userController.showMahasiswaDashboard);
router.get('/faq', userController.showFaqPage);
router.get('/pengumuman', userController.showPengumumanPage);
router.get('/pengumuman/:id', userController.showPengumumanDetailPage);

// Rute untuk Halaman Program Volunteer <-- RUTE BARU
router.get('/program', userController.showProgramPage);

module.exports = router;