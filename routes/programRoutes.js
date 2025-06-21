const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const { authenticateToken, authorizeRole } = require('../utils/authUtils');

router.use(authenticateToken, authorizeRole('mahasiswa'));
router.get('/', programController.showAllPrograms);
router.get('/:id', programController.showProgramDetails);
router.post('/:id/apply', programController.handleApplyToProgram);

module.exports = router;