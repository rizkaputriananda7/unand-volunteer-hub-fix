const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');  // Perbaikan di sini

// Contoh route kosong
router.get('/', (req, res) => {
  res.send('Halaman admin');
});

// Halaman login admin
router.get('/login', (req, res) => {
    res.render('admin/login', { title: 'Login Admin' });
});

// Proses login admin
router.post('/login', adminController.loginAdmin);

// Halaman dashboard admin
router.get('/dashboard', adminController.showDashboard);

// Halaman kelola pengguna
router.get('/manage-users', adminController.showUserManagementPage);
router.post('/manage-users/update/:id', adminController.updateUserInfo);  // Update pengguna
router.get('/manage-users/delete/:id', adminController.deleteUserAccount);  // Hapus pengguna

// Halaman kelola pusat volunteer
router.get('/manage-centers', adminController.showCenterManagementPage);
router.post('/manage-centers/create', adminController.createCenter);  // Menambah pusat volunteer
router.post('/manage-centers/update/:id', adminController.updateCenterInfo);  // Edit pusat volunteer
router.get('/manage-centers/delete/:id', adminController.handleDeleteCenter);  // Hapus pusat volunteer

// Halaman pengumuman
router.get('/announcements', adminController.showAnnouncementsPage);  // Tampilkan pengumuman
router.post('/announcements/create', adminController.createAnnouncement);  // Menambah pengumuman
router.get('/announcements/delete/:id', adminController.deleteAnnouncement);  // Hapus pengumuman

// Halaman statistik dan analitik
router.get('/analytics', adminController.showAnalyticsPage);

module.exports = router;
