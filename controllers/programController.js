const Program = require("../models/Program");
const VolunteerCenter = require("../models/VolunteerCenter");
const Aplikasi = require("../models/Aplikasi");
const Bookmark = require("../models/Bookmark");
const upload = require('../utils/uploadMiddleware');

// Menampilkan semua program dengan filter lengkap
exports.showAllPrograms = async (req, res) => {
  try {
    // Parameter 'mahasiswa' dihapus dari sini
    const { centerId, q: searchTerm, kategori, status } = req.query;

    const filters = {
      centerId,
      searchTerm,
      kategori,
      status, 
    };

    const [programs, centers, bookmarkedIds] = await Promise.all([
      // Pemanggilan ke findAll sekarang lebih sederhana, tanpa 'req.user'
      Program.findAll(filters), 
      VolunteerCenter.findAll(),
      req.user ? Bookmark.findBookmarkedProgramIds(req.user.id) : []
    ]);

    const programsWithBookmarkStatus = programs.map((program) => ({
      ...program,
      isBookmarked: bookmarkedIds.includes(program.id),
    }));

    // Nilai 'selectedMahasiswa' dihapus dari data yang dikirim ke view
    res.render("mahasiswa/melihat-program-volunteer", {
      title: "Jelajahi Program",
      active: "program",
      programs: programsWithBookmarkStatus,
      centers,
      selectedCenter: centerId,
      selectedKategori: kategori,
      selectedStatus: status,
      searchQuery: searchTerm,
    });
  } catch (error) {
    console.error("Error menampilkan program:", error);
    res.status(500).send("Gagal memuat halaman program.");
  }
};


// ... (Fungsi lainnya tetap sama) ...
exports.showProgramDetails = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).send("Program tidak ditemukan.");
    }
    const hasApplied = await Aplikasi.hasApplied(req.user.id, program.id);
    let isBookmarked = false;
    if (req.user) {
      const bookmarkedIds = await Bookmark.findBookmarkedProgramIds(req.user.id);
      isBookmarked = bookmarkedIds.includes(program.id);
    }
    res.render("mahasiswa/detail-program-volunteer", {
      title: program.title,
      active: "program",
      program: program,
      hasApplied: hasApplied,
      isBookmarked: isBookmarked,
    });
  } catch (error) {
    console.error("Error menampilkan detail program:", error);
    res.status(500).send("Gagal memuat halaman detail.");
  }
};

exports.showAplikasiForm = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        if (!program) return res.status(404).send('Program tidak ditemukan.');
        
        const hasApplied = await Aplikasi.hasApplied(req.user.id, program.id);
        if (hasApplied) return res.redirect(`/programs/${program.id}`);
        
        res.render('mahasiswa/form-pendaftaran', {
            title: `Daftar: ${program.title}`,
            active: 'program',
            program
        });
    } catch (error) { res.status(500).send("Gagal memuat halaman pendaftaran."); }
};

exports.handleApplyToProgram = async (req, res) => {
    try {
        const programId = req.params.id;
        const mahasiswaId = req.user.id;
        console.log('FILES:', req.files);
        console.log('BODY:', req.body);
        const hasApplied = await Aplikasi.hasApplied(mahasiswaId, programId);
        if (hasApplied) {
            return res.redirect(`/programs/${programId}`);
        }
        const applicationData = {
            mahasiswaId: mahasiswaId,
            programId: programId,
            motivasi: req.body.motivasi,
            files: req.files
        };
        await Aplikasi.create(applicationData);
        const program = await Program.findById(programId);
        res.render("mahasiswa/konfirmasi-pendaftaran", {
            title: "Pendaftaran Berhasil",
            active: "program",
            program: program,
            errorMsg: null,
            sudahDaftar: false,
            user: res.locals.user
        });
    } catch (error) {
        console.error("Error saat mendaftar program:", error);
        res.status(500).send("Gagal memproses pendaftaran Anda. Silakan cek kembali file yang diupload dan pastikan format serta ukuran sudah benar.");
    }
};

exports.showFormPendaftaran = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).send("Program tidak ditemukan.");
    }
    const user = res.locals.user || {};
    res.render("mahasiswa/form-pendaftaran", {
      title: `Pendaftaran Program Volunteer`,
      active: "program",
      program,
      user
    });
  } catch (error) {
    console.error("Error menampilkan form pendaftaran:", error);
    res.status(500).send("Gagal memuat form pendaftaran.");
  }
};