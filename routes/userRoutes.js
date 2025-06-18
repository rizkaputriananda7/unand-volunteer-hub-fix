// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/dashboard', userController.showMahasiswaDashboard);
router.get('/faq', userController.showFaqPage);
router.get('/pengumuman', userController.showPengumumanPage);
router.get('/pengumuman/:id', userController.showPengumumanDetailPage);
router.get('/bookmark', userController.showBookmarkPage);
router.post('/program/:id/bookmark', userController.addBookmark);
router.post('/bookmark/:id/delete', userController.deleteBookmark);

module.exports = router; // <-- PASTIKAN BARIS INI ADA