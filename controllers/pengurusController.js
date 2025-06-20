/**
 * controllers/pengurusController.js (Diperbaiki)
 * * Duplikasi fungsi telah dihapus.
 * * Kode diorganisir ulang untuk kejelasan.
 * * Fungsionalitas berbasis model dipertahankan sesuai kode yang diberikan.
 */

const Program = require("../models/Program");
const Aplikasi = require("../models/Aplikasi");
const Jadwal = require("../models/Jadwal");
const Pengumuman = require("../models/Pengumuman");

// Menampilkan Dashboard
exports.showDashboard = async (req, res) => {
    try {
        // Asumsi: req.user berisi data pengurus yang login, termasuk volunteer_center_id
        const centerId = req.user.volunteer_center_id;
        const programs = await Program.findByCenter(centerId);
        res.render("pengurus/dashboard", {
            title: "Dashboard Pengurus",
            active: "dashboard",
            programs: programs,
        });
    } catch (error) {
        console.error("Error memuat dashboard:", error);
        res.status(500).send("Error memuat dashboard.");
    }
};

// --- Manajemen Program ---
exports.showCreateProgramForm = (req, res) => {
    res.render("pengurus/buat-program", {
        title: "Buat Program Baru",
        active: "buat-program",
        error: null,
    });
};

exports.handleCreateProgram = async (req, res) => {
    try {
        const coordinatorId = req.user.id;
        const centerId = req.user.volunteer_center_id;

        if (!coordinatorId || !centerId) {
            throw new Error("Informasi pengurus tidak lengkap. Silakan login ulang.");
        }
        await Program.create(req.body, coordinatorId, centerId);
        res.redirect("/pengurus/dashboard");
    } catch (error) {
        console.error("Error saat membuat program:", error);
        res.status(500).render("pengurus/buat-program", {
            title: "Gagal Membuat Program",
            active: "buat-program",
            error: "Terjadi kesalahan saat menyimpan program. Mohon periksa kembali semua data yang Anda masukkan.",
        });
    }
};

// --- Manajemen Seleksi ---
exports.showSelectionManagement = async (req, res) => {
    try {
        const centerId = req.user.volunteer_center_id;
        const programs = await Program.findByCenter(centerId);
        const aplikasi = await Aplikasi.findByCenter(centerId);

        res.render("pengurus/manajemen-seleksi", {
            title: "Manajemen Seleksi",
            active: "seleksi",
            programs: programs,
            aplikasi: aplikasi,
            error: null,
        });
    } catch (error) {
        console.error("Error memuat halaman manajemen seleksi:", error);
        res.status(500).send("Gagal memuat halaman.");
    }
};

exports.updateSelectionStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        await Aplikasi.updateStatus(applicationId, { status: status });
        res.redirect("/pengurus/seleksi");
    } catch (error) {
        console.error("Gagal memperbarui status:", error);
        res.redirect("/pengurus/seleksi?error=update_failed");
    }
};

// --- Manajemen Jadwal ---
exports.showJadwalPage = async (req, res) => {
    try {
        const centerId = req.user.volunteer_center_id;
        const programs = await Program.findByCenter(centerId);
        const jadwal = await Jadwal.findByCenter(centerId);

        res.render("pengurus/jadwal", {
            title: "Manajemen Jadwal",
            active: "jadwal",
            programs: programs,
            jadwal: jadwal,
            error: null,
        });
    } catch (error) {
        console.error("Error memuat halaman jadwal:", error);
        res.status(500).send("Gagal memuat halaman jadwal.");
    }
};

exports.handleCreateJadwal = async (req, res) => {
    try {
        await Jadwal.create(req.body);
        res.redirect("/pengurus/jadwal");
    } catch (error) {
        console.error("Gagal membuat jadwal:", error);
        const centerId = req.user.volunteer_center_id;
        const programs = await Program.findByCenter(centerId);
        const jadwal = await Jadwal.findByCenter(centerId);
        res.status(500).render("pengurus/jadwal", {
            title: "Gagal Membuat Jadwal",
            active: "jadwal",
            programs: programs,
            jadwal: jadwal,
            error: "Terjadi kesalahan saat menyimpan jadwal. Mohon periksa kembali data Anda.",
        });
    }
};

// --- Komunikasi / Pengumuman ---
exports.showKomunikasiPage = async (req, res) => {
    try {
        const centerId = req.user.volunteer_center_id;
        const programs = await Program.findByCenter(centerId);
        const pengumuman = await Pengumuman.findByCenter(centerId);

        res.render("pengurus/komunikasi", {
            title: "Alat Komunikasi",
            active: "komunikasi",
            programs: programs,
            pengumuman: pengumuman,
            error: null,
        });
    } catch (error) {
        console.error("Error memuat halaman komunikasi:", error);
        res.status(500).send("Gagal memuat halaman.");
    }
};

exports.handleKirimPengumuman = async (req, res) => {
    try {
        const pengurusId = req.user.id;
        await Pengumuman.create(req.body, pengurusId);
        res.redirect("/pengurus/komunikasi");
    } catch (error) {
        console.error("Gagal mengirim pengumuman:", error);
        const centerId = req.user.volunteer_center_id;
        const programs = await Program.findByCenter(centerId);
        const pengumuman = await Pengumuman.findByCenter(centerId);
        res.status(500).render("pengurus/komunikasi", {
            title: "Gagal Mengirim",
            active: "komunikasi",
            programs,
            pengumuman,
            error: "Terjadi kesalahan saat mengirim pengumuman.",
        });
    }
};

// --- Halaman Lainnya ---
exports.showDocumentValidation = (req, res) => {
    res.render("pengurus/validasi-dokumen", {
        title: "Validasi Dokumen",
        active: "validasi",
    });
};

exports.showAnalytics = async (req, res) => {
    try {
        const centerId = req.user.volunteer_center_id;
        const stats = await Aplikasi.getStatisticsForCenter(centerId);

        res.render("pengurus/statistik", {
            title: "Statistik & Analitik",
            active: "analitik",
            stats: stats,
            error: null,
        });
    } catch (error) {
        console.error("Error memuat halaman statistik:", error);
        res.status(500).send("Gagal memuat halaman statistik.");
    }
};