// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti sesuai password MySQL kamu
  database: 'unand_volunteer_db' // ganti sesuai database kamu
});

connection.connect((err) => {
  if (err) {
  console.error('Koneksi MySQL gagal:', err.message);
  return;
  }
  console.log('Tersambung ke database MySQL');
});

module.exports = connection;