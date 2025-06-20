const mysql = require('mysql2'); // Baris 1: Pastikan ini adalah baris pertama

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti sesuai password MySQL kamu
  database: 'unand_volunteer_hub' // ganti sesuai database kamu
});

connection.connect((err) => {
  if (err) {
    console.error('Koneksi MySQL gagal:', err.message);
    process.exit(1); // Keluar jika terjadi error
  }
  console.log('Tersambung ke database MySQL');
});

module.exports = connection.promise();