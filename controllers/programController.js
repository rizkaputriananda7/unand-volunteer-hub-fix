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
    const mahasiswaId = req.user.id;

    // Cek lagi untuk mencegah pendaftaran ganda
    const hasApplied = await Aplikasi.hasApplied(mahasiswaId, programId);
    if (hasApplied) {
      // Jika sudah mendaftar, cukup arahkan kembali ke detail program
      return res.redirect(`/programs/${programId}`);
    }

    // Buat entri aplikasi baru di database
    await Aplikasi.create(mahasiswaId, programId);

    // Ambil kembali detail program yang baru dilamar untuk ditampilkan di halaman konfirmasi
    const program = await Program.findById(programId);

    // Render halaman konfirmasi dengan data yang diperlukan
    res.render("mahasiswa/konfirmasi-pendaftaran", {
      title: "Pendaftaran Berhasil",
      active: "program", // Sidebar tetap aktif di menu program
      program: program,
      // 'user' sudah otomatis tersedia dari res.locals
    });
  } catch (error) {
    console.error("Error saat mendaftar program:", error);
    res.status(500).send("Gagal mendaftar ke program. Silakan coba lagi.");
  }
};
