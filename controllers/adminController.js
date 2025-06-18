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