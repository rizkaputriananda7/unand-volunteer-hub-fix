// controllers/adminController.js
const Mahasiswa = require('../models/Mahasiswa');
const Pengurus = require('../models/Pengurus');

// ... (fungsi showDashboard tetap sama)
exports.showDashboard = (req, res) => {
    const user = req.session.user || { nama_lengkap: 'Admin' };
    const stats = { totalUsers: 0, totalPusat: 0 };
    res.render('admin/dashboard', { title: 'Dashboard', user: user, stats: stats });
};

/**
 * FUNGSI YANG DIPERBARUI: Menyiapkan data gabungan untuk halaman manajemen pengguna.
 */
exports.showUserManagementPage = async (req, res) => {
    try {
        const allMahasiswa = await Mahasiswa.findAll();
        const allPengurus = await Pengurus.findAll();

        // 1. Gabungkan data mahasiswa ke dalam format yang diinginkan view
        const users = allMahasiswa.map(mhs => ({
            id: mhs.id,
            nama: mhs.nama_lengkap,
            nim_nip: mhs.nim,
            role: 'Mahasiswa',
            status: 'Aktif' // Status bisa dibuat dinamis nanti
        }));

        // 2. Gabungkan data pengurus ke dalam format yang sama
        allPengurus.forEach(p => {
            users.push({
                id: p.id,
                nama: p.nama_lengkap,
                nim_nip: p.username, // Menggunakan username sebagai pengganti NIP
                role: 'Pengurus',
                status: 'Aktif'
            });
        });
        
        // 3. Render view dengan satu array 'users'
        res.render('admin/manage-users', {
            title: 'Kelola Pengguna',
            user: req.session.user,
            users: users, // Mengirim satu array gabungan
            searchQuery: '' // Mengirim query pencarian kosong
        });
    } catch (error) {
        console.error("Error fetching users for admin:", error);
        res.status(500).send('Gagal memuat data pengguna.');
    }
};

// ... (fungsi handleDeleteMahasiswa dan handleDeletePengurus tetap sama)
exports.handleDeleteMahasiswa = async (req, res) => {
    try {
        await Mahasiswa.deleteById(req.params.id);
        res.redirect('/admin/users');
    } catch (error) {
        console.error("Error deleting mahasiswa:", error);
        res.status(500).send('Gagal menghapus akun mahasiswa.');
    }
};
exports.handleDeletePengurus = async (req, res) => {
    try {
        await Pengurus.deleteById(req.params.id);
        res.redirect('/admin/users');
    } catch (error) {
        console.error("Error deleting pengurus:", error);
        res.status(500).send('Gagal menghapus akun pengurus.');
    }
};