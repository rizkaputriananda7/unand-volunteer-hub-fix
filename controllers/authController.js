// controllers/authController.js

// Ambil semua data dari file pusat, termasuk array bookmark
// const { pengumumanData, programData, userData, bookmarkedPrograms } = require('../models/staticData'); // Ini di userController, bukan authController

// 1. Fungsi untuk menampilkan halaman pemilihan peran
exports.showRoleSelection = (req, res) => {
  res.render('role_pengguna', {
    title: 'Selamat Datang'
  });
};

// 2. Fungsi untuk menampilkan halaman login mahasiswa
exports.showMahasiswaLoginPage = (req, res) => {
  // PERBAIKAN DI SINI: Lewatkan variabel 'error' dengan nilai default null
  res.render('mahasiswa/login', { error: null }); // 
};

// 3. Fungsi untuk menangani submit form login mahasiswa
exports.handleMahasiswaLogin = (req, res) => {
  // Untuk saat ini, kita tidak memeriksa password.
  // Langsung arahkan ke dashboard.
  res.redirect('/mahasiswa/dashboard');
};

// --- FUNGSI BARU UNTUK LOGIN PENGURUS ---
exports.showPengurusLoginPage = (req, res) => {
    // Tambahkan 'error: null' untuk konsistensi
    res.render('pengurus/login', { title: 'Login Pengurus', error: null }); // 
};

exports.handlePengurusLogin = (req, res) => {
    // Arahkan ke dashboard pengurus setelah login
    res.redirect('/pengurus/dashboard');
};

// --- FUNGSI BARU UNTUK LOGIN ADMIN ---
exports.showAdminLoginPage = (req, res) => {
    // Tambahkan 'error: null' untuk konsistensi
    res.render('admin/login', { title: 'Login Admin', error: null }); // 
};

exports.handleAdminLogin = (req, res) => {
    // Arahkan ke dashboard admin setelah login
    res.redirect('/admin/dashboard');
};