// app.js

const express = require('express');
const path = require('path');
const app = express();

// ======= Tambahan koneksi MySQL ==========
const db = require('./config/database'); // pastikan path benar jika kamu taruh di folder 'config'
// ========================================

const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const programRoutes = require('./routes/programRoutes.js');
const pengurusRoutes = require('./routes/pengurusRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);
app.use('/mahasiswa', userRoutes);
app.use('/', programRoutes);
app.use('/pengurus', pengurusRoutes);
app.use('/admin', adminRoutes);
// Kirim koneksi database ke middleware lain jika dibutuhkan
app.set('db', db); // jika kamu butuh akses db dari req.app.get('db')

module.exports = app;
