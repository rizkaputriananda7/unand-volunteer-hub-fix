// controllers/pengurusController.js

const Program = require('../models/Program');
// Kita akan menggunakan model lain nanti, untuk sekarang fokus ke Program
// const Jadwal = require('../models/Jadwal');

/**
 * Menampilkan dashboard pengurus.
 */
exports.showDashboard = async (req, res) => {
    try {
        // OPSI A: Membuat user dummy untuk simulasi login
        const dummyUser = {
            id: 1, // contoh id pengurus
            name: 'Pengurus Dummy',
            volunteer_center_id: 1 // asumsikan dia mengelola pusat volunteer dengan ID 1
        };

        // Menggunakan fungsi model yang baru untuk mengambil program
        const programs = await Program.findAllByCenter(dummyUser.volunteer_center_id);

        res.render('pengurus/dashboard', {
            title: 'Dashboard Pengurus',
            user: dummyUser, // Mengirim user dummy ke view
            programs: programs,
            // Statistik bisa dibuat dummy atau dihitung dari 'programs'
            stats: {
                totalPrograms: programs.length,
                totalApplicants: 0, // Placeholder
                pendingReviews: 0 // Placeholder
            }
        });
    } catch (error) {
        console.error("Error di showDashboard pengurus:", error);
        res.status(500).send("Terjadi kesalahan pada server");
    }
};

/**
 * Menampilkan form untuk membuat program baru.
 */
exports.showCreateProgramForm = (req, res) => {
    res.render('pengurus/create-program', {
        title: 'Buat Program Baru',
        user: { name: 'Pengurus Dummy' } // Kirim user dummy jika view butuh
    });
};

/**
 * Menangani pembuatan program baru.
 */
exports.handleCreateProgram = async (req, res) => {
    try {
        await Program.create(req.body);
        res.redirect('/pengurus/dashboard');
    } catch (error) {
        res.status(500).send("Gagal membuat program");
    }
};

/**
 * Menampilkan form untuk mengedit program.
 */
exports.showEditProgramForm = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        if (!program) {
            return res.status(404).send('Program tidak ditemukan');
        }
        res.render('pengurus/edit-program', {
            title: 'Edit Program',
            program: program,
            user: { name: 'Pengurus Dummy' } // Kirim user dummy
        });
    } catch (error) {
        res.status(500).send("Gagal memuat halaman edit");
    }
};

/**
 * Menangani pembaruan data program.
 */
exports.handleUpdateProgram = async (req, res) => {
    try {
        const success = await Program.update(req.params.id, req.body);
        if (success) {
            res.redirect('/mahasiswa/program/' + req.params.id);
        } else {
            res.status(404).send('Gagal memperbarui, program tidak ditemukan.');
        }
    } catch (error) {
        res.status(500).send("Gagal memperbarui program");
    }
};

/**
 * Menangani penghapusan program.
 */
exports.handleDeleteProgram = async (req, res) => {
    try {
        const success = await Program.deleteById(req.params.id);
        if (success) {
            res.redirect('/pengurus/dashboard');
        } else {
            res.status(404).send('Gagal menghapus, program tidak ditemukan.');
        }
    } catch (error) {
        res.status(500).send("Gagal menghapus program");
    }
};


// --- Fungsionalitas lain yang belum diimplementasikan sepenuhnya ---

exports.showSelectionManagement = (req, res) => {
    res.render('pengurus/seleksi', { title: 'Manajemen Seleksi', user: { name: 'Pengurus Dummy' } });
};

exports.showJadwalPage = (req, res) => {
    res.render('pengurus/jadwal', { title: 'Jadwal', user: { name: 'Pengurus Dummy' } });
};

exports.handleCreateJadwal = (req, res) => {
    res.redirect('/pengurus/jadwal');
};

exports.showKomunikasiPage = (req, res) => {
    res.render('pengurus/komunikasi', { title: 'Komunikasi', user: { name: 'Pengurus Dummy' } });
};

exports.showStatistikPage = (req, res) => {
    res.render('pengurus/statistik', { title: 'Statistik', user: { name: 'Pengurus Dummy' } });
};