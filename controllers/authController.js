/**
 * controllers/authController.js (Versi dengan Data Statis)
 * * Menggunakan data statis untuk simulasi login sesuai permintaan.
 */

// const { userData } = require('../models/staticData'); // Baris ini bisa diaktifkan jika Anda memiliki file staticData.js

// 1. Fungsi untuk menampilkan halaman pemilihan peran
exports.showRoleSelection = (req, res) => {
    res.render('role_pengguna', { // Pastikan view 'role_pengguna.ejs' ada
        title: 'Selamat Datang'
    });
};

// 2. Fungsi untuk menampilkan halaman login mahasiswa
exports.showMahasiswaLoginPage = (req, res) => {
    res.render('mahasiswa/login', { 
        title: 'Login Mahasiswa',
        error: null 
    });
};

// 3. Fungsi untuk menangani submit form login mahasiswa
exports.handleMahasiswaLogin = (req, res) => {
    // Untuk saat ini, langsung arahkan ke dashboard.
    res.redirect('/mahasiswa/dashboard');
};

// 4. Fungsi untuk menampilkan halaman login pengurus
exports.showPengurusLoginPage = (req, res) => {
    res.render('pengurus/login', { 
        title: 'Login Pengurus', 
        error: null 
    });
};

// 5. Fungsi untuk menangani login pengurus
exports.handlePengurusLogin = (req, res) => {
    // Arahkan ke dashboard pengurus setelah login
    res.redirect('/pengurus/dashboard');
};

// 6. Fungsi untuk menampilkan halaman login admin
exports.showAdminLoginPage = (req, res) => {
    res.render('admin/login', { 
        title: 'Login Admin', 
        error: null 
    });
};

// 7. Fungsi untuk menangani login admin
exports.handleAdminLogin = (req, res) => {
    // Arahkan ke dashboard admin setelah login
    res.redirect('/admin/dashboard');
};

// 8. Fungsi untuk menangani logout (jika diperlukan)
exports.logout = (req, res) => {
    // TODO: Implementasikan logika untuk menghancurkan session
    res.redirect('/'); // Redirect ke halaman utama atau pemilihan peran
};