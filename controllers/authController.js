// Mengimpor semua model yang diperlukan
const Mahasiswa = require("../models/Mahasiswa");
const Pengurus = require("../models/Pengurus");
const Admin = require("../models/Admin");
const VolunteerCenter = require("../models/VolunteerCenter");

// Mengimpor pustaka untuk token dan enkripsi
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * Menampilkan halaman pemilihan peran.
 * Semua halaman otentikasi menggunakan layout-auth.
 */
exports.showRolePage = (req, res) => {
  res.render("role_pengguna", {
    title: "Pilih Peran",
    layout: "partials/layout-auth",
  });
};

/**
 * Menampilkan halaman login berdasarkan peran yang dipilih.
 */
exports.showLoginPage = (req, res) => {
  const { role = "mahasiswa" } = req.query; // Default ke mahasiswa jika tidak ada query
  const title = `Login ${role.charAt(0).toUpperCase() + role.slice(1)}`;

  res.render(`${role}/login`, {
    title: title,
    role: role,
    error: null, // Mulai tanpa pesan error
    layout: "partials/layout-auth", // Memaksa penggunaan layout otentikasi
  });
};

/**
 * Menampilkan halaman registrasi. Untuk pengurus, ini akan mengambil
 * daftar pusat volunteer dari database untuk ditampilkan di dropdown.
 */
exports.showRegisterPage = async (req, res) => {
  const { role = "mahasiswa" } = req.query;
  const title = `Daftar Akun ${role.charAt(0).toUpperCase() + role.slice(1)}`;
  let pageData = {
    title: title,
    role: role,
    error: null,
    layout: "partials/layout-auth",
  };

  // Jika yang mendaftar adalah pengurus, kita butuh daftar pusat volunteer
  if (role === "pengurus") {
    try {
      const centers = await VolunteerCenter.findAll();
      pageData.centers = centers;
    } catch (error) {
      console.error("Gagal mengambil data pusat volunteer:", error);
      pageData.error =
        "Tidak dapat memuat data pusat volunteer. Silakan coba lagi.";
      pageData.centers = [];
    }
  }

  res.render(`${role}/buat_akun`, pageData);
};

exports.login = async (req, res) => {
  const { role, password } = req.body;
  try {
    let user;

    // 1. Cari pengguna di tabel yang benar terlebih dahulu.
    switch (role) {
      case "mahasiswa":
        user = await Mahasiswa.findByNim(req.body.nim);
        break;
      case "pengurus":
        user = await Pengurus.findByUsername(req.body.username);
        break;
      case "admin":
        user = await Admin.findByUsername(req.body.username);
        break;
      default:
        throw new Error("Peran tidak valid.");
    }

    // 2. Lakukan semua validasi setelah pengguna ditemukan.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Kredensial tidak valid. Periksa kembali.");
    }

    if (user.status === "Tidak Aktif") {
      throw new Error(
        "Akun Anda saat ini tidak aktif. Silakan hubungi administrator."
      );
    }

    // 3. Jika semua validasi lolos, buat token.
    const tokenPayload = { id: user.id, role: role };
    if (role === "pengurus") {
      tokenPayload.center_id = user.volunteer_center_id;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.redirect(`/${role}/dashboard`);
  } catch (error) {
    // Jika terjadi error, render kembali halaman login dengan pesan yang sesuai.
    res.status(401).render(`${role}/login`, {
      title: `Login Gagal`,
      error: error.message,
      role: role,
      layout: "partials/layout-auth",
    });
  }
};

/**
 * Memproses permintaan registrasi dari semua peran.
 */
exports.register = async (req, res) => {
  const { role } = req.body;

  try {
    switch (role) {
      case "mahasiswa":
        await Mahasiswa.create(req.body);
        break;
      case "pengurus":
        await Pengurus.create(req.body);
        break;
      case "admin":
        // Untuk keamanan, pastikan ada validasi tambahan seperti kode akses
        if (req.body.access_code !== process.env.ADMIN_ACCESS_CODE) {
          throw new Error("Kode akses untuk admin tidak valid.");
        }
        await Admin.create(req.body);
        break;
      default:
        throw new Error("Peran tidak valid.");
    }

    // Jika registrasi berhasil, redirect ke halaman login untuk peran tersebut
    res.redirect(`/auth/login?role=${role}`);
  } catch (error) {
    // Jika registrasi gagal (misal: NIM/username sudah ada), render kembali halaman registrasi dengan pesan error.
    const title = `Daftar Akun Gagal`;
    let pageData = {
      title,
      error: error.message,
      role,
      layout: "partials/layout-auth",
    };

    if (role === "pengurus") {
      pageData.centers = await VolunteerCenter.findAll();
    }

    res.status(400).render(`${role}/buat_akun`, pageData);
  }
};

/**
 * Proses logout, menghapus cookie token.
 */
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
