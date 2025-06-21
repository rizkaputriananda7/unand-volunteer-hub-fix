const jwt = require('jsonwebtoken');
const Mahasiswa = require('../models/Mahasiswa');
const Pengurus = require('../models/Pengurus');
const Admin = require('../models/Admin');

/**
 * Middleware untuk memverifikasi token dan melampirkan data pengguna ke request.
 * Jika tidak ada token, pengguna akan diarahkan ke halaman utama.
 */
exports.authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        // Jika tidak ada token sama sekali, tidak ada sesi, kembali ke halaman awal.
        return res.redirect('/'); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user;
        
        // Cari pengguna di tabel yang benar berdasarkan peran di dalam token
        switch (decoded.role) {
            case 'mahasiswa':
                user = await Mahasiswa.findById(decoded.id);
                break;
            case 'pengurus':
                user = await Pengurus.findById(decoded.id);
                break;
            case 'admin':
                user = await Admin.findById(decoded.id);
                break;
            default:
                // Jika peran di token tidak dikenali, hapus cookie dan redirect
                res.clearCookie('token');
                return res.redirect('/');
        }
        
        if (!user) {
            // Jika pengguna dengan ID tersebut tidak ditemukan di database
            res.clearCookie('token');
            return res.redirect('/');
        }
        
        user.role = decoded.role; // Pastikan objek user memiliki properti peran
        req.user = user;         // Sediakan untuk logika controller
        res.locals.user = user;  // Sediakan untuk semua view EJS
        
        next(); // Lanjutkan ke middleware berikutnya (misalnya, authorizeRole)

    } catch (err) {
        // Jika token tidak valid (kadaluwarsa, korup, dll)
        res.clearCookie('token');
        return res.redirect('/');
    }
};

/**
 * Middleware otorisasi yang lebih fleksibel.
 * @param {string} requiredRole - Peran yang diperlukan untuk mengakses rute.
 */
exports.authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        // Jika tidak ada user yang login (misalnya, token baru saja kadaluwarsa),
        // authenticateToken seharusnya sudah melakukan redirect, tapi ini sebagai pengaman tambahan.
        if (!req.user) {
            return res.redirect('/');
        }

        const userRole = req.user.role;

        // 1. Admin (Super User) selalu diizinkan mengakses halaman mana pun.
        if (userRole === 'admin') {
            return next();
        }

        // 2. Jika peran pengguna cocok dengan peran yang dibutuhkan, izinkan.
        if (userRole === requiredRole) {
            return next();
        }
        
        // 3. Jika tidak cocok, jangan tampilkan "Akses Ditolak".
        //    Sebagai gantinya, arahkan pengguna kembali ke dashboard mereka sendiri.
        console.log(`Akses ditolak: Pengguna '${userRole}' mencoba mengakses halaman untuk '${requiredRole}'. Mengarahkan ke dashboard...`);
        res.redirect(`/${userRole}/dashboard`);
    };
};
