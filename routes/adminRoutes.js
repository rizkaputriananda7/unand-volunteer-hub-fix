// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/adminController');

// Contoh route kosong
router.get('/', (req, res) => {
  res.send('Halaman admin');
});

module.exports = router;