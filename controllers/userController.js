// controllers/userController.js
const Pendaftaran = require('../models/Pendaftaran');
const Program = require('../models/Program');
const Mahasiswa = require('../models/Mahasiswa');

const { pengumumanData, programData, userData, bookmarkedPrograms } = require('../models/staticData');
//test
// 1. Dashboard
exports.showMahasiswaDashboard = (req, res) => {
  res.render('mahasiswa/dashboard', {
    user: userData.mahasiswa,
    title: 'Dashboard'
  });
};

// 2. Program Volunteer
exports.showProgramVolunteer = (req, res) => {
  res.render('mahasiswa/program', {
    user: userData.mahasiswa,
    title: 'Program Volunteer',
    programs: programData,
    bookmarkedIds: bookmarkedPrograms.map(p => p.id)
  });
};

// 3. Pendaftaran
exports.showPendaftaran = (req, res) => {
  res.render('mahasiswa/pendaftaran', {
    user: userData.mahasiswa,
    title: 'Pendaftaran'
  });
};

// 4. Deadline
exports.showDeadline = (req, res) => {
  res.render('mahasiswa/deadline', {
    user: userData.mahasiswa,
    title: 'Deadline'
  });
};

// Assuming necessary models and data are imported
const { Mahasiswa } = require('../models/Mahasiswa');

// 5. Status Pendaftaran
// Fungsi untuk menampilkan halaman status pendaftaran
exports.getStatusPendaftaran = async (req, res) => {
  try {
    // PENTING: ID mahasiswa harusnya didapat dari sesi login (req.session.mahasiswaId).
    // Untuk tujuan pengembangan, kita gunakan ID statis '1' untuk sementara.
    const mahasiswaId = 1;

    // Cari semua pendaftaran yang dilakukan oleh mahasiswa dengan ID tersebut
    const daftarAplikasi = await Pendaftaran.findAll({
      where: { mahasiswa_id: mahasiswaId },
      // Sertakan model Program untuk mendapatkan detail program yang didaftar
      include: [{
        model: Program,
        as: 'program', // Gunakan alias yang didefinisikan di model
        attributes: ['nama_program', 'penyelenggara'] // Ambil kolom yang diperlukan saja
      }],
      // Urutkan berdasarkan tanggal pendaftaran terbaru
      order: [['tanggal_pendaftaran', 'DESC']]
    });

    // Render halaman EJS dan kirimkan data pendaftaran
    res.render('mahasiswa/status-pendaftaran', {
      title: 'Status Pendaftaran',
      layout: 'layouts/main-layout',
      pendaftaran: daftarAplikasi, // Kirim data ke view
      currentRoute: '/mahasiswa/status-pendaftaran' // Untuk menandai menu aktif di sidebar
    });
  } catch (error) {
    // Tangani jika terjadi error
    console.error("Error saat mengambil status pendaftaran:", error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
};

// --- Fungsi-fungsi lain yang sudah ada ---
exports.getProfile = (req, res) => {
    res.render('mahasiswa/profile', {
      title: 'Profile',
      layout: 'layouts/main-layout',
      currentRoute: '/mahasiswa/profile'
    });
};

// 6. Pengumuman
exports.showPengumumanPage = (req, res) => {
  res.render('mahasiswa/pengumuman', {
    user: userData.mahasiswa,
    title: 'Pengumuman',
    pengumuman: pengumumanData
  });
};

exports.showPengumumanDetailPage = (req, res) => {
  const announcementId = parseInt(req.params.id);
  const announcement = pengumumanData.find(p => p.id === announcementId);
  if (announcement) {
    res.render('mahasiswa/pengumuman-detail', {
      user: userData.mahasiswa,
      title: announcement.judul,
      announcement
    });
  } else {
    res.status(404).send('Pengumuman tidak ditemukan');
  }
};

// 7. Kalender Pendaftaran
exports.showKalenderPendaftaran = (req, res) => {
  res.render('mahasiswa/kalender', {
    user: userData.mahasiswa,
    title: 'Kalender Pendaftaran'
  });
};

// 8. Riwayat Pendaftaran
exports.showRiwayatPendaftaran = (req, res) => {
  res.render('mahasiswa/riwayat', {
    user: userData.mahasiswa,
    title: 'Riwayat Pendaftaran'
  });
};

// 9. FAQ
exports.showFaqPage = (req, res) => {
  res.render('mahasiswa/faq', {
    user: userData.mahasiswa,
    title: 'FAQ'
  });
};

// Bookmark
exports.showBookmarkPage = (req, res) => {
  res.render('mahasiswa/bookmark', {
    user: userData.mahasiswa,
    title: 'Program Favorit',
    programs: bookmarkedPrograms
  });
};

exports.addBookmark = (req, res) => {
  const programId = parseInt(req.params.id);
  const program = programData.find(p => p.id === programId);
  const index = bookmarkedPrograms.findIndex(p => p.id === programId);

  if (program && index === -1) {
    bookmarkedPrograms.push(program);
  } else if (index > -1) {
    bookmarkedPrograms.splice(index, 1); // toggle
  }

  res.redirect('back');
};

exports.deleteBookmark = (req, res) => {
  const programId = parseInt(req.params.id);
  const index = bookmarkedPrograms.findIndex(p => p.id === programId);
  if (index > -1) {
    bookmarkedPrograms.splice(index, 1);
  }
  res.redirect('/mahasiswa/bookmark');
};