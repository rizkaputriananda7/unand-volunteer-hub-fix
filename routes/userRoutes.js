// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute yang sudah ada
router.get('/dashboard', userController.showMahasiswaDashboard);
router.get('/faq', userController.showFaqPage);
router.get('/pengumuman', userController.showPengumumanPage);
router.get('/pengumuman/:id', userController.showPengumumanDetailPage);
router.get('/program', userController.showProgramPage);
router.get('/bookmark', userController.showBookmarkPage);

// --- RUTE-RUTE BARU UNTUK AKSI BOOKMARK ---

// Rute untuk menambah bookmark (method: POST)
router.post('/program/:id/bookmark', userController.addBookmark);

// Rute untuk menghapus bookmark (method: POST)
router.post('/bookmark/:id/delete', userController.deleteBookmark);

module.exports = router;
