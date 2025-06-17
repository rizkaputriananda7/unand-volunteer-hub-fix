// app.js

const express = require('express');
const path = require('path');
const app = express();

// Import rute-rute yang kita butuhkan
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js'); // <-- KEMUNGKINAN BESAR BARIS INI YANG LUPA DITAMBAHKAN

// Konfigurasi View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware untuk menyajikan file statis (CSS, JS, Gambar) dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan Rute yang sudah diimpor
app.use('/', authRoutes);
app.use('/mahasiswa', userRoutes); // Baris ini yang menyebabkan error karena 'userRoutes' belum didefinisikan di atas

module.exports = app;