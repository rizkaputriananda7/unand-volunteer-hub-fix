// controllers/userController.js

const { pengumumanData, programData, userData, bookmarkedPrograms } = require('../models/staticData');
//test
// 1. Dashboard
exports.showMahasiswaDashboard = (req, res) => {
  res.render('mahasiswa/dashboard', {
    user: userData.mahasiswa,
    title: 'Dashboard'
  });
};

// 2. Program Volunteer
exports.showProgramVolunteer = (req, res) => {
  res.render('mahasiswa/program', {
    user: userData.mahasiswa,
    title: 'Program Volunteer',
    programs: programData,
    bookmarkedIds: bookmarkedPrograms.map(p => p.id)
  });
};

// 3. Pendaftaran
exports.showPendaftaran = (req, res) => {
  res.render('mahasiswa/pendaftaran', {
    user: userData.mahasiswa,
    title: 'Pendaftaran'
  });
};

// 4. Deadline
exports.showDeadline = (req, res) => {
  res.render('mahasiswa/deadline', {
    user: userData.mahasiswa,
    title: 'Deadline'
  });
};

// Assuming necessary models and data are imported
const { Mahasiswa } = require('../models/Mahasiswa');

// 5. Status Pendaftaran
exports.showStatusPendaftaran = async (req, res) => {
  try {
    // Assuming we get the user's ID from the session or token
    const userId = req.session.userId; // Adjust based on your authentication method

    // Query the database for the user's registration status
    const [rows] = await Mahasiswa.getStatusByUserId(userId); // Modify based on your model method

    // If the user is not found or no status is available
    if (rows.length === 0) {
      return res.status(404).render('mahasiswa/status-pendaftaran', {
        message: 'Data pendaftaran tidak ditemukan.',
        title: 'Status Pendaftaran'
      });
    }

    // Pass the registration status to the view
    res.render('mahasiswa/status-pendaftaran', {
      status: rows[0].status, // Assuming the database returns a 'status' field
      title: 'Status Pendaftaran'
    });
  } catch (error) {
    console.error('Error fetching registration status:', error.message);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};

// 6. Pengumuman
exports.showPengumumanPage = (req, res) => {
  res.render('mahasiswa/pengumuman', {
    user: userData.mahasiswa,
    title: 'Pengumuman',
    pengumuman: pengumumanData
  });
};

exports.showPengumumanDetailPage = (req, res) => {
  const announcementId = parseInt(req.params.id);
  const announcement = pengumumanData.find(p => p.id === announcementId);
  if (announcement) {
    res.render('mahasiswa/pengumuman-detail', {
      user: userData.mahasiswa,
      title: announcement.judul,
      announcement
    });
  } else {
    res.status(404).send('Pengumuman tidak ditemukan');
  }
};

// 7. Kalender Pendaftaran
exports.showKalenderPendaftaran = (req, res) => {
  res.render('mahasiswa/kalender', {
    user: userData.mahasiswa,
    title: 'Kalender Pendaftaran'
  });
};

// 8. Riwayat Pendaftaran
exports.showRiwayatPendaftaran = (req, res) => {
  res.render('mahasiswa/riwayat', {
    user: userData.mahasiswa,
    title: 'Riwayat Pendaftaran'
  });
};

// 9. FAQ
exports.showFaqPage = (req, res) => {
  res.render('mahasiswa/faq', {
    user: userData.mahasiswa,
    title: 'FAQ'
  });
};

// Bookmark
exports.showBookmarkPage = (req, res) => {
  res.render('mahasiswa/bookmark', {
    user: userData.mahasiswa,
    title: 'Program Favorit',
    programs: bookmarkedPrograms
  });
};

exports.addBookmark = (req, res) => {
  const programId = parseInt(req.params.id);
  const program = programData.find(p => p.id === programId);
  const index = bookmarkedPrograms.findIndex(p => p.id === programId);

  if (program && index === -1) {
    bookmarkedPrograms.push(program);
  } else if (index > -1) {
    bookmarkedPrograms.splice(index, 1); // toggle
  }

  res.redirect('back');
};

exports.deleteBookmark = (req, res) => {
  const programId = parseInt(req.params.id);
  const index = bookmarkedPrograms.findIndex(p => p.id === programId);
  if (index > -1) {
    bookmarkedPrograms.splice(index, 1);
  }
  res.redirect('/mahasiswa/bookmark');
};