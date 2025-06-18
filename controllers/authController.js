// controllers/authController.js

// controllers/authController.js

// 1. Fungsi untuk menampilkan halaman pemilihan peran
exports.showRoleSelection = (req, res) => {
  res.render('role_pengguna', {
    title: 'Selamat Datang'
  });
};

// 2. Fungsi untuk menampilkan halaman login mahasiswa
exports.showMahasiswaLoginPage = (req, res) => {
  res.render('mahasiswa/login');
};

// 3. Fungsi untuk menangani submit form login mahasiswa
exports.handleMahasiswaLogin = (req, res) => {
  // Untuk saat ini, kita tidak memeriksa password.
  // Langsung arahkan ke dashboard.
  res.redirect('/mahasiswa/dashboard');
};
// --- FUNGSI BARU UNTUK LOGIN PENGURUS ---
exports.showPengurusLoginPage = (req, res) => {
    res.render('pengurus/login', { title: 'Login Pengurus' });
};

exports.handlePengurusLogin = (req, res) => {
    // Arahkan ke dashboard pengurus setelah login
    res.redirect('/pengurus/dashboard');
};
