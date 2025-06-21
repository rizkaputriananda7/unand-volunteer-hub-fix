const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../utils/authUtils');

router.use(authenticateToken, authorizeRole('admin'));

router.get('/dashboard', adminController.showDashboard);
router.get('/seleksi-overview', adminController.showSeleksiOverview);
router.get('/analitik-komprehensif', adminController.showAnalitikKomprehensif);
router.get('/umpan-balik', adminController.showFeedbackPage);


router.get('/manajemen-pusat', adminController.showCenterManagement);
router.get('/manajemen-pusat/tambah', adminController.showAddCenterForm);
router.post('/manajemen-pusat/tambah', adminController.handleAddCenter);
router.get('/manajemen-pusat/edit/:id', adminController.showEditCenterForm);
router.post('/manajemen-pusat/edit/:id', adminController.handleUpdateCenter);
router.post('/manajemen-pusat/delete/:id', adminController.handleDeleteCenter);

router.get('/manajemen-pengguna', adminController.showUserManagement);
router.get('/manajemen-pengguna/tambah', adminController.showUserForm);
router.post('/manajemen-pengguna/tambah', adminController.handleCreateUser);
router.get('/manajemen-pengguna/edit/:role/:id', adminController.showUserForm);
router.post('/manajemen-pengguna/edit/:role/:id', adminController.handleUpdateUser);
router.post('/manajemen-pengguna/status', adminController.handleUpdateUserStatus);
router.post('/manajemen-pengguna/delete', adminController.handleDeleteUser);

router.get('/log-pengumuman', adminController.showLogPengumuman);
router.get('/log-pengumuman/tambah', adminController.showPengumumanForm);
router.post('/log-pengumuman/tambah', adminController.handleCreatePengumuman);
router.get('/log-pengumuman/edit/:id', adminController.showPengumumanForm);
router.post('/log-pengumuman/edit/:id', adminController.handleUpdatePengumuman);

module.exports = router;
