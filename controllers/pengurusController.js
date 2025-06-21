// controllers/pengurusController.js

const Program = require('../models/Program');
const Jadwal = require('../models/Jadwal'); // Impor model Jadwal
const Faq = require('../models/Faq');       // Impor model Faq

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
        // Anda mungkin perlu menambahkan volunteer_center_id dan coordinator_id dari sesi user
        const programData = { ...req.body, volunteer_center_id: 1, coordinator_id: 1 }; // Contoh
        await Program.create(programData);
        res.redirect('/pengurus/dashboard');
    } catch (error) {
        console.error("Gagal membuat program:", error);
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
            // Redirect ke detail program (jika ada) atau dashboard
            res.redirect('/pengurus/dashboard');
        } else {
            res.status(404).send('Gagal memperbarui, program tidak ditemukan.');
        }
    } catch (error) {
        console.error("Gagal memperbarui program:", error);
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
        console.error("Gagal menghapus program:", error);
        res.status(500).send("Gagal menghapus program");
    }
};

/**
 * FUNGSI BARU: Menampilkan halaman manajemen jadwal untuk suatu program.
 */
exports.showJadwalPage = async (req, res) => {
    try {
        const programId = req.params.programId;
        const program = await Program.findById(programId);
        const jadwal = await Jadwal.findByProgramId(programId);

        if (!program) {
            return res.status(404).send('Program tidak ditemukan.');
        }

        res.render('pengurus/jadwal', {
            title: `Jadwal untuk ${program.title}`,
            user: { name: 'Pengurus Dummy' },
            program: program,
            jadwal: jadwal
        });
    } catch (error) {
        console.error("Error menampilkan halaman jadwal:", error);
        res.status(500).send("Gagal memuat halaman jadwal.");
    }
};

/**
 * FUNGSI BARU: Menangani pembuatan jadwal baru.
 */
exports.handleCreateJadwal = async (req, res) => {
    const programId = req.params.programId;
    try {
        const jadwalData = { ...req.body, program_id: programId };
        await Jadwal.create(jadwalData);
        res.redirect(`/pengurus/program/${programId}/jadwal`);
    } catch (error) {
        console.error("Gagal membuat jadwal:", error);
        res.status(500).send("Gagal membuat jadwal baru.");
    }
};

/**
 * FUNGSI BARU: Menangani penghapusan jadwal.
 */
exports.handleDeleteJadwal = async (req, res) => {
    const { programId, jadwalId } = req.params;
    try {
        const success = await Jadwal.deleteById(jadwalId);
        if (!success) {
            return res.status(404).send('Gagal menghapus, jadwal tidak ditemukan.');
        }
        res.redirect(`/pengurus/program/${programId}/jadwal`);
    } catch (error) {
        console.error("Gagal menghapus jadwal:", error);
        res.status(500).send("Gagal menghapus jadwal.");
    }
};

/**
 * FUNGSI BARU: Menampilkan halaman manajemen FAQ.
 */
exports.showFaqManagementPage = async (req, res) => {
    try {
        const faqs = await Faq.findAll();
        res.render('pengurus/manage-faq', { // Pastikan Anda punya view 'manage-faq.ejs'
            title: 'Manajemen FAQ',
            user: { name: 'Pengurus Dummy' },
            faqs: faqs
        });
    } catch (error) {
        console.error("Error menampilkan halaman FAQ:", error);
        res.status(500).send("Gagal memuat halaman FAQ.");
    }
};

/**
 * FUNGSI BARU: Menangani pembuatan FAQ baru.
 */
exports.handleCreateFaq = async (req, res) => {
    try {
        await Faq.create(req.body);
        res.redirect('/pengurus/faq');
    } catch (error) {
        console.error("Gagal membuat FAQ:", error);
        res.status(500).send("Gagal membuat FAQ.");
    }
};

/**
 * FUNGSI BARU: Menangani penghapusan FAQ.
 */
exports.handleDeleteFaq = async (req, res) => {
    try {
        const success = await Faq.deleteById(req.params.id);
        if (!success) {
            return res.status(404).send('Gagal menghapus, FAQ tidak ditemukan.');
        }
        res.redirect('/pengurus/faq');
    } catch (error) {
        console.error("Gagal menghapus FAQ:", error);
        res.status(500).send("Gagal menghapus FAQ.");
    }
};


// --- Fungsionalitas lain yang belum diimplementasikan sepenuhnya ---

exports.showSelectionManagement = (req, res) => {
    // Anda perlu membuat view 'pengurus/seleksi.ejs'
    res.render('pengurus/seleksi', { title: 'Manajemen Seleksi', user: { name: 'Pengurus Dummy' } });
};

exports.showKomunikasiPage = (req, res) => {
    // Anda perlu membuat view 'pengurus/komunikasi.ejs'
    res.render('pengurus/komunikasi', { title: 'Komunikasi', user: { name: 'Pengurus Dummy' } });
};

exports.showStatistikPage = (req, res) => {
    // Anda perlu membuat view 'pengurus/statistik.ejs'
    res.render('pengurus/statistik', { title: 'Statistik', user: { name: 'Pengurus Dummy' } });
};