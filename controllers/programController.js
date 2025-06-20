// controllers/programController.js

// Ambil semua data DARI file pusat, termasuk array bookmark
const { programData, userData, bookmarkedPrograms } = require('../models/staticData');
const Program = require('../models/Program');

// Fungsi untuk menampilkan halaman program di SISI MAHASISWA
exports.showProgramPageForMahasiswa = (req, res) => {
    const { status, kategori, pusat } = req.query;
    let filteredPrograms = programData.filter(p => p.isPublished === true);

    if (status) { filteredPrograms = filteredPrograms.filter(p => p.status === status); }
    if (kategori) { filteredPrograms = filteredPrograms.filter(p => p.kategori === kategori); }
    if (pusat) { filteredPrograms = filteredPrograms.filter(p => p.pusat === pusat); }

    // Buat array ID dari state bookmark pusat yang diimpor
    const bookmarkedIds = bookmarkedPrograms.map(p => p.id);

    res.render('mahasiswa/program', {
        user: userData.mahasiswa,
        title: 'Program Volunteer',
        programs: filteredPrograms,
        bookmarkedIds: bookmarkedIds
    });
};

// --- FUNGSI UNTUK PENGURUS ---

// Fungsi untuk menampilkan halaman manajemen program di SISI PENGURUS
exports.showProgramPageForPengurus = (req, res) => {
    res.render('pengurus/program-management', {
        title: 'Manajemen Program',
        user: userData.pengurus,
        programs: programData
    });
};

// Fungsi untuk mempublikasikan program
exports.publishProgram = (req, res) => {
    const programToPublish = programData.find(p => p.id === parseInt(req.params.id));
    if (programToPublish) {
        programToPublish.isPublished = true;
    }
    res.redirect('/pengurus/program');
};

// Fungsi untuk MENAMPILKAN halaman form "Buat Program Baru"
exports.showCreateProgramPage = (req, res) => {
    res.render('pengurus/create-program', {
        title: 'Manajemen Program',
        user: userData.pengurus
    });
};

// Fungsi untuk MEMPROSES data dari form "Buat Program Baru"
exports.handleCreateProgram = (req, res) => {
    const { judul, pusat, deskripsi, kuota, durasi, persyaratan, manfaat, action } = req.body;
    const newProgram = {
        id: Date.now(),
        judul: judul || 'Program Baru',
        pusat: pusat || 'N/A',
        deskripsi: deskripsi || '',
        kuota: parseInt(kuota) || 0,
        durasi: durasi || 'N/A',
        persyaratan: persyaratan || '',
        manfaat: manfaat || '',
        status: 'Terbuka',
        kategori: 'Umum',
        isPublished: action === 'Publikasi Program'
    };
    programData.unshift(newProgram);
    res.redirect('/pengurus/dashboard');
};
// Menampilkan semua program volunteer
exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.findAll();
        // User didapat dari middleware otentikasi yang akan kita buat
        const user = req.user; 
        res.render('mahasiswa/melihat-program-volunteer', { programs, user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error mengambil data program.");
    }
};

// Menampilkan detail satu program
exports.getProgramDetails = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        if (!program) {
            return res.status(404).send("Program tidak ditemukan.");
        }
         const user = req.user;
        res.render('mahasiswa/detail-program_volunteer', { program, user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error mengambil detail program.");
    }
};