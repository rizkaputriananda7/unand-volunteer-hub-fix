const Program = require("../models/Program");
const Aplikasi = require("../models/Aplikasi");
const Jadwal = require("../models/Jadwal");
const Pengumuman = require("../models/Pengumuman");
const Feedback = require('../models/Feedback');
const Dokumen = require('../models/Dokumen');
const Konten = require('../models/Konten');
const upload = require('../utils/uploadMiddleware');

exports.showDashboard = async (req, res) => {
    try {
        const centerId = req.user.volunteer_center_id;

        // Ambil data statistik dan aktivitas terbaru secara paralel
        const [stats, recentActivities] = await Promise.all([
            Aplikasi.getStatisticsForCenter(centerId),
            Aplikasi.findRecentActivities(centerId, 5) // Ambil 5 aktivitas terbaru
        ]);
        
        res.render('pengurus/dashboard', { 
            title: 'Dashboard Pengurus',
            active: 'dashboard',
            stats: stats,
            recentActivities: recentActivities
        });
    } catch (error) {
        console.error("Error memuat dashboard pengurus:", error);
        res.status(500).send("Gagal memuat dashboard Anda.");
    }
};

// Menampilkan form untuk membuat program baru
exports.showCreateProgramForm = (req, res) => {
  res.render("pengurus/buat-program", {
    title: "Buat Program Baru",
    active: "buat-program",
    error: null,
  });
};

// Memproses data dari form pembuatan program yang sudah detail
exports.handleCreateProgram = async (req, res) => {
    try {
        const coordinatorId = req.user.id;
        const centerId = req.user.volunteer_center_id;
        
        if (!coordinatorId || !centerId) {
            throw new Error('Informasi pengurus tidak lengkap. Silakan login ulang.');
        }

        await Program.create(req.body, coordinatorId, centerId);
        
        // Langsung arahkan ke halaman daftar program setelah berhasil
        res.redirect('/pengurus/program');

    } catch (error) {
        console.error("Error saat membuat program:", error);
        res.status(500).render('pengurus/buat-program', {
            title: 'Gagal Membuat Program',
            active: 'buat-program',
            error: 'Terjadi kesalahan saat menyimpan program. Mohon periksa kembali data Anda.'
        });
    }
};

exports.showSelectionManagement = (req, res) => {
  res.render("pengurus/manajemen-seleksi", {
    title: "Manajemen Seleksi",
    active: "seleksi",
  });
};

exports.showDocumentValidation = (req, res) => {
  res.render("pengurus/validasi-dokumen", {
    title: "Validasi Dokumen",
    active: "validasi",
  });
};

exports.showAnalytics = (req, res) => {
  res.render("pengurus/statistik", {
    title: "Statistik & Analitik",
    active: "analitik",
  });
};
exports.showJadwalPage = (req, res) => {
  res.render("pengurus/jadwal", {
    title: "Manajemen Jadwal",
    active: "jadwal", // 'active' harus sesuai dengan link di sidebar
  });
};
exports.showKomunikasiPage = (req, res) => {
  res.render("pengurus/komunikasi", {
    title: "Kirim Pengumuman",
    active: "komunikasi", // 'active' harus sesuai dengan link di sidebar
  });
};
exports.showSelectionManagement = async (req, res) => {
  try {
    const centerId = req.user.volunteer_center_id;

    // Ambil program dan aplikasi yang relevan untuk pusat volunteer ini
    const programs = await Program.findByCenter(centerId);
    const aplikasi = await Aplikasi.findByCenter(centerId);

    res.render("pengurus/manajemen-seleksi", {
      title: "Manajemen Seleksi",
      active: "seleksi",
      programs: programs,
      aplikasi: aplikasi,
      error: null,
    });
  } catch (error) {
    console.error("Error memuat halaman manajemen seleksi:", error);
    res.status(500).send("Gagal memuat halaman.");
  }
};

// Fungsi untuk memproses pembaruan status aplikasi
exports.updateSelectionStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // Ambil status dari form

    await Aplikasi.updateStatus(applicationId, { status: status });

    res.redirect("/pengurus/seleksi"); // Kembali ke halaman seleksi
  } catch (error) {
    console.error("Gagal memperbarui status:", error);
    // Handle error, mungkin dengan redirect dan pesan error
    res.redirect("/pengurus/seleksi?error=update_failed");
  }
};
exports.showJadwalPage = async (req, res) => {
  try {
    const centerId = req.user.volunteer_center_id;

    // Ambil daftar program untuk dropdown dan daftar jadwal yang sudah ada
    const programs = await Program.findByCenter(centerId);
    const jadwal = await Jadwal.findByCenter(centerId);

    res.render("pengurus/jadwal", {
      title: "Manajemen Jadwal",
      active: "jadwal",
      programs: programs, // Untuk dropdown di form
      jadwal: jadwal, // Untuk ditampilkan sebagai daftar
      error: null,
    });
  } catch (error) {
    console.error("Error memuat halaman jadwal:", error);
    res.status(500).send("Gagal memuat halaman jadwal.");
  }
};

// Fungsi untuk menangani pembuatan jadwal baru dari form
exports.handleCreateJadwal = async (req, res) => {
  try {
    await Jadwal.create(req.body);
    res.redirect("/pengurus/jadwal");
  } catch (error) {
    console.error("Gagal membuat jadwal:", error);
    // Jika gagal, render kembali halaman dengan pesan error
    const centerId = req.user.volunteer_center_id;
    const programs = await Program.findByCenter(centerId);
    const jadwal = await Jadwal.findByCenter(centerId);

    res.status(500).render("pengurus/jadwal", {
      title: "Gagal Membuat Jadwal",
      active: "jadwal",
      programs: programs,
      jadwal: jadwal,
      error:
        "Terjadi kesalahan saat menyimpan jadwal. Mohon periksa kembali data Anda.",
    });
  }
};
// Menampilkan halaman Kirim Pengumuman
exports.showKomunikasiPage = async (req, res) => {
  try {
    const centerId = req.user.volunteer_center_id;

    // Ambil program untuk dropdown dan riwayat pengumuman
    const programs = await Program.findByCenter(centerId);
    const pengumuman = await Pengumuman.findByCenter(centerId);

    res.render("pengurus/komunikasi", {
      title: "Alat Komunikasi",
      active: "komunikasi",
      programs: programs,
      pengumuman: pengumuman,
      error: null,
    });
  } catch (error) {
    console.error("Error memuat halaman komunikasi:", error);
    res.status(500).send("Gagal memuat halaman.");
  }
};

// Menangani pengiriman pengumuman baru dari form
exports.handleKirimPengumuman = async (req, res) => {
  try {
    const pengurusId = req.user.id;
    await Pengumuman.create(req.body, pengurusId);
    res.redirect("/pengurus/komunikasi");
  } catch (error) {
    console.error("Gagal mengirim pengumuman:", error);
    // Jika gagal, render kembali halaman dengan pesan error
    const centerId = req.user.volunteer_center_id;
    const programs = await Program.findByCenter(centerId);
    const pengumuman = await Pengumuman.findByCenter(centerId);
    res.status(500).render("pengurus/komunikasi", {
      title: "Gagal Mengirim",
      active: "komunikasi",
      programs,
      pengumuman,
      error: "Terjadi kesalahan saat mengirim pengumuman.",
    });
  }
};
// Fungsi untuk menampilkan halaman Statistik & Analitik
exports.showAnalytics = async (req, res) => {
  try {
    const centerId = req.user.volunteer_center_id;

    // Panggil fungsi baru dari model untuk mendapatkan semua data statistik
    const stats = await Aplikasi.getStatisticsForCenter(centerId);

    res.render("pengurus/statistik", {
      title: "Statistik & Analitik",
      active: "analitik",
      stats: stats, // Kirim seluruh objek statistik ke view
      error: null,
    });
  } catch (error) {
    console.error("Error memuat halaman statistik:", error);
    res.status(500).send("Gagal memuat halaman statistik.");
  }
};
exports.showFeedbackPage = async (req, res) => {
    try {
        const centerId = req.user.volunteer_center_id;
        const feedback = await Feedback.findFeedbackByCenter(centerId);
        res.render('pengurus/lihat-umpan-balik', {
            title: 'Umpan Balik Program',
            active: 'lihat-umpan-balik',
            feedback: feedback
        });
    } catch (error) {
        console.error("Error memuat umpan balik pengurus:", error);
        res.status(500).send("Gagal memuat halaman.");
    }
};
exports.showEditProgramForm = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        // Keamanan: Pastikan pengurus hanya bisa mengedit program di pusat volunteernya
        if (!program || program.volunteer_center_id !== req.user.volunteer_center_id) {
            return res.status(403).send("Akses ditolak.");
        }
        res.render('pengurus/edit-program', {
            title: `Edit: ${program.title}`,
            active: 'dashboard', // Atau sesuaikan dengan menu yang relevan
            program: program,
            error: null
        });
    } catch (error) {
        res.status(500).send("Gagal memuat halaman edit.");
    }
};

exports.handleUpdateProgram = async (req, res) => {
    const programId = req.params.id;
    try {
        await Program.update(programId, req.body);
        res.redirect('/pengurus/dashboard');
    } catch (error) {
        const program = await Program.findById(programId); // Ambil data lama untuk mengisi form lagi
        res.status(500).render('pengurus/edit-program', {
            title: `Gagal Edit: ${program.title}`,
            active: 'dashboard',
            program: program,
            error: 'Gagal menyimpan perubahan. Mohon periksa kembali data Anda.'
        });
    }
};
exports.showProgramListPage = async (req, res) => {
    try {
        const programs = await Program.findByCenter(req.user.volunteer_center_id);
        res.render('pengurus/daftar-program', {
            title: 'Daftar Program Anda',
            active: 'daftar-program',
            programs: programs
        });
    } catch (error) {
        console.error("Error memuat daftar program:", error);
        res.status(500).send("Gagal memuat halaman.");
    }
};
exports.handleDeleteProgram = async (req, res) => {
    try {
        const programId = req.params.id;
        const centerId = req.user.volunteer_center_id;

        // Panggil model untuk menghapus, sudah termasuk validasi kepemilikan
        await Program.delete(programId, centerId);
        
        // Redirect kembali ke daftar program
        res.redirect('/pengurus/program');
    } catch (error) {
        console.error("Gagal menghapus program:", error);
        res.status(500).send("Terjadi kesalahan saat mencoba menghapus program.");
    }
};
exports.showEditJadwalForm = async (req, res) => {
    try {
        const jadwal = await Jadwal.findById(req.params.id);
        const programs = await Program.findByCenter(req.user.volunteer_center_id);

        if (!jadwal) return res.status(404).send("Jadwal tidak ditemukan.");

        // Verifikasi apakah jadwal ini milik pusat volunteer pengurus
        const programIds = programs.map(p => p.id);
        if (!programIds.includes(jadwal.program_id)) {
            return res.status(403).send("Akses ditolak.");
        }

        res.render('pengurus/edit-jadwal', {
            title: 'Edit Jadwal',
            active: 'jadwal',
            jadwal: jadwal,
            programs: programs
        });
    } catch (error) {
        res.status(500).send("Gagal memuat halaman edit jadwal.");
    }
};

exports.handleUpdateJadwal = async (req, res) => {
    try {
        await Jadwal.update(req.params.id, req.body);
        res.redirect('/pengurus/jadwal');
    } catch (error) {
        res.status(500).send("Gagal menyimpan perubahan jadwal.");
    }
};

exports.handleDeleteJadwal = async (req, res) => {
    try {
        // Anda bisa menambahkan verifikasi kepemilikan di sini sebelum menghapus
        await Jadwal.delete(req.params.id);
        res.redirect('/pengurus/jadwal');
    } catch (error) {
        res.status(500).send("Gagal menghapus jadwal.");
    }
};

exports.showDocumentValidation = async (req, res) => {
    try {
        const centerId = req.user.volunteer_center_id;
        const dokumen = await Dokumen.findForCenterValidation(centerId);
        
        res.render('pengurus/validasi-dokumen', {
            title: 'Validasi Dokumen',
            active: 'validasi',
            dokumen: dokumen, // Objek berisi { specific: [], general: [] }
            error: null
        });
    } catch (error) {
        console.error("Error memuat halaman validasi:", error);
        res.status(500).send("Gagal memuat halaman.");
    }
};

exports.handleUpdateValidation = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Dokumen.updateValidationStatus(id, status);
        res.redirect('/pengurus/validasi');
    } catch (error) {
        console.error("Gagal memvalidasi dokumen:", error);
        res.redirect('/pengurus/validasi?error=true');
    }
};
// FUNGSI BARU: Menampilkan halaman manajemen konten
exports.showKontenPage = async (req, res) => {
    try {
        const kontenList = await Konten.findByCenter(req.user.volunteer_center_id);
        res.render('pengurus/manajemen-konten', {
            title: 'Manajemen Konten',
            active: 'konten',
            kontenList
        });
    } catch (error) { res.status(500).send("Error memuat halaman."); }
};

// FUNGSI BARU: Menampilkan form untuk membuat konten baru
exports.showKontenForm = (req, res) => {
    res.render('pengurus/form-konten', {
        title: 'Buat Konten Baru',
        active: 'konten',
        error: null,
        item: {} // Kirim objek kosong untuk form baru
    });
};

// FUNGSI BARU: Menangani pembuatan konten
exports.handleCreateKonten = async (req, res) => {
    try {
        // --- PERBAIKAN: Validasi input ---
        const { judul_konten, isi_konten } = req.body;
        if (!judul_konten || !isi_konten || judul_konten.trim() === '' || isi_konten.trim() === '') {
            // Jika validasi gagal, render kembali form dengan pesan error dan data yang sudah diisi
            return res.status(400).render('pengurus/form-konten', {
                title: 'Gagal Membuat Konten',
                active: 'konten',
                error: 'Judul dan Isi Konten tidak boleh kosong.',
                item: { judul_konten, isi_konten } // Kirim kembali data yang sudah diinput
            });
        }
        // --- Akhir Perbaikan ---

        if (req.file) {
            req.body.gambar_konten = req.file.path.replace(/\\/g, '/').replace('public/', '');
        }
        await Konten.create(req.body, req.user.id, req.user.volunteer_center_id);
        res.redirect('/pengurus/konten');
    } catch (error) { 
        // Tangani error lain (misal: error database)
        res.status(500).render('pengurus/form-konten', {
            title: 'Gagal Membuat Konten',
            active: 'konten',
            error: 'Terjadi kesalahan pada server, silakan coba lagi.',
            item: req.body
        });
    }
};


// FUNGSI BARU: Menampilkan form untuk mengedit konten
exports.showEditKontenForm = async (req, res) => {
    try {
        const konten = await Konten.findById(req.params.id);
        if (!konten || konten.volunteer_center_id !== req.user.volunteer_center_id) {
            return res.status(403).send("Akses ditolak.");
        }
        res.render('pengurus/form-konten', {
            title: 'Edit Konten',
            active: 'konten',
            item: konten, // gunakan 'item' agar konsisten dengan form create
            error: null
        });
    } catch (error) { res.status(500).send("Error memuat halaman edit."); }
};

// FUNGSI BARU: Menangani pembaruan konten
exports.handleUpdateKonten = async (req, res) => {
    try {
         // --- PERBAIKAN: Validasi input juga untuk update ---
        const { judul_konten, isi_konten } = req.body;
        if (!judul_konten || !isi_konten || judul_konten.trim() === '' || isi_konten.trim() === '') {
            req.body.id = req.params.id; // pastikan id tetap ada untuk form
            return res.status(400).render('pengurus/form-konten', {
                title: 'Gagal Memperbarui Konten',
                active: 'konten',
                error: 'Judul dan Isi Konten tidak boleh kosong.',
                item: req.body
            });
        }
        // --- Akhir Perbaikan ---

        if (req.file) {
            req.body.gambar_konten = req.file.path.replace(/\\/g, '/').replace('public/', '');
        }
        await Konten.update(req.params.id, req.body);
        res.redirect('/pengurus/konten');
    } catch (error) { 
        req.body.id = req.params.id;
        res.status(500).render('pengurus/form-konten', {
            title: 'Gagal Memperbarui Konten',
            active: 'konten',
            error: 'Terjadi kesalahan pada server, silakan coba lagi.',
            item: req.body
        });
    }
};

// FUNGSI BARU: Menangani penghapusan konten
exports.handleDeleteKonten = async (req, res) => {
    try {
        await Konten.delete(req.params.id, req.user.volunteer_center_id);
        res.redirect('/pengurus/konten');
    } catch (error) { res.status(500).send("Gagal menghapus konten."); }
};

exports.getApplicationDetails = async (req, res) => {
    try {
        const applicationDetails = await Aplikasi.findDetailsById(req.params.id);
        
        if (!applicationDetails) {
            return res.status(404).json({ message: 'Aplikasi tidak ditemukan.' });
        }

        // Verifikasi kepemilikan
        const programs = await Program.findByCenter(req.user.volunteer_center_id);
        const programIds = programs.map(p => p.id);
        if (!programIds.includes(applicationDetails.program_id)) {
            return res.status(403).json({ message: 'Akses ditolak.' });
        }

        res.json(applicationDetails);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil detail.' });
    }
};
