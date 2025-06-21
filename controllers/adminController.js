const Admin = require("../models/Admin");
const VolunteerCenter = require("../models/VolunteerCenter");
const Feedback = require('../models/Feedback');
const Mahasiswa = require('../models/Mahasiswa');
const Pengurus = require('../models/Pengurus');
const PengumumanGlobal = require('../models/PengumumanGlobal');

// Menampilkan halaman Dashboard Admin
exports.showDashboard = async (req, res) => {
    try {
        // Panggil fungsi baru dari model untuk mendapatkan semua data statistik
        const dashboardData = await Admin.getGlobalDashboardStats();

        res.render('admin/dashboard', { 
            title: 'Dashboard Admin',
            active: 'dashboard',
            stats: dashboardData, // Objek berisi semua statistik
            activities: dashboardData.recentActivities // Ambil aktivitas dari objek data
        });
    } catch (error) {
        console.error("Error memuat dashboard admin:", error);
        res.status(500).send("Gagal memuat dashboard Anda.");
    }
};

// Menampilkan halaman Manajemen Pengguna dengan logika pencarian
exports.showUserManagement = async (req, res) => {
  try {
    // Ambil kata kunci pencarian dari query URL (e.g., ?q=budi)
    const searchQuery = req.query.q || "";

    // Panggil model dengan kata kunci pencarian
    const users = await Admin.findAllUsers(searchQuery);

    res.render("admin/manajemen-pengguna", {
      title: "Manajemen Pengguna",
      active: "manajemen-pengguna",
      users: users,
      searchQuery: searchQuery, // Kirim kembali query untuk ditampilkan di kotak pencarian
      error: null,
    });
  } catch (error) {
    console.error("Error di showUserManagement:", error);
    res.status(500).render("admin/manajemen-pengguna", {
      title: "Error",
      active: "manajemen-pengguna",
      users: [],
      error: "Terjadi kesalahan saat mengambil data pengguna.",
    });
  }
};

// Fungsi baru untuk menangani penghapusan pengguna
exports.handleDeleteUser = async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (req.user.id == userId && req.user.role === role) {
            return res.redirect('/admin/manajemen-pengguna');
        }
        await Admin.deleteUser(userId, role);
        res.redirect('/admin/manajemen-pengguna');
    } catch (error) { res.status(500).send("Gagal menghapus pengguna."); }
};

// Menampilkan halaman Manajemen Pusat Volunteer dengan logika pencarian
exports.showCenterManagement = async (req, res) => {
    try {
        const searchQuery = req.query.q || '';
        const centers = await VolunteerCenter.findAll(searchQuery);
        res.render('admin/manajemen-pusat', {
            title: 'Manajemen Pusat', active: 'manajemen-pusat',
            centers, searchQuery
        });
    } catch (error) { res.status(500).send("Error memuat halaman."); }
};

// Menampilkan form untuk menambah pusat baru
exports.showAddCenterForm = (req, res) => {
    res.render('admin/form-pusat', {
        title: 'Tambah Pusat Baru', active: 'manajemen-pusat'
    });
};

// Memproses data dari form tambah pusat
exports.handleAddCenter = async (req, res) => {
    try {
        await VolunteerCenter.create(req.body);
        res.redirect('/admin/manajemen-pusat');
    } catch (error) { res.status(500).send("Gagal menambah pusat."); }
};

exports.showEditCenterForm = async (req, res) => {
    try {
        const center = await VolunteerCenter.findById(req.params.id);
        if (!center) return res.status(404).send("Pusat tidak ditemukan.");
        res.render('admin/form-pusat', {
            title: `Edit: ${center.nama_pusat}`, active: 'manajemen-pusat',
            center
        });
    } catch (error) { res.status(500).send("Gagal memuat form edit."); }
};

exports.handleUpdateCenter = async (req, res) => {
    try {
        await VolunteerCenter.update(req.params.id, req.body);
        res.redirect('/admin/manajemen-pusat');
    } catch (error) { res.status(500).send("Gagal memperbarui pusat."); }
};

exports.handleDeleteCenter = async (req, res) => {
    try {
        await VolunteerCenter.delete(req.params.id);
        res.redirect('/admin/manajemen-pusat');
    } catch (error) { res.status(500).send("Gagal menghapus pusat."); }
};

exports.showSeleksiOverview = async (req, res) => {
    try {
        // Panggil fungsi baru dari model untuk mendapatkan data overview
        const overviewData = await Admin.getSelectionOverviewStats();

        res.render('admin/seleksi-overview', { 
            title: 'Overview Seleksi',
            active: 'seleksi-overview',
            data: overviewData // Kirim seluruh objek data ke view
        });
    } catch (error) {
        console.error("Error memuat halaman overview seleksi:", error);
        res.status(500).send("Gagal memuat halaman.");
    }
};

exports.showAnalitikKomprehensif = async (req, res) => {
    try {
        // Panggil fungsi baru dari model untuk mendapatkan semua data analitik
        const analyticsData = await Admin.getComprehensiveAnalytics();

        res.render('admin/analitik-komprehensif', { 
            title: 'Analitik Komprehensif',
            active: 'analitik-komprehensif',
            data: analyticsData // Kirim seluruh objek data ke view
        });
    } catch (error) {
        console.error("Error memuat halaman analitik:", error);
        res.status(500).send("Gagal memuat halaman analitik.");
    }
};

exports.showFeedbackPage = async (req, res) => {
    try {
        const feedback = await Feedback.findGeneralFeedback();
        res.render('admin/lihat-umpan-balik', {
            title: 'Umpan Balik Umum',
            active: 'lihat-umpan-balik',
            feedback: feedback
        });
    } catch (error) {
        console.error("Error memuat umpan balik admin:", error);
        res.status(500).send("Gagal memuat halaman.");
    }
};
exports.showUserForm = async (req, res) => {
    try {
        const { role, id } = req.params;
        const centers = await VolunteerCenter.findAll();
        let pageData = { title: 'Tambah Pengguna', active: 'manajemen-pengguna', centers: centers || [] };

        if (id) {
            const userToEdit = await Admin.findUserByIdAndRole(id, role);
            if (!userToEdit) return res.status(404).send('Pengguna tidak ditemukan.');
            userToEdit.role = role;
            pageData.title = `Edit: ${userToEdit.nama_lengkap}`;
            pageData.userToEdit = userToEdit;
        }
        res.render('admin/form-pengguna', pageData);
    } catch (error) { res.status(500).send("Error memuat halaman form."); }
};

exports.handleCreateUser = async (req, res) => {
    try {
        switch (req.body.role) {
            case 'mahasiswa': await Mahasiswa.create(req.body); break;
            case 'pengurus': await Pengurus.create(req.body); break;
            case 'admin': await Admin.create(req.body); break;
        }
        res.redirect('/admin/manajemen-pengguna');
    } catch (error) { res.status(500).send("Gagal membuat pengguna."); }
};

exports.handleUpdateUser = async (req, res) => {
    try {
        const { role, id } = req.params;
        switch (role) {
            case 'mahasiswa': await Mahasiswa.update(id, req.body); break;
            case 'pengurus': await Pengurus.update(id, req.body); break;
            case 'admin': await Admin.update(id, req.body); break;
        }
        res.redirect('/admin/manajemen-pengguna');
    } catch (error) { res.status(500).send("Gagal memperbarui pengguna."); }
};

exports.handleUpdateUserStatus = async (req, res) => {
    try {
        const { userId, role, newStatus } = req.body;
        if (req.user.id == userId && req.user.role === role) {
            return res.redirect('/admin/manajemen-pengguna');
        }
        await Admin.updateUserStatus(userId, role, newStatus);
        res.redirect('/admin/manajemen-pengguna');
    } catch (error) { res.status(500).send("Gagal mengubah status."); }
};
// Menampilkan halaman Log Pengumuman
exports.showLogPengumuman = async (req, res) => {
    try {
        const announcements = await PengumumanGlobal.findAll();
        res.render('admin/log-pengumuman', {
            title: 'Log Pengumuman', active: 'log-pengumuman',
            announcements
        });
    } catch (error) { res.status(500).send("Error memuat halaman."); }
};

// Menampilkan form untuk tambah/edit pengumuman
exports.showPengumumanForm = async (req, res) => {
    try {
        let pageData = { title: 'Buat Pengumuman', active: 'log-pengumuman' };
        if (req.params.id) {
            const item = await PengumumanGlobal.findById(req.params.id);
            if (!item) return res.status(404).send("Pengumuman tidak ditemukan.");
            pageData.title = 'Edit Pengumuman';
            pageData.item = item;
        }
        res.render('admin/form-pengumuman-global', pageData);
    } catch (error) { res.status(500).send("Error memuat form."); }
};

// Menangani pembuatan pengumuman baru
exports.handleCreatePengumuman = async (req, res) => {
    try {
        await PengumumanGlobal.create(req.body, req.user.id);
        res.redirect('/admin/log-pengumuman');
    } catch (error) { res.status(500).send("Gagal membuat pengumuman."); }
};

// Menangani pembaruan pengumuman
exports.handleUpdatePengumuman = async (req, res) => {
    try {
        await PengumumanGlobal.update(req.params.id, req.body);
        res.redirect('/admin/log-pengumuman');
    } catch (error) { res.status(500).send("Gagal memperbarui pengumuman."); }
};

// Menangani penghapusan pengumuman
exports.handleDeletePengumuman = async (req, res) => {
    try {
        await PengumumanGlobal.delete(req.params.id);
        res.redirect('/admin/log-pengumuman');
    } catch (error) {
        res.status(500).send("Gagal menghapus pengumuman.");
    }
};