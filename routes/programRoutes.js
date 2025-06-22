const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const { authenticateToken, authorizeRole } = require('../utils/authUtils');
const upload = require('../utils/uploadMiddleware');

router.use(authenticateToken, authorizeRole('mahasiswa'));

router.get('/', programController.showAllPrograms);
router.get('/:id', programController.showProgramDetails);
router.get('/:id/daftar', programController.showAplikasiForm);

router.post('/:id/apply', upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'transkrip', maxCount: 1 },
    { name: 'ktm', maxCount: 1 }
]), programController.handleApplyToProgram);


module.exports = router;
