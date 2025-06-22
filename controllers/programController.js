const Program = require("../models/Program");
const VolunteerCenter = require("../models/VolunteerCenter");
const Aplikasi = require("../models/Aplikasi");
const Bookmark = require("../models/Bookmark");

// Menampilkan semua program dengan filter lengkap
exports.showAllPrograms = async (req, res) => {
  try {
    // Ambil semua parameter filter dari query URL
    const { centerId, q: searchTerm, kategori, statusPendaftaran } = req.query;

    const filters = {
      centerId,
      searchTerm,
      kategori,
      statusPendaftaran,
    };

    const [programs, centers, bookmarkedIds] = await Promise.all([
      Program.findAll(filters), // Kirim semua filter ke model
      VolunteerCenter.findAll(),
      Bookmark.findBookmarkedProgramIds(req.user.id),
    ]);

    const programsWithBookmarkStatus = programs.map((program) => ({
      ...program,
      isBookmarked: bookmarkedIds.includes(program.id),
    }));

    res.render("mahasiswa/melihat-program-volunteer", {
      title: "Jelajahi Program",
      active: "program",
      programs: programsWithBookmarkStatus,
      centers,
      // Kirim kembali nilai filter ke view agar dropdown tetap pada pilihan pengguna
      selectedCenter: centerId,
      selectedKategori: kategori,
      selectedStatus: statusPendaftaran,
      searchQuery: searchTerm,
    });
  } catch (error) {
    console.error("Error menampilkan program:", error);
    res.status(500).send("Gagal memuat halaman program.");
  }
};

// Menampilkan halaman detail dari satu program
exports.showProgramDetails = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      // Jika program dengan ID tersebut tidak ada, tampilkan halaman 404
      return res.status(404).send("Program tidak ditemukan.");
    }

    // Cek apakah mahasiswa yang login sudah melamar program ini
    const hasApplied = await Aplikasi.hasApplied(req.user.id, program.id);

    // Cek apakah program sudah di-bookmark oleh mahasiswa
    let isBookmarked = false;
    if (req.user) {
      const bookmarkedIds = await Bookmark.findBookmarkedProgramIds(req.user.id);
      isBookmarked = bookmarkedIds.includes(program.id);
    }

    // Render view detail dengan data program, status lamaran, dan status bookmark
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

exports.handleApplyToProgram = async (req, res) => {
  try {
    const programId = req.params.id;
    const mahasiswaId = req.user?.id;

    // Cek lagi untuk mencegah pendaftaran ganda
    const hasApplied = await Aplikasi.hasApplied(mahasiswaId, programId);
    if (hasApplied) {
      // Jika sudah mendaftar, tetap render halaman konfirmasi dengan pesan khusus
      const program = await Program.findById(programId);
      return res.render("mahasiswa/konfirmasi-pendaftaran", {
        title: "Pendaftaran Sudah Pernah Dilakukan",
        active: "program",
        program: program,
        user: res.locals.user || { nama_lengkap: '-', nim: '-', email: '-' },
        sudahDaftar: true,
        errorMsg: null
      });
    }

    // Buat entri aplikasi baru di database
    await Aplikasi.create(mahasiswaId, programId, req.body);

    // Ambil kembali detail program yang baru dilamar untuk ditampilkan di halaman konfirmasi
    const program = await Program.findById(programId);

    // Ambil data pendaftar dari form (req.body), fallback ke profil jika kosong
    const pendaftar = {
      nama_lengkap: req.body.nama_lengkap || (res.locals.user?.nama_lengkap || '-'),
      nim: req.body.nim || (res.locals.user?.nim || '-'),
      email: req.body.email || (res.locals.user?.email || '-')
    };

    // Render halaman konfirmasi dengan data yang diperlukan
    res.render("mahasiswa/konfirmasi-pendaftaran", {
      title: "Pendaftaran Berhasil",
      active: "program",
      program: program,
      user: pendaftar,
      sudahDaftar: false,
      errorMsg: null
    });
  } catch (error) {
    console.error("Error saat mendaftar program:", error);
    res.status(500).render("mahasiswa/konfirmasi-pendaftaran", {
      title: "Terjadi Kesalahan",
      active: "program",
      program: {},
      user: res.locals.user || { nama_lengkap: '-', nim: '-', email: '-' },
      errorMsg: "Gagal mendaftar ke program. Silakan coba lagi nanti.",
      sudahDaftar: false
    });
  }
};

// Menampilkan form pendaftaran volunteer
exports.showFormPendaftaran = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).send("Program tidak ditemukan.");
    }
    // Data user bisa diambil dari res.locals.user jika sudah login
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
