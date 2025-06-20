// routes/pengurusRoutes.js
const express = require('express');
const router = express.Router();
const pengurusController = require('../controllers/pengurusController');

// Rute untuk dashboard pengurus
router.get('/dashboard', pengurusController.showDashboard);

module.exports = router; // <-- PASTIKAN BARIS INI ADA
