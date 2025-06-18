// controllers/userController.js

const { pengumumanData, programData, userData, bookmarkedPrograms } = require('../models/staticData');

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

// 5. Status Pendaftaran
exports.showStatusPendaftaran = (req, res) => {
  // Contoh data pendaftaran (bisa diganti dari database nanti)
  const pendaftaran = [
    { namaProgram: 'Volunteer Edukasi Anak', status: 'terkirim' },
    { namaProgram: 'Pembersihan Sungai', status: 'ditinjau' },
    { namaProgram: 'Kegiatan Sosial Ramadhan', status: 'diterima' },
    { namaProgram: 'Bakti Sosial Pegadaian', status: 'ditolak' }
  ];

  // Jika user belum mendaftar, kosongkan array:
  // const pendaftaran = [];

  res.render('mahasiswa/status', {
    user: userData.mahasiswa,
    title: 'Status Pendaftaran',
    pendaftaran
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