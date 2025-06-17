// controllers/userController.js

// --- DATA STATIS ---
const pengumumanData = [
  { id: 1, tanggal: '15 Juni 2025', judul: 'Hasil Seleksi Volunteer Mengajar Angkatan V', isi: 'Selamat kepada para peserta yang lolos! Silakan cek email masing-masing untuk informasi lebih lanjut mengenai tahap selanjutnya. Technical meeting akan diadakan pada tanggal 18 Juni 2025.'},
  { id: 2, tanggal: '14 Juni 2025', judul: 'Pendaftaran Aksi Bersih Pantai Resmi Dibuka!', isi: 'Mari bergabung dalam aksi peduli lingkungan di Pantai Padang. Pendaftaran dibuka hingga 20 Juni 2025. Jadilah bagian dari perubahan!'},
  { id: 3, tanggal: '10 Juni 2025', judul: 'Perubahan Jadwal Program Donor Darah', isi: 'Diinformasikan bahwa jadwal program donor darah diundur menjadi tanggal 30 Juni 2025 karena alasan teknis. Mohon maaf atas ketidaknyamanannya.'}
];

const programData = [
    { id: 1, judul: 'Migas center Unand', pusat: 'Migas Center', kuota: 20, durasi: '12 Bulan', status: 'Penuh', kategori: 'Edukasi' },
    { id: 2, judul: 'American Corner', pusat: 'American Corner', kuota: 20, durasi: '3 Bulan', status: 'Terbuka', kategori: 'Layanan' },
    { id: 3, judul: 'GID BEI Unand', pusat: 'GID BEI Unand', kuota: 20, durasi: '6 Bulan', status: 'Terbuka', kategori: 'Finansial' },
    { id: 4, judul: 'Volunteer Edukasi Anak Nagari', pusat: 'Pusat Pengabdian Masyarakat', kuota: 15, durasi: '4 Bulan', status: 'Terbuka', kategori: 'Edukasi' },
    { id: 5, judul: 'Peduli Lingkungan Kampus Hijau', pusat: 'Fakultas Pertanian', kuota: 25, durasi: '2 Bulan', status: 'Terbuka', kategori: 'Lingkungan' }
];

const userData = { name: 'Naufal H.', role: 'Mahasiswa' };

// --- KUMPULAN FUNGSI ---

exports.showMahasiswaDashboard = (req, res) => {
  res.render('mahasiswa/dashboard', { user: userData, title: 'Dashboard' });
};

exports.showFaqPage = (req, res) => {
  res.render('mahasiswa/faq', { user: userData, title: 'FAQ' });
};

exports.showPengumumanPage = (req, res) => {
  res.render('mahasiswa/pengumuman', { user: userData, title: 'Pengumuman', pengumuman: pengumumanData });
};

exports.showPengumumanDetailPage = (req, res) => {
  const announcementId = parseInt(req.params.id);
  const announcement = pengumumanData.find(p => p.id === announcementId);
  if (announcement) {
    res.render('mahasiswa/pengumuman-detail', { user: userData, title: announcement.judul, announcement: announcement });
  } else {
    res.status(404).send('Pengumuman tidak ditemukan');
  }
};

// --- FUNGSI BARU UNTUK PROGRAM & FILTER ---
exports.showProgramPage = (req, res) => {
    // Ambil query dari URL, contoh: /program?status=Terbuka
    const { status, kategori, pusat } = req.query;

    // Mulai dengan semua data
    let filteredPrograms = programData;

    // Lakukan filter jika query ada
    if (status) {
        filteredPrograms = filteredPrograms.filter(p => p.status === status);
    }
    if (kategori) {
        filteredPrograms = filteredPrograms.filter(p => p.kategori === kategori);
    }
    if (pusat) {
        filteredPrograms = filteredPrograms.filter(p => p.pusat === pusat);
    }

    res.render('mahasiswa/program', {
        user: userData,
        title: 'Program Volunteer',
        programs: filteredPrograms // Kirim data yang sudah difilter
    });
};