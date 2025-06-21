const express = require('express');
const path = require('path');
const db = require('./config/database'); // Anda akan memerlukan ini nanti saat beralih ke mysql2
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Impor rute
const adminRoutes = require('./routes/adminRoutes');
const authRoutes =require('./routes/authRoutes');
const pengurusRoutes = require('./routes/pengurusRoutes');
const programRoutes = require('./routes/programRoutes');
const registerRoutes = require('./routes/registerRoutes');
const userRoutes = require('./routes/userRoutes');

// Gunakan rute
app.use(adminRoutes);
app.use(authRoutes);
app.use('/pengurus', pengurusRoutes);
app.use(programRoutes);
app.use(registerRoutes);
app.use('/mahasiswa', userRoutes);

module.exports = app;