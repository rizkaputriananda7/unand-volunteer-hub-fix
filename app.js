// app.js

const express = require('express');
const path = require('path');
const app = express();

// ======= Tambahan koneksi MySQL ==========
const db = require('./config/database'); // pastikan path benar jika kamu taruh di folder 'config'
// ========================================

// Import rute-rute
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan rute
app.use('/', authRoutes);
app.use('/mahasiswa', userRoutes);

// Kirim koneksi database ke middleware lain jika dibutuhkan
app.set('db', db); // jika kamu butuh akses db dari req.app.get('db')

module.exports = app;