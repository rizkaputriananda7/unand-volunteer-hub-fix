/**
 * controllers/adminController.js (Diperbaiki)
 * * Semua logika Sequelize dan data statis telah dihapus.
 * * Placeholder untuk query SQL manual telah ditambahkan.
 * * Nama fungsi disesuaikan dengan file rute.
 */

// const db = require('../config/database'); // Akan digunakan nanti

/**
 * Fungsi untuk menampilkan dashboard admin beserta statistik ringkasan.
 */
exports.showDashboard = async (req, res) => {
    try {
        // TODO: Ganti dengan query SQL untuk mendapatkan statistik
        // Contoh:
        // const [userRows] = await db.query("SELECT COUNT(*) as totalUsers FROM users");
        // const [programRows] = await db.query("SELECT COUNT(*) as totalPrograms FROM program");
        // const stats = { totalUsers: userRows[0].totalUsers, totalPrograms: programRows[0].totalPrograms };
        
        const stats = {
            totalUsers: 0,
            totalPusat: 0,
            totalProgram: 0,
            totalPengumuman: 0
        };

        res.render('admin/dashboard', {
            title: 'Dashboard Admin',
            layout: 'layouts/main-layout-admin', // Pastikan nama layout ini benar
            stats: stats
        });
    } catch (error) {
        console.error("Error di showDashboard:", error);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
};

/**
 * Fungsi untuk menampilkan halaman Kelola Pengguna dengan fitur pencarian.
 */
exports.showUserManagement = async (req, res) => {
    try {
        const searchQuery = req.query.q || '';
        let users = [];

        // TODO: Ganti dengan query SQL manual untuk mencari pengguna
        // Contoh:
        // let query = "SELECT * FROM users";
        // const params = [];
        // if (searchQuery) {
        //     query += " WHERE nama LIKE ? OR nim_nip LIKE ?";
        //     params.push(`%${searchQuery}%`, `%${searchQuery}%`);
        // }
        // const [users] = await db.query(query, params);
        
        res.render('admin/user-management', { // Ganti nama view jika perlu, misal 'admin/manage-users'
            title: 'Kelola Pengguna',
            layout: 'layouts/main-layout-admin',
            users: users,
            searchQuery: searchQuery
        });
    } catch (error) {
        console.error("Error di showUserManagement:", error);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
};

/**
 * Fungsi untuk memproses aksi hapus pengguna.
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        // TODO: Tambahkan logika hapus user dengan SQL manual
        // Contoh:
        // await db.query("DELETE FROM users WHERE id = ?", [userId]);
        res.redirect('/admin/users');
    } catch (error) {
        console.error("Error di deleteUser:", error);
        res.status(500).send("Gagal menghapus pengguna.");
    }
};


/**
 * Fungsi untuk menampilkan halaman Kelola Pusat Volunteer.
 */
exports.showVCManagement = async (req, res) => {
    try {
        // TODO: Tambahkan logika untuk mengambil data pusat volunteer dari database
        // Contoh:
        // const [centers] = await db.query("SELECT * FROM volunteer_center");
        const volunteerCenters = [];

        res.render('admin/vc-management', { // Ganti nama view jika perlu, misal 'admin/manage-centers'
            title: 'Kelola Pusat Volunteer',
            layout: 'layouts/main-layout-admin',
            volunteerCenters: volunteerCenters
        });
    } catch (error) {
        console.error("Error di showVCManagement:", error);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
};

/**
 * Fungsi untuk memproses aksi hapus pusat volunteer.
 */
exports.deleteVC = async (req, res) => {
    try {
        const centerId = req.params.id;
        // TODO: Tambahkan logika hapus VC dengan SQL manual
        // Contoh:
        // await db.query("DELETE FROM volunteer_center WHERE id = ?", [centerId]);
        res.redirect('/admin/vc');
    } catch (error) {
        console.error("Error di deleteVC:", error);
        res.status(500).send("Gagal menghapus pusat volunteer.");
    }
};

/**
 * Fungsi untuk menampilkan halaman analitik.
 * CATATAN: Rute untuk ini perlu ditambahkan di `routes/adminRoutes.js`
 */
exports.showAnalyticsPage = async (req, res) => {
    try {
        // TODO: Tambahkan logika untuk mengambil data distribusi pendaftar per pusat
        // Contoh query bisa lebih kompleks, mungkin memerlukan JOIN
        // const query = `
        //     SELECT vc.nama, COUNT(p.id) as count
        //     FROM volunteer_center vc
        //     LEFT JOIN program pr ON vc.id = pr.pusat_id
        //     LEFT JOIN pendaftaran p ON pr.id = p.program_id
        //     GROUP BY vc.nama;
        // `;
        // const [results] = await db.query(query);
        // const distribution = results.reduce((acc, item) => {
        //     acc[item.nama] = item.count;
        //     return acc;
        // }, {});

        const distribution = {};

        res.render('admin/analytics', {
            title: 'Analitik',
            layout: 'layouts/main-layout-admin',
            distribution: distribution
        });
    } catch(error) {
        console.error("Error di showAnalyticsPage:", error);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
};