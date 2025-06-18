const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const db = req.app.get('db');
  const { nim, nama, password } = req.body;

  const nimRegex = /^[A-Za-z0-9]{10}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!nim || !nama || !password) {
    return res.render('register', { error: 'Semua field wajib diisi!' });
  }

  if (!nimRegex.test(nim)) {
    return res.render('register', { error: 'NIM harus 10 karakter alfanumerik' });
  }

  if (nama.length > 30) {
    return res.render('register', { error: 'Nama maksimal 30 karakter' });
  }

  if (!passwordRegex.test(password)) {
    return res.render('register', { error: 'Password minimal 8 karakter dan kombinasi huruf & angka' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM mahasiswa WHERE nim = ?', [nim]);
    if (existing.length > 0) {
      return res.render('register', { error: 'NIM sudah terdaftar' });
    }

    // Simpan user baru
    await db.query('INSERT INTO mahasiswa (nim, nama, password) VALUES (?, ?, ?)', [nim, nama, password]);
    res.send('Pendaftaran berhasil!');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Terjadi kesalahan saat mendaftar' });
  }
});

module.exports = router;