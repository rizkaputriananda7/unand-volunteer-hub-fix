// Fungsi untuk menampilkan halaman status pendaftaran (tanpa data)
exports.getStatusPendaftaran = async (req, res) => {
  try {
    // Logika untuk mengambil data dengan SQL manual akan ditambahkan di sini nanti.
    // Untuk sekarang, kita kirim array kosong.
    const daftarAplikasi = [];

    res.render('mahasiswa/status-pendaftaran', {
      title: 'Status Pendaftaran',
      layout: 'layouts/main-layout',
      pendaftaran: daftarAplikasi, // Kirim array kosong ke view
      currentRoute: '/mahasiswa/status-pendaftaran'
    });
  } catch (error) {
    console.error("Error pada halaman status pendaftaran:", error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
};

// --- Fungsi-fungsi lain (disederhanakan) ---
exports.getProfile = (req, res) => {
    res.render('mahasiswa/profile', {
      title: 'Profile',
      layout: 'layouts/main-layout',
      currentRoute: '/mahasiswa/profile'
    });
};
exports.getNotifikasi = (req, res) => {
    res.render('mahasiswa/notifikasi', { title: 'Notifikasi', layout: 'layouts/main-layout', currentRoute: '/mahasiswa/notifikasi' });
};
exports.getBookmark = (req, res) => {
    res.render('mahasiswa/bookmark', { title: 'Bookmark', layout: 'layouts/main-layout', currentRoute: '/mahasiswa/bookmark' });
};
exports.getRiwayat = (req, res) => {
    res.render('mahasiswa/riwayat', { title: 'Riwayat', layout: 'layouts/main-layout', currentRoute: '/mahasiswa/riwayat' });
};
exports.getKalender = (req, res) => {
    res.render('mahasiswa/kalender', { title: 'Kalender', layout: 'layouts/main-layout', currentRoute: '/mahasiswa/kalender' });
};
exports.getDeadline = (req, res) => {
    res.render('mahasiswa/deadline', { title: 'Deadline', layout: 'layouts/main-layout', currentRoute: '/mahasiswa/deadline' });
};
exports.getPengaturan = (req, res) => {
    res.render('mahasiswa/pengaturan', { title: 'Pengaturan', layout: 'layouts/main-layout', currentRoute: '/mahasiswa/pengaturan' });
};