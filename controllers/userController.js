// controllers/userController.js

// Ambil semua data DARI file pusat, termasuk array bookmark yang bisa diubah
const { pengumumanData, programData, userData, bookmarkedPrograms } = require('../models/staticData');

// --- KUMPULAN FUNGSI UNTUK MAHASISWA ---

exports.showMahasiswaDashboard = (req, res) => {
  res.render('mahasiswa/dashboard', { user: userData.mahasiswa, title: 'Dashboard' });
};

exports.showFaqPage = (req, res) => {
  res.render('mahasiswa/faq', { user: userData.mahasiswa, title: 'FAQ' });
};

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
    res.render('mahasiswa/pengumuman-detail', { user: userData.mahasiswa, title: announcement.judul, announcement: announcement });
  } else {
    res.status(404).send('Pengumuman tidak ditemukan');
  }
};

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
        // Jika program ada dan belum di-bookmark, tambahkan
        bookmarkedPrograms.push(program);
    } else if (index > -1) {
        // Jika sudah di-bookmark, hapus (toggle)
        bookmarkedPrograms.splice(index, 1);
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
