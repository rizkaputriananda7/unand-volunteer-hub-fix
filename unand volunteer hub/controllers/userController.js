exports.showMahasiswaDashboard = (req, res) => {
  // Kita kirim data statis ke view
  const userData = {
    name: 'Naufal HZ.',
    role: 'Mahasiswa'
  };
  res.render('mahasiswa/dashboard', {
    user: userData,
    title: 'Dashboard'
  });
};