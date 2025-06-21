const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rute untuk halaman utama yang menampilkan pilihan peran
router.get('/', authController.showRolePage);

module.exports = router;    