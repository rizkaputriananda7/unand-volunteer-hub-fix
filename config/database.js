// config/database.js
//const mysql = require('mysql2'); // Baris 1: Pastikan ini adalah baris pertama
// Baris 2: Jangan ada kode 'db' di sini atau di baris 1
//const connection = mysql.createConnection({
  //host: 'localhost',
  //user: 'root',
  //password: '', // ganti sesuai password MySQL kamu
  //database: 'unand_volunteer_db' // ganti sesuai database kamu
//});

//connection.connect((err) => {
  //if (err) {
//<<<<<<< HEAD
  //  console.error('Koneksi MySQL gagal:', err.message);
    //process.exit(1);
//=======
  //console.error('Koneksi MySQL gagal:', err.message);
  //return;
//>>>>>>> c1eae7c7617a5469ac1f4af928dc8302c711a0ce
  ///}
  //console.log('Tersambung ke database MySQL (menggunakan single connection)');
//});


//module.exports = connection.promise();

=======
connection.connect((err) => {
if (err) {
  console.error('Koneksi MySQL gagal:', err.message);
  return;
  }
  console.log('Tersambung ke database MySQL');
});

module.exports = connection;