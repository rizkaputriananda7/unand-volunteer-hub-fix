/**
 * controllers/userController.js (Versi dengan Data Statis)
 * * Logika diubah untuk memuat dan menampilkan data dari file staticData.js
 * * sesuai dengan permintaan Anda.
 */

// Impor data statis sebagai pengganti database
const { userData, programData, registrationsData, bookmarkedPrograms } = require('../models/staticData');

// Fungsi untuk menampilkan halaman status pendaftaran
exports.getStatusPendaftaran = async (req, res) => {
    try {
        // Filter pendaftaran hanya untuk mahasiswa yang sedang "login" (ID = 1)
        const userRegistrations = registrationsData.filter(reg => reg.mahasiswaId === 1);

        // Tambahkan detail program ke setiap pendaftaran
        const pendaftaranLengkap = userRegistrations.map(reg => {
            const program = programData.find(p => p.id === reg.programId);
            return {
                ...reg,
                program: program || { nama_program: 'Tidak Ditemukan', penyelenggara: '-' }
            };
        });

        res.render('mahasiswa/status-pendaftaran', {
            title: 'Status Pendaftaran',
            pendaftaran: pendaftaranLengkap,
            currentRoute: '/mahasiswa/status-pendaftaran'
        });
    } catch (error) {
        console.error("Error pada halaman status pendaftaran:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

// Fungsi untuk menampilkan halaman profil
exports.getProfile = (req, res) => {
    res.render('mahasiswa/profile', {
        title: 'Profile',
       
        user: userData.mahasiswa, // Mengirim data user statis
        currentRoute: '/mahasiswa/profile'
    });
};

// Fungsi untuk menampilkan halaman notifikasi
exports.getNotifikasi = (req, res) => {
    res.render('mahasiswa/notifikasi', { 
        title: 'Notifikasi', 
        
        currentRoute: '/mahasiswa/notifikasi' 
    });
};

// Fungsi untuk menampilkan halaman bookmark
exports.getBookmark = (req, res) => {
    res.render('mahasiswa/bookmark', { 
        title: 'Bookmark', 
       
        programs: bookmarkedPrograms, // Mengirim data program yang di-bookmark
        currentRoute: '/mahasiswa/bookmark' 
    });
};

// Fungsi untuk menampilkan halaman riwayat
exports.getRiwayat = (req, res) => {
    res.render('mahasiswa/riwayat', { 
        title: 'Riwayat', 
       
        currentRoute: '/mahasiswa/riwayat' 
    });
};

// Fungsi untuk menampilkan halaman kalender
exports.getKalender = (req, res) => {
    res.render('mahasiswa/kalender', { 
        title: 'Kalender', 
       
        currentRoute: '/mahasiswa/kalender' 
    });
};

// Fungsi untuk menampilkan halaman deadline
exports.getDeadline = (req, res) => {
    res.render('mahasiswa/deadline', { 
        title: 'Deadline', 
       
        currentRoute: '/mahasiswa/deadline' 
    });
};

// Fungsi untuk menampilkan halaman pengaturan
exports.getPengaturan = (req, res) => {
    res.render('mahasiswa/pengaturan', { 
        title: 'Pengaturan', 
      
        currentRoute: '/mahasiswa/pengaturan' 
    });
};

// Fungsi untuk menampilkan dashboard volunteer (mahasiswa)
exports.showMahasiswaDashboard = (req, res) => {
    // Simulasi user login (bisa diganti dengan session/user login sebenarnya)
    const user = { name: 'Iqbal H.', role: 'Mahasiswa' };
    const userId = 101; // id user dummy
    const aktif = registrationsData.filter(r => r.userId === userId && [1,2].includes(r.programId)).length; // contoh logika
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