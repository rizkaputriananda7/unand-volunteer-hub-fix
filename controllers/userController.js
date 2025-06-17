// controllers/userController.js

// --- DATA STATIS --- (Biarkan seperti yang sudah ada)
const pengumumanData = [/* ...data pengumuman Anda... */];
const programData = [/* ...data program Anda... */];
const userData = { name: 'Naufal H.', role: 'Mahasiswa' };

// --- KUMPULAN FUNGSI ---

exports.showMahasiswaDashboard = (req, res) => {
  res.render('mahasiswa/dashboard', { user: userData, title: 'Dashboard' });
};

exports.showFaqPage = (req, res) => {
  res.render('mahasiswa/faq', { user: userData, title: 'FAQ' });
};

exports.showPengumumanPage = (req, res) => {
  res.render('mahasiswa/pengumuman', { user: userData, title: 'Pengumuman', pengumuman: pengumumanData });
};

exports.showPengumumanDetailPage = (req, res) => {
  const announcementId = parseInt(req.params.id);
  const announcement = pengumumanData.find(p => p.id === announcementId);
  if (announcement) {
    res.render('mahasiswa/pengumuman-detail', { user: userData, title: announcement.judul, announcement: announcement });
  } else {
    res.status(404).send('Pengumuman tidak ditemukan');
  }
};

exports.showProgramPage = (req, res) => {
  const { status, kategori, pusat } = req.query;
  let filteredPrograms = programData;
  if (status) { filteredPrograms = filteredPrograms.filter(p => p.status === status); }
  if (kategori) { filteredPrograms = filteredPrograms.filter(p => p.kategori === kategori); }
  if (pusat) { filteredPrograms = filteredPrograms.filter(p => p.pusat === pusat); }
  res.render('mahasiswa/program', { user: userData, title: 'Program Volunteer', programs: filteredPrograms });
};

// --- FUNGSI BARU UNTUK HALAMAN INI ---
exports.showBookmarkPage = (req, res) => {
    res.render('mahasiswa/bookmark', {
        user: userData,
        title: 'Program Favorit'
    });
};
