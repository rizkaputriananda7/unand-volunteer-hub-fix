// controllers/authController.js

const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

/**
 * FUNGSI YANG DITAMBAHKAN KEMBALI: Menampilkan halaman pemilihan peran.
 */
exports.showRoleSelection = (req, res) => {
    // Pastikan Anda memiliki view bernama 'role_pengguna.ejs' di folder 'src/views/'
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

// --- Placeholder untuk fungsi login lainnya ---

exports.handleMahasiswaLogin = (req, res) => {
    res.redirect('/mahasiswa/dashboard');
};

exports.handlePengurusLogin = (req, res) => {
    res.redirect('/pengurus/dashboard');
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/admin/login');
    });
};