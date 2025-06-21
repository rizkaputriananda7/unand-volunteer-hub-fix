const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../utils/authUtils');

// Rute dashboard, dilindungi oleh otentikasi dan otorisasi peran
router.get('/mahasiswa/dashboard', authenticateToken, authorizeRole('mahasiswa'), userController.getMahasiswaDashboard);
router.get('/admin/dashboard', authenticateToken, authorizeRole('admin'), userController.getAdminDashboard);
router.get('/pengurus/dashboard', authenticateToken, authorizeRole('pengurus'), userController.getPengurusDashboard);

// Tambahkan rute lain yang spesifik untuk user di sini

module.exports = router;