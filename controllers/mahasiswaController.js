const Feedback = require("../models/Feedback");
const Aplikasi = require("../models/Aplikasi");
const Dokumen = require("../models/Dokumen");
const upload = require("../utils/uploadMiddleware");
const Jadwal = require("../models/Jadwal");
const Pengumuman = require("../models/Pengumuman");
const Program = require("../models/Program");
const Bookmark = require("../models/Bookmark");
const Faq = require("../models/Faq");
const VolunteerCenter = require("../models/VolunteerCenter");
const Konten = require('../models/Konten');
const bcrypt = require('bcryptjs');

exports.showDashboard = async (req, res) => {
    try {
        const mahasiswaId = req.user.id;
        const [
            activeRoles, 
            upcomingEvents, 
            stats, 
            announcements, // Variabel diubah dari 'libraryNews' menjadi 'announcements'
            latestContent
        ] = await Promise.all([
            Aplikasi.findActiveRolesByMahasiswa(mahasiswaId),
            Jadwal.findUpcomingForMahasiswa(mahasiswaId),
            Aplikasi.getStatsForMahasiswa(mahasiswaId),
            Pengumuman.findForMahasiswa(mahasiswaId), // <-- INI BAGIAN YANG DIPERBAIKI
            Konten.findLatest(4)
        ]);

        res.render("mahasiswa/dashboard", {
            title: "Dashboard Volunteer",
            active: "dashboard",
            activeRoles,
            upcomingEvents,
            stats,
            announcements, // Variabel yang dikirim ke view juga diubah
            latestContent
        });
    } catch (error) {
        console.error("Error memuat dashboard mahasiswa:", error);
        res.status(500).send("Gagal memuat dashboard Anda.");
    }
};

// Menampilkan halaman Status Aplikasi
exports.showStatusAplikasi = (req, res) => {
  res.render("mahasiswa/status-aplikasi", {
    title: "Status Aplikasi Saya",
    active: "aplikasi",
  });
};

// Menampilkan halaman Kalender
exports.showKalender = (req, res) => {
  res.render("mahasiswa/kalender", {
    title: "Kalender Kegiatan",
    active: "kalender",
  });
};

// Fungsi baru untuk menampilkan halaman notifikasi
exports.showNotifikasi = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;

    // 1. Ambil pengumuman manual dari pengurus
    const manualAnnouncements = await Pengumuman.findForMahasiswa(mahasiswaId);

    // 2. Ambil pengingat tenggat waktu otomatis dari sistem
    const deadlineReminders = await Program.findUpcomingDeadlinesForMahasiswa(
      mahasiswaId
    );

    // 3. Format kedua jenis data agar memiliki struktur yang seragam
    const formattedAnnouncements = manualAnnouncements.map((item) => ({
      type: "pengumuman",
      title: item.subjek,
      message: item.pesan,
      programName: item.nama_program,
      contact: item.kontak_narahubung,
      date: item.created_at,
    }));

    const formattedDeadlines = deadlineReminders.map((item) => ({
      type: "pengingat",
      title: "Pengingat Tenggat Waktu Pendaftaran",
      message: `Pendaftaran untuk program "${item.nama_program}" akan segera ditutup. Segera lengkapi pendaftaran dan dokumen Anda!`,
      programName: item.nama_program,
      contact: null, // Tidak ada kontak untuk notifikasi sistem
      date: item.pendaftaran_akhir, // Gunakan tanggal pendaftaran sebagai tanggal acuan
    }));

    // 4. Gabungkan keduanya menjadi satu array dan urutkan berdasarkan tanggal terbaru
    const allNotifications = [...formattedAnnouncements, ...formattedDeadlines];
    allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.render("mahasiswa/notifikasi", {
      title: "Notifikasi & Pengumuman",
      active: "notifikasi",
      notifications: allNotifications, // Kirim data yang sudah digabung
    });
  } catch (error) {
    console.error("Error memuat halaman notifikasi:", error);
    res.status(500).send("Gagal memuat halaman notifikasi.");
  }
};

// Menampilkan halaman Bantuan Surat Motivasi
exports.showBantuanSurat = async (req, res) => {
  try {
    // Ambil program yang pernah dilamar untuk mengisi dropdown
    const appliedPrograms = await Aplikasi.findAppliedProgramsByMahasiswa(
      req.user.id
    );

    res.render("mahasiswa/bantuan-surat", {
      title: "Asisten Surat Motivasi",
      active: "bantuan-surat",
      programs: appliedPrograms,
    });
  } catch (error) {
    console.error("Error memuat halaman bantuan surat:", error);
    res.status(500).send("Gagal memuat halaman.");
  }
};
exports.showFeedbackPage = async (req, res) => {
  try {
    // Ambil program yang pernah dilamar untuk mengisi dropdown
    const appliedPrograms = await Aplikasi.findAppliedProgramsByMahasiswa(
      req.user.id
    );

    res.render("mahasiswa/umpan-balik", {
      title: "Beri Umpan Balik",
      active: "umpan-balik",
      programs: appliedPrograms, // Kirim data program
      error: null,
      success_msg: null,
    });
  } catch (error) {
    console.error("Error memuat halaman umpan balik:", error);
    res.status(500).render("mahasiswa/umpan-balik", {
      title: "Error",
      active: "umpan-balik",
      programs: [], // Kirim array kosong jika error
      error: "Gagal memuat data program.",
      success_msg: null,
    });
  }
};

// Memproses data dari form umpan balik
exports.handlePostFeedback = async (req, res) => {
  try {
    const mahasiswaId = req.user.id;
    if (!req.body.rating) {
      throw new Error("Peringkat bintang wajib diisi.");
    }

    await Feedback.create(req.body, mahasiswaId);

    // Ambil kembali data program untuk dirender bersama pesan sukses
    const appliedPrograms = await Aplikasi.findAppliedProgramsByMahasiswa(
      req.user.id
    );

    res.render("mahasiswa/umpan-balik", {
      title: "Terima Kasih!",
      active: "umpan-balik",
      programs: appliedPrograms, // Sertakan kembali data program
      error: null,
      success_msg:
        "Umpan balik Anda telah berhasil dikirim. Kami sangat menghargainya!",
    });
  } catch (error) {
    console.error("Gagal mengirim umpan balik:", error);

    // Ambil kembali data program untuk dirender bersama pesan error
    const appliedPrograms = await Aplikasi.findAppliedProgramsByMahasiswa(
      req.user.id
    );

    res.status(500).render("mahasiswa/umpan-balik", {
      title: "Gagal Mengirim",
      active: "umpan-balik",
      programs: appliedPrograms, // Sertakan kembali data program
      error: error.message || "Terjadi kesalahan saat mengirim umpan balik.",
      success_msg: null,
    });
  }
};
// Menampilkan halaman Status Aplikasi Mahasiswa
exports.showStatusAplikasi = async (req, res) => {
  try {
    let successMessage = null;
    // Cek apakah ada query 'success' di URL setelah redirect dari pendaftaran
    if (req.query.success === "true") {
      successMessage =
        "Lamaran Anda telah berhasil dikirim. Status awal adalah 'Ditinjau'. Pantau halaman ini untuk pembaruan selanjutnya!";
    }

    // Ambil semua riwayat aplikasi yang pernah dikirim oleh mahasiswa yang sedang login
    const daftarAplikasi = await Aplikasi.findAppliedProgramsByMahasiswa(
      req.user.id
    );

    res.render("mahasiswa/status-aplikasi", {
      title: "Status Aplikasi Saya",
      active: "aplikasi",
      aplikasi: daftarAplikasi,
      success_msg: successMessage,
    });
  } catch (error) {
    console.error("Error menampilkan status aplikasi:", error);
    res.status(500).send("Gagal memuat halaman status aplikasi.");
  }
};
// Menampilkan halaman dokumen, sekarang dengan daftar pusat untuk dropdown
exports.showDokumen = async (req, res) => {
    try {
        const [daftarDokumen, daftarPusat] = await Promise.all([
            Dokumen.findByMahasiswaId(req.user.id),
            VolunteerCenter.findAll()
        ]);
        
        res.render('mahasiswa/dokumen', {
            title: 'Dokumen Saya',
            active: 'dokumen',
            dokumen: daftarDokumen,
            centers: daftarPusat, // Kirim daftar pusat ke view
            error: null
        });
    } catch (error) {
        res.status(500).send("Gagal memuat halaman dokumen.");
    }
};

// Menangani unggahan file, sekarang dengan data dari body
exports.handleUploadDokumen = async (req, res) => {
    try {
        if (req.uploadError) throw new Error(req.uploadError);
        if (!req.file) throw new Error('Anda harus memilih sebuah file untuk diunggah.');

        // Kirim seluruh req.body yang berisi tipe_dokumen dan volunteer_center_id
        await Dokumen.create(req.file, req.user.id, req.body);
        
        res.redirect('/mahasiswa/dokumen');

    } catch (error) {
        // Jika gagal, ambil kembali data untuk merender ulang form
        const [daftarDokumen, daftarPusat] = await Promise.all([
            Dokumen.findByMahasiswaId(req.user.id),
            VolunteerCenter.findAll()
        ]);
        res.status(400).render('mahasiswa/dokumen', {
            title: 'Gagal Mengunggah',
            active: 'dokumen',
            dokumen: daftarDokumen,
            centers: daftarPusat,
            error: error.message
        });
    }
};
// Menangani penghapusan dokumen
exports.handleDeleteDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    await Dokumen.delete(id, req.user.id);
    res.redirect("/mahasiswa/dokumen");
  } catch (error) {
    res.status(500).send("Gagal menghapus dokumen.");
  }
};
// Menampilkan halaman profil
exports.showProfilePage = (req, res) => {
  res.render("mahasiswa/profil", {
    title: "Profil Saya",
    active: "profil",
    error: req.query.error, // Ambil pesan error dari query URL
    success_msg: req.query.success, // Ambil pesan sukses
  });
};

// Memproses pembaruan informasi pribadi
exports.handleUpdateProfile = async (req, res) => {
  try {
    await Mahasiswa.updateProfile(req.user.id, req.body);
    res.redirect("/mahasiswa/profil?success=Informasi+berhasil+diperbarui");
  } catch (error) {
    res.redirect("/mahasiswa/profil?error=Gagal+memperbarui+informasi");
  }
};

// Memproses unggahan foto profil
exports.handleUpdatePhoto = async (req, res) => {
  try {
    if (!req.file) throw new Error("File tidak ditemukan atau format salah.");
    // Path yang disimpan adalah path relatif dari folder public
    const filePath = req.file.path.replace("public\\", "").replace(/\\/g, "/");
    await Mahasiswa.updatePhoto(req.user.id, filePath);
    res.redirect("/mahasiswa/profil?success=Foto+berhasil+diperbarui");
  } catch (error) {
    res.redirect(`/mahasiswa/profil?error=${error.message}`);
  }
};

// Memproses perubahan password
exports.handleUpdatePassword = async (req, res) => {
  try {
    const { password_lama, password_baru } = req.body;
    const mahasiswa = await Mahasiswa.findById(req.user.id);

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(password_lama, mahasiswa.password);
    if (!isMatch) {
      return res.redirect("/mahasiswa/profil?error=Password+lama+salah");
    }

    await Mahasiswa.updatePassword(req.user.id, password_baru);
    res.redirect("/mahasiswa/profil?success=Password+berhasil+diubah");
  } catch (error) {
    res.redirect("/mahasiswa/profil?error=Gagal+mengubah+password");
  }
};
exports.showBookmarkPage = async (req, res) => {
  try {
    const bookmarkedPrograms = await Bookmark.findAllForMahasiswa(req.user.id);
    res.render("mahasiswa/bookmark", {
      title: "Program Tersimpan",
      active: "bookmark",
      bookmarks: bookmarkedPrograms,
    });
  } catch (error) {
    console.error("Error memuat halaman bookmark:", error);
    res.status(500).send("Gagal memuat halaman.");
  }
};
exports.handleAddBookmark = async (req, res) => {
  try {
    const { programId } = req.body;
    await Bookmark.add(req.user.id, programId);
    // Redirect kembali ke halaman asal
    res.redirect(req.get("referer") || "/programs");
  } catch (error) {
    console.error("Gagal menambah bookmark:", error);
    res.redirect(req.get("referer") || "/programs");
  }
};
exports.handleRemoveBookmark = async (req, res) => {
  try {
    const { programId } = req.body;
    await Bookmark.remove(req.user.id, programId);
    res.redirect(req.get("referer") || "/programs");
  } catch (error) {
    console.error("Gagal menghapus bookmark:", error);
    res.redirect(req.get("referer") || "/programs");
  }
};
// Fungsi untuk menampilkan halaman Kalender Kegiatan
exports.showKalender = async (req, res) => {
  try {
    // Ambil semua jadwal yang relevan untuk mahasiswa yang login
    const jadwalEvents = await Jadwal.findAllForMahasiswa(req.user.id);

    res.render("mahasiswa/kalender", {
      title: "Kalender Kegiatan",
      active: "kalender",
      events: jadwalEvents, // Kirim data jadwal ke view
    });
  } catch (error) {
    console.error("Error memuat halaman kalender:", error);
    res.status(500).send("Gagal memuat halaman kalender.");
  }
};
exports.showFaqPage = async (req, res) => {
    try {
        // --- PERCOBAAN UNTUK DEBUGGING ---
        // Kita tambahkan variabel-variabel ini dengan nilai default/kosong
        // karena kemungkinan file layout.ejs membutuhkannya.
        const dummyDataForLayout = {
            stats: { totalAplikasi: 0, totalDiterima: 0 },
            upcomingEvents: [],
            activeRoles: [],
            libraryNews: [],
            latestContent: []
        };
        // ------------------------------------

        res.render('mahasiswa/faq', {
            title: 'FAQ & Bantuan',
            active: 'faq',
            ...dummyDataForLayout // Menyertakan semua data kosong ke view
        });
    } catch (error) {
        console.error("Error merender halaman FAQ:", error);
        res.status(500).send("Gagal memuat halaman FAQ.");
    }
};

