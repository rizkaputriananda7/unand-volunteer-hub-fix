const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./config/database'); // Anda akan memerlukan ini nanti saat beralih ke mysql2
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
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
app.use(pengurusRoutes);
app.use(programRoutes);
app.use(registerRoutes);
app.use(userRoutes);

// Menjalankan server secara langsung tanpa sinkronisasi database
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});