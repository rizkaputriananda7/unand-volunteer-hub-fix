const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./config/database'); // Anda akan memerlukan ini nanti saat beralih ke mysql2
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- KONFIGURASI SESI BARU ---
app.use(session({
    secret: 'ini-adalah-secret-key-yang-sangat-rahasia-ganti-nanti', // Ganti dengan secret acak
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set ke true jika Anda menggunakan HTTPS
}));

// Menyimpan koneksi database di dalam aplikasi Express
app.set('db', db);

// Impor rute
const adminRoutes = require('./routes/adminRoutes');
const authRoutes =require('./routes/authRoutes');
const pengurusRoutes = require('./routes/pengurusRoutes');
const programRoutes = require('./routes/programRoutes');
const registerRoutes = require('./routes/registerRoutes');
const userRoutes = require('./routes/userRoutes');

// Gunakan rute
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/pengurus', pengurusRoutes);
app.use('/program', programRoutes);
app.use('/register', registerRoutes);
app.use('/mahasiswa', userRoutes);

module.exports = app;