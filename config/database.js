const mysql = require('mysql2/promise');
require('dotenv').config();

// Membuat connection pool untuk efisiensi koneksi
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fungsi untuk mengetes koneksi
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Koneksi ke database MySQL berhasil.');
        connection.release(); // Melepaskan koneksi kembali ke pool
    } catch (error) {
        console.error('Error saat menghubungkan ke database:', error);
    }
}

// Panggil fungsi tes koneksi saat aplikasi pertama kali dijalankan
testConnection();

module.exports = pool;  