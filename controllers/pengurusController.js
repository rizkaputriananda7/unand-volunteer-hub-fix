const Program = require("../models/Program");
const Aplikasi = require("../models/Aplikasi");
const Jadwal = require("../models/Jadwal");
const Pengumuman = require("../models/Pengumuman");

exports.showDashboard = async (req, res) => {
  try {
    // Ambil program yang hanya dimiliki oleh pusat volunteer pengurus yang login
    const programs = await Program.findByCenter(req.user.volunteer_center_id);
    res.render("pengurus/dashboard", {
      title: "Dashboard Pengurus",
      active: "dashboard",
      programs: programs, // Kirim data program ke view dashboard
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error memuat dashboard.");
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
      throw new Error("Informasi pengurus tidak lengkap. Silakan login ulang.");
    }

    // Panggil fungsi create dari model Program dengan semua data dari req.body
    await Program.create(req.body, coordinatorId, centerId);

    // Redirect ke dashboard setelah berhasil
    res.redirect("/pengurus/dashboard");
  } catch (error) {
    console.error("Error saat membuat program:", error);
    res.status(500).render("pengurus/buat-program", {
      title: "Gagal Membuat Program",
      active: "buat-program",
      error:
        "Terjadi kesalahan saat menyimpan program. Mohon periksa kembali semua data yang Anda masukkan.",
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
