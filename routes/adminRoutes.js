// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rute untuk dashboard admin
router.get('/dashboard', adminController.showDashboard);

// Rute untuk kelola pengguna
router.get('/users', adminController.showUserManagement);

// --- RUTE BARU UNTUK KELOLA PUSAT VOLUNTEER ---
router.get('/centers', adminController.showVCManagement);
router.post('/centers/:id/delete', adminController.deleteVC);

router.get('/analytics', adminController.showAnalyticsPage);

module.exports = router;