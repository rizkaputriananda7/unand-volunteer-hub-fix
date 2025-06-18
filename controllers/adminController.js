// controllers/adminController.js

// Ambil semua data yang kita butuhkan dari file data pusat
const { userData, programData, pengumumanData, allUsersData, pusatVolunteerData, registrationsData } = require('../models/staticData');

/**
 * Fungsi untuk menampilkan dashboard admin beserta statistik ringkasan.
 */
exports.showDashboard = (req, res) => {
    // Simulasi data statistik untuk admin
    const stats = {
        totalUsers: allUsersData.length,
        totalPusat: pusatVolunteerData.length,
        totalProgram: programData.length,
        totalPengumuman: pengumumanData.length
    };
    res.render('admin/dashboard', {
        title: 'Dashboard Admin',
        user: userData.admin, // Menggunakan data user admin
        stats: stats
    });
};

/**
 * Fungsi untuk memproses login admin
 */
exports.loginAdmin = (req, res) => {
    const { username, password } = req.body;
    
    // Verifikasi kredensial admin (gantilah dengan metode yang sesuai)
    if (username === 'admin' && password === 'adminpass') {  // Sesuaikan dengan kredensial yang valid
        req.session.isAdmin = true;  // Set session admin jika login berhasil
        res.redirect('/admin/dashboard');  // Redirect ke dashboard admin
    } else {
        res.redirect('/admin/login');  // Jika login gagal, kembali ke halaman login
    }
};

/**
 * Fungsi untuk menampilkan halaman Kelola Pengguna dengan fitur pencarian.
 */
exports.showUserManagementPage = (req, res) => {
    const searchQuery = req.query.q || '';
    let filteredUsers = allUsersData;

    // Jika ada query pencarian, filter data pengguna
    if (searchQuery) {
        filteredUsers = allUsersData.filter(user => 
            user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.nim_nip.includes(searchQuery)
        );
    }

    res.render('admin/manage-users', {
        title: 'Kelola Pengguna',
        user: userData.admin,
        users: filteredUsers,
        searchQuery: searchQuery
    });
};

/**
 * Fungsi untuk menampilkan halaman Kelola Pusat Volunteer.
 */
exports.showCenterManagementPage = (req, res) => {
    res.render('admin/manage-centers', {
        title: 'Kelola Pusat',
        user: userData.admin,
        centers: pusatVolunteerData
    });
};

/**
 * Fungsi untuk memproses aksi hapus pusat volunteer.
 */
exports.handleDeleteCenter = (req, res) => {
    const centerId = parseInt(req.params.id);
    
    // Cari index dari item yang akan dihapus
    const indexToDelete = pusatVolunteerData.findIndex(center => center.id === centerId);
    
    // Jika ditemukan, hapus 1 item pada index tersebut
    if (indexToDelete > -1) {
        pusatVolunteerData.splice(indexToDelete, 1);
    }
    
    // Redirect kembali ke halaman kelola pusat
    res.redirect('/admin/centers');
};

/**
 * Fungsi untuk menampilkan halaman analitik.
 */
exports.showAnalyticsPage = (req, res) => {
    const distribution = {};

    // Inisialisasi setiap pusat dengan 0 pendaftar
    pusatVolunteerData.forEach(center => {
        distribution[center.nama] = 0;
    });

    // Loop melalui setiap pendaftaran
    registrationsData.forEach(reg => {
        // Cari program yang sesuai dengan pendaftaran
        const program = programData.find(p => p.id === reg.programId);
        if (program) {
            // Jika pusat dari program tersebut ada di daftar distribusi kita, tambahkan hitungannya
            if (distribution.hasOwnProperty(program.pusat)) {
                distribution[program.pusat]++;
            }
        }
    });

    res.render('admin/analytics', {
        title: 'Analitik',
        user: userData.admin,
        distribution: distribution
    });
};

/**
 * Fungsi untuk memperbarui informasi pengguna
 */
exports.updateUserInfo = (req, res) => {
    const userId = req.params.id;  // Ambil ID pengguna
    const { username, email } = req.body;  // Ambil data dari form
    const user = allUsersData.find(user => user.id === userId);  // Temukan pengguna berdasarkan ID
    user.username = username;
    user.email = email;
    res.redirect('/admin/manage-users');  // Redirect ke halaman manajemen pengguna
};

/**
 * Fungsi untuk menghapus akun pengguna
 */
exports.deleteUserAccount = (req, res) => {
    const userId = req.params.id;
    allUsersData = allUsersData.filter(user => user.id !== userId);  // Hapus pengguna dari data
    res.redirect('/admin/manage-users');  // Redirect ke halaman manajemen pengguna
};

/**
 * Fungsi untuk menambah pusat volunteer
 */
exports.createCenter = (req, res) => {
    const { name, description } = req.body;
    const newCenter = { id: Date.now(), name, description };
    pusatVolunteerData.push(newCenter);  // Menambahkan pusat baru ke data
    res.redirect('/admin/manage-centers');  // Redirect ke halaman pusat volunteer
};

/**
 * Fungsi untuk mengedit informasi pusat volunteer
 */
exports.updateCenterInfo = (req, res) => {
    const centerId = req.params.id;
    const { name, description } = req.body;
    const center = pusatVolunteerData.find(center => center.id === centerId);
    center.name = name;
    center.description = description;
    res.redirect('/admin/manage-centers');
};

/**
 * Fungsi untuk membuat pengumuman
 */
exports.createAnnouncement = (req, res) => {
    const { title, content } = req.body;
    const newAnnouncement = { title, content, date: new Date() };
    pengumumanData.push(newAnnouncement);  // Menambahkan pengumuman baru ke data
    res.redirect('/admin/announcements');  // Redirect ke halaman pengumuman
};

/**
 * Fungsi untuk menghapus pengumuman
 */
exports.deleteAnnouncement = (req, res) => {
    const announcementId = req.params.id;
    pengumumanData = pengumumanData.filter(announcement => announcement.id !== announcementId);  // Hapus pengumuman
    res.redirect('/admin/announcements');  // Redirect ke halaman pengumuman
};

