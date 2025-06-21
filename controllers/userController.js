/**
 * controllers/userController.js (Versi Final dengan Data Statis)
 * * Memperbaiki error duplikasi deklarasi 'registrationsData'.
 * * Menggunakan data terpusat dari '../models/staticData.js'.
 * * Semua fungsionalitas yang sudah Anda buat tetap dipertahankan.
 */

// Impor semua data statis dari satu sumber di bagian paling atas
const { userData, programData, registrationsData, bookmarkedPrograms } = require('../models/staticData');

// Fungsi untuk menampilkan dashboard volunteer (mahasiswa)
exports.showMahasiswaDashboard = (req, res) => {
    // Simulasi user login (bisa diganti dengan session/user login sebenarnya)
    const user = { name: 'Iqbal H.', role: 'Mahasiswa' };
    const userId = 101; // id user dummy
    const aktif = registrationsData.filter(r => r.userId === userId && [1, 2].includes(r.programId)).length; // contoh logika
    const diproses = 1; // dummy
    const pengumumanBaru = 2; // dummy
    const jadwalMendatang = [
        {
            judul: 'Technical Meeting: Volunteer Mengajar',
            waktu: '18 Juni 2025, 10:00 WIB',
            tempat: 'via Zoom',
            link: '#'
        },
        {
            judul: 'Hari Pertama, Aksi Bersih Pantai',
            waktu: '22 Juni 2025, 08:00 WIB',
            tempat: 'Pantai Padang',
            link: '#'
        }
    ];
    res.render('mahasiswa/dashboard', {
        title: 'Dashboard',
        user,
        aktif,
        diproses,
        pengumumanBaru,
        jadwalMendatang,
        currentRoute: '/mahasiswa/dashboard'
    });
};

// Fungsi untuk status pendaftaran
exports.getStatusPendaftaran = (req, res) => {
    // --- SIMULASI USER LOGIN DIMULAI ---
    const user = { name: 'Iqbal H.', role: 'Mahasiswa' };
    const userId = 101; // ID user dummy yang akan kita gunakan untuk filter
    // --- SIMULASI USER LOGIN SELESAI ---

    const { status } = req.query;

    // 1. Filter pendaftaran hanya untuk user yang sedang login (userId 101)
    let userRegistrations = registrationsData.filter(reg => reg.userId === userId);

    // 2. Terapkan filter status (Diterima, Ditolak, dll) pada data yang sudah difilter per user
    if (status && status !== 'semua') {
        userRegistrations = userRegistrations.filter(reg => reg.status === status);
    }

    res.render('mahasiswa/status-pendaftaran', {
        // 'layout' sudah dihapus, sesuai permintaan Anda sebelumnya
        
        title: 'Status Pendaftaran',
        // Kirim data pendaftaran yang SUDAH DIFILTER berdasarkan user
        registrations: userRegistrations,
        // Kirim data user untuk ditampilkan di sidebar
        user: user
    });
};

// Fungsi untuk menampilkan halaman profil
exports.getProfile = (req, res) => {
    res.render('mahasiswa/profile', {
        title: 'Profile',
        layout: 'mahasiswa/layout', // Menambahkan layout konsisten
        user: userData.mahasiswa, // Mengirim data user statis
        currentRoute: '/mahasiswa/profile'
    });
};

// Fungsi untuk menampilkan halaman notifikasi
exports.getNotifikasi = (req, res) => {
    res.render('mahasiswa/notifikasi', {
        title: 'Notifikasi',
        layout: 'mahasiswa/layout', // Menambahkan layout konsisten
        currentRoute: '/mahasiswa/notifikasi'
    });
};

// Fungsi untuk menampilkan halaman bookmark
exports.getBookmark = (req, res) => {
    res.render('mahasiswa/bookmark', {
        title: 'Bookmark',
        layout: 'mahasiswa/layout', // Menambahkan layout konsisten
        user: { name: 'Iqbal H.', role: 'Mahasiswa' },
        programs: bookmarkedPrograms, // Mengirim data program yang di-bookmark
        currentRoute: '/mahasiswa/bookmark'
    });
};

// Fungsi untuk menampilkan halaman riwayat
exports.getRiwayat = (req, res) => {
    res.render('mahasiswa/riwayat', {
        title: 'Riwayat',
        layout: 'mahasiswa/layout', // Menambahkan layout konsisten
        currentRoute: '/mahasiswa/riwayat'
    });
};

// Fungsi untuk menampilkan halaman kalender
exports.getKalender = (req, res) => {
    res.render('mahasiswa/kalender', {
        title: 'Kalender',
        layout: 'mahasiswa/layout', // Menambahkan layout konsisten
        currentRoute: '/mahasiswa/kalender'
    });
};

// Fungsi untuk menampilkan halaman deadline
exports.getDeadline = (req, res) => {
    res.render('mahasiswa/deadline', {
        title: 'Deadline',
        layout: 'mahasiswa/layout', // Menambahkan layout konsisten
        currentRoute: '/mahasiswa/deadline'
    });
};

// Fungsi untuk menampilkan halaman pengaturan
exports.getPengaturan = (req, res) => {
    res.render('mahasiswa/pengaturan', {
        title: 'Pengaturan',
        layout: 'mahasiswa/layout', // Menambahkan layout konsisten
        currentRoute: '/mahasiswa/pengaturan'
    });
};

// Menambah program ke bookmark
exports.addBookmark = (req, res) => {
    // Tidak perlu require di sini karena sudah diimpor di atas
    const programId = parseInt(req.params.id);
    const program = programData.find(p => p.id === programId);
    if (program && !bookmarkedPrograms.some(p => p.id === programId)) {
        bookmarkedPrograms.push(program);
    }
    res.redirect('/mahasiswa/program');
};

// Menghapus program dari bookmark
exports.deleteBookmark = (req, res) => {
    // Tidak perlu require di sini karena sudah diimpor di atas
    const programId = parseInt(req.params.id);
    const idx = bookmarkedPrograms.findIndex(p => p.id === programId);
    if (idx !== -1) {
        bookmarkedPrograms.splice(idx, 1);
    }
    res.redirect('/mahasiswa/bookmark'); // Redirect ke halaman bookmark
};