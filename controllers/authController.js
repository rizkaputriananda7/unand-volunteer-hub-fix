// controllers/authController.js

const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const Mahasiswa = require('../models/Mahasiswa'); 

/**
 * FUNGSI YANG DITAMBAHKAN KEMBALI: Menampilkan halaman pemilihan peran.
 */
exports.showRoleSelection = (req, res) => {
    res.render('role_pengguna', { 
        title: 'Selamat Datang'
    });
};


// Fungsi untuk menampilkan halaman login
exports.showAdminLoginPage = (req, res) => {
    res.render('admin/login', { title: 'Login Admin', error: null });
};

exports.showMahasiswaLoginPage = (req, res) => {
    res.render('mahasiswa/login', { title: 'Login Mahasiswa', error: null });
};

exports.showPengurusLoginPage = (req, res) => {
    res.render('pengurus/login', { title: 'Login Pengurus', error: null });
};


/**
 * Menangani proses login untuk Admin dengan verifikasi database & session.
 */
exports.handleAdminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findByUsername(username);

        if (!admin) {
            return res.render('admin/login', { title: 'Login Admin', error: 'Username atau password salah.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.render('admin/login', { title: 'Login Admin', error: 'Username atau password salah.' });
        }

        req.session.isLoggedIn = true;
        req.session.user = {
            id: admin.id,
            username: admin.username,
            nama_lengkap: admin.nama_lengkap,
            role: 'admin'
        };

        return req.session.save(err => {
            if (err) {
                console.log(err);
                return res.status(500).send('Gagal menyimpan sesi.');
            }
            res.redirect('/admin/dashboard');
        });

    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).send('Terjadi kesalahan pada server.');
    }
};


// --- AWAL PERUBAHAN ---
/**
 * Menangani proses login DUMMY untuk Mahasiswa.
 * Tidak peduli apa yang diinput, akan selalu login sebagai pengguna "Mahasiswa Dummy".
 */
exports.handleMahasiswaLogin = async (req, res) => {
    // Semua input dari form (nim, password, dll) akan diabaikan.

    try {
        // Langsung buat sesi untuk pengguna dummy.
        req.session.isLoggedIn = true;
        req.session.user = {
            id: 999, // ID palsu
            nim: '1234567890', // NIM palsu
            nama: 'Mahasiswa Dummy', // Nama palsu
            role: 'mahasiswa'
        };

        // Simpan sesi dan redirect ke dashboard mahasiswa.
        return req.session.save(err => {
            if (err) {
                console.error('Gagal menyimpan sesi:', err);
                return res.status(500).send('Terjadi kesalahan pada server.');
            }
            res.redirect('/mahasiswa/dashboard');
        });

    } catch (error) {
        console.error("Error saat login mahasiswa dummy:", error);
        res.status(500).send('Terjadi kesalahan pada server.');
    }
};
// --- AKHIR PERUBAHAN ---

exports.handlePengurusLogin = (req, res) => {
    // (Logika untuk login pengurus bisa ditambahkan di sini dengan cara yang sama)
    res.redirect('/pengurus/dashboard');
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            // Jika ada error, tetap coba redirect
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Hapus cookie sesi
        res.redirect('/auth'); // Redirect ke halaman pemilihan peran
    });
};