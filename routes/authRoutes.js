const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rute untuk menampilkan halaman
router.get('/register', authController.showRegisterPage);
router.get('/login', authController.showLoginPage);

// Rute untuk memproses form
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;