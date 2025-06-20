/**
 * controllers/programController.js (Tanpa Sequelize)
 * * Semua dependensi ke Sequelize dan data statis telah dihapus.
 * * Fungsi-fungsi ini sekarang memiliki placeholder untuk query SQL manual.
 */

// Impor koneksi database (nantinya akan digunakan untuk query manual)
// const db = require('../config/database');

// --- FUNGSI UNTUK MAHASISWA ---

// Menampilkan semua program di halaman dashboard mahasiswa
exports.getAllProgramsForUser = async (req, res) => {
    try {
        // TODO: Ganti dengan query SQL manual untuk mengambil data program
        // Contoh:
        // const [programs] = await db.promise().query("SELECT * FROM program WHERE is_published = true");

        // Untuk sekarang, kita kirim array kosong agar halaman tidak error
        const programs = [];

        res.render('mahasiswa/dashboard', { // Atau view lain yang sesuai
            title: 'Dashboard',
            layout: 'layouts/main-layout',
            programs: programs,
            currentRoute: '/mahasiswa/dashboard'
        });
    } catch (error) {
        console.error("Error mengambil data program untuk mahasiswa:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

// Menampilkan detail satu program
exports.getProgramDetail = async (req, res) => {
    try {
        const programId = req.params.id;

        // TODO: Ganti dengan query SQL manual untuk mengambil satu program berdasarkan ID
        // Contoh:
        // const [rows] = await db.promise().query("SELECT * FROM program WHERE id = ?", [programId]);
        // const program = rows[0];

        // Untuk sekarang, kirim objek kosong
        const program = {};

        if (!program) {
            return res.status(404).send("Program tidak ditemukan.");
        }

        res.render('mahasiswa/detail-program', { // Atau view lain yang sesuai
            title: 'Detail Program',
            layout: 'layouts/main-layout',
            program: program,
            currentRoute: ''
        });
    } catch (error) {
        console.error("Error mengambil detail program:", error);
        res.status(500).send("Error mengambil detail program.");
    }
};


// --- FUNGSI UNTUK PENGURUS ---

// Menampilkan halaman manajemen program untuk pengurus
exports.getAllProgramsForPengurus = async (req, res) => {
    try {
        // TODO: Ganti dengan query SQL manual untuk mengambil semua program
        // Contoh:
        // const [programs] = await db.promise().query("SELECT * FROM program ORDER BY id DESC");
        const programs = [];

        res.render('pengurus/dashboard', { // Atau view 'pengurus/program-management'
            title: 'Manajemen Program',
            layout: 'layouts/main-layout-pengurus',
            programs: programs
        });
    } catch (error) {
        console.error("Error mengambil data program untuk pengurus:", error);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
};

// Menampilkan halaman form untuk membuat program baru
exports.showCreateProgramPage = (req, res) => {
    res.render('pengurus/create-program', {
        title: 'Buat Program Baru',
        layout: 'layouts/main-layout-pengurus'
    });
};

// Memproses data dari form pembuatan program
exports.handleCreateProgram = async (req, res) => {
    try {
        const { judul, pusat, deskripsi, kuota, durasi, persyaratan, manfaat, action } = req.body;
        const isPublished = action === 'Publikasi Program';

        // TODO: Ganti dengan query SQL manual untuk INSERT data
        // Contoh:
        // const query = "INSERT INTO program (judul, pusat, deskripsi, kuota, durasi, persyaratan, manfaat, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        // await db.promise().execute(query, [judul, pusat, deskripsi, kuota, durasi, persyaratan, manfaat, isPublished]);

        res.redirect('/pengurus/dashboard');
    } catch (error) {
        console.error("Error saat membuat program:", error);
        res.status(500).send("Gagal membuat program.");
    }
};

// Memproses publikasi program
exports.publishProgram = async (req, res) => {
    try {
        const programId = req.params.id;

        // TODO: Ganti dengan query SQL manual untuk UPDATE status publikasi
        // Contoh:
        // const query = "UPDATE program SET is_published = true WHERE id = ?";
        // await db.promise().execute(query, [programId]);

        res.redirect('/pengurus/dashboard');
    } catch (error) {
        console.error("Error saat mempublikasikan program:", error);
        res.status(500).send("Gagal mempublikasikan program.");
    }
};