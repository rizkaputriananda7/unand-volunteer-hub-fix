const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

// Impor rute Anda
const mainRoutes = require('./routes/index'); 
const authRoutes = require('./routes/authRoutes');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const pengurusRoutes = require('./routes/pengurusRoutes');
const adminRoutes = require('./routes/adminRoutes');
const programRoutes = require('./routes/programRoutes');
const PengumumanGlobal = require('./models/PengumumanGlobal');

const app = express();

// Konfigurasi EJS dan Layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout'); // Menetapkan layout default

// Middleware bawaan
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Middleware ini berjalan di setiap request untuk menyediakan data 'user' ke semua view jika ada token yang valid.
app.use(async (req, res, next) => {
    const token = req.cookies.token;
    res.locals.user = null; // Secara default, tidak ada pengguna yang login

    if (token) {
        const jwt = require('jsonwebtoken');
        // Impor semua model peran
        const Mahasiswa = require('./models/Mahasiswa');
        const Pengurus = require('./models/Pengurus');
        const Admin = require('./models/Admin');

        try {
            // Verifikasi token untuk mendapatkan 'id' dan 'role'
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            let user;

            // Cari pengguna di tabel yang benar berdasarkan peran dari token
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
            }
            
            if (user) {
                user.role = decoded.role; // Pastikan objek user memiliki properti role
                res.locals.user = user;   // Sediakan objek user ke semua file EJS
            }
        } catch (err) {
            // Jika token tidak valid (kadaluwarsa, dll), biarkan user tetap null.
            console.log("Token tidak valid, melanjutkan sebagai guest.");
        }
    }
    next(); // Lanjutkan ke middleware atau rute berikutnya
});
app.use(async (req, res, next) => {
    // Ambil pengumuman aktif dan sediakan ke SEMUA halaman
    try {
        res.locals.activeGlobalAnnouncement = await PengumumanGlobal.findActive();
    } catch (error) {
        res.locals.activeGlobalAnnouncement = null;
    }
    next();
});

// Penggunaan Rute
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/mahasiswa', mahasiswaRoutes);
app.use('/pengurus', pengurusRoutes);
app.use('/admin', adminRoutes);
app.use('/programs', programRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan pada server!');
});

module.exports = app;