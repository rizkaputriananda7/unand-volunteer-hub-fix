const db = require("../config/database");
const fs = require("fs").promises;

class Aplikasi {
  /**
   * Mengambil semua aplikasi untuk program-program yang berada di bawah pusat volunteer tertentu.
   * Digunakan di halaman Manajemen Seleksi Pengurus.
   * @param {number} centerId - ID dari pusat volunteer.
   */
  static async findByCenter(centerId) {
    const sql = `
            SELECT 
                a.id, 
                a.status,
                a.program_id,
                m.nama_lengkap AS nama_mahasiswa,
                m.email AS email_mahasiswa,
                p.title AS nama_program
            FROM aplikasi a
            JOIN mahasiswa m ON a.mahasiswa_id = m.id
            JOIN programs p ON a.program_id = p.id
            WHERE p.volunteer_center_id = ?
            ORDER BY p.title, a.tanggal_lamaran DESC
        `;
    const [rows] = await db.execute(sql, [centerId]);
    return rows;
  }

  /**
   * Memperbarui status aplikasi seorang kandidat.
   * Digunakan oleh Pengurus saat mengubah status di halaman Manajemen Seleksi.
   * @param {number} applicationId - ID dari aplikasi yang akan diubah.
   * @param {object} data - Data baru, misalnya { status: 'Diterima' }.
   */
  static async updateStatus(applicationId, data) {
    const { status } = data;
    const sql = `UPDATE aplikasi SET status = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [status, applicationId]);
    return result.affectedRows;
  }

  /**
   * Fungsi untuk mahasiswa melamar ke sebuah program.
   */
  static async create(data) {
    const { mahasiswaId, programId, motivasi, files } = data;
    
    const sql = `
      INSERT INTO aplikasi 
      (mahasiswa_id, program_id, status, motivasi, cv_path, transkrip_path, ktm_path) 
      VALUES (?, ?, 'Ditinjau', ?, ?, ?, ?)
    `;
    
    // Ambil path file atau default ke NULL jika tidak ada
    const cvPath = files.cv ? files.cv[0].path.replace(/\\/g, '/').replace('public/', '') : null;
    const transkripPath = files.transkrip ? files.transkrip[0].path.replace(/\\/g, '/').replace('public/', '') : null;
    const ktmPath = files.ktm ? files.ktm[0].path.replace(/\\/g, '/').replace('public/', '') : null;

    const [result] = await db.execute(sql, [mahasiswaId, programId, motivasi, cvPath, transkripPath, ktmPath]);
    return result.insertId;
  }

  /**
   * Mengecek apakah seorang mahasiswa sudah melamar ke program tertentu.
   * Digunakan untuk menonaktifkan tombol "Daftar" di halaman detail program.
   */
  static async hasApplied(mahasiswaId, programId) {
    const sql =
      "SELECT id FROM aplikasi WHERE mahasiswa_id = ? AND program_id = ?";
    // === BAGIAN YANG DIPERBAIKI ===
    // Menggunakan variabel 'db' yang benar.
    const [rows] = await db.execute(sql, [mahasiswaId, programId]);
    // ============================
    return rows.length > 0;
  }

  /**
   * Mengambil daftar program yang pernah dilamar oleh seorang mahasiswa.
   * Digunakan untuk mengisi dropdown di halaman umpan balik mahasiswa.
   */
  static async findAppliedProgramsByMahasiswa(mahasiswaId) {
    const sql = `
            SELECT 
                p.id, 
                p.title AS nama_program, 
                p.tanggal_pelaksanaan,
                vc.nama_pusat,
                a.status, 
                a.tanggal_lamaran 
            FROM aplikasi a
            JOIN programs p ON a.program_id = p.id
            JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
            WHERE a.mahasiswa_id = ?
            ORDER BY a.tanggal_lamaran DESC
        `;
    const [rows] = await db.execute(sql, [mahasiswaId]);
    return rows;
  }

  /**
   * Mengambil data statistik untuk dashboard pengurus.
   */
  static async getStatisticsForCenter(centerId) {
    const pendaftarSql = `SELECT COUNT(a.id) as totalPendaftar FROM aplikasi a JOIN programs p ON a.program_id = p.id WHERE p.volunteer_center_id = ?`;
    const [pendaftarRows] = await db.execute(pendaftarSql, [centerId]);

    const diterimaSql = `SELECT COUNT(a.id) as totalDiterima FROM aplikasi a JOIN programs p ON a.program_id = p.id WHERE p.volunteer_center_id = ? AND a.status = 'Diterima'`;
    const [diterimaRows] = await db.execute(diterimaSql, [centerId]);

    const programSql = `SELECT COUNT(id) as programAktif FROM programs WHERE volunteer_center_id = ? AND status = 'Aktif'`;
    const [programRows] = await db.execute(programSql, [centerId]);

    const distribusiSql = `SELECT p.title, COUNT(a.id) as jumlahPendaftar FROM aplikasi a JOIN programs p ON a.program_id = p.id WHERE p.volunteer_center_id = ? GROUP BY p.title ORDER BY jumlahPendaftar DESC`;
    const [distribusiRows] = await db.execute(distribusiSql, [centerId]);

    return {
      totalPendaftar: pendaftarRows[0].totalPendaftar || 0,
      totalDiterima: diterimaRows[0].totalDiterima || 0,
      programAktif: programRows[0].programAktif || 0,
      distribusiProgram: distribusiRows,
    };
  }
  static async findActiveRolesByMahasiswa(mahasiswaId) {
    const sql = `
            SELECT 
                p.title, p.tanggal_pelaksanaan, vc.nama_pusat 
            FROM aplikasi a
            JOIN programs p ON a.program_id = p.id
            JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
            WHERE a.mahasiswa_id = ? AND a.status = 'Diterima'
            ORDER BY p.tanggal_pelaksanaan ASC
        `;
    const [rows] = await db.execute(sql, [mahasiswaId]);
    return rows;
  }

  /**
   * Mengambil statistik pendaftaran untuk satu mahasiswa.
   */
  static async getStatsForMahasiswa(mahasiswaId) {
    const totalSql =
      "SELECT COUNT(*) as totalAplikasi FROM aplikasi WHERE mahasiswa_id = ?";
    const [totalRows] = await db.execute(totalSql, [mahasiswaId]);

    const diterimaSql =
      "SELECT COUNT(*) as totalDiterima FROM aplikasi WHERE mahasiswa_id = ? AND status = 'Diterima'";
    const [diterimaRows] = await db.execute(diterimaSql, [mahasiswaId]);

    return {
      totalAplikasi: totalRows[0].totalAplikasi || 0,
      totalDiterima: diterimaRows[0].totalDiterima || 0,
    };
  }
  static async findRecentActivities(centerId, limit = 5) {
        const sql = `
            SELECT 
                m.nama_lengkap, 
                p.title AS nama_program,
                a.tanggal_lamaran
            FROM aplikasi a
            JOIN mahasiswa m ON a.mahasiswa_id = m.id
            JOIN programs p ON a.program_id = p.id
            WHERE p.volunteer_center_id = ?
            ORDER BY a.tanggal_lamaran DESC
            LIMIT ?
        `;
        const [rows] = await db.execute(sql, [centerId, limit]);
        return rows;
    }
    static async findDetailsById(applicationId) {
        const appSql = `
            SELECT 
                a.*, 
                m.nama_lengkap, m.nim, m.email, m.nomor_hp,
                p.title AS nama_program
            FROM aplikasi a
            JOIN mahasiswa m ON a.mahasiswa_id = m.id
            JOIN programs p ON a.program_id = p.id
            WHERE a.id = ?
        `;
        const [appRows] = await db.execute(appSql, [applicationId]);
        if (appRows.length === 0) return null;

        const applicationDetails = appRows[0];

        // Ambil semua dokumen yang relevan untuk mahasiswa ini
        // (Dokumen umum DAN dokumen spesifik untuk pusat volunteer program ini)
        const docsSql = `
            SELECT * FROM dokumen_mahasiswa 
            WHERE mahasiswa_id = ? 
            AND (volunteer_center_id IS NULL OR volunteer_center_id = (SELECT volunteer_center_id FROM programs WHERE id = ?))
        `;
        const [docRows] = await db.execute(docsSql, [applicationDetails.mahasiswa_id, applicationDetails.program_id]);
        
        applicationDetails.dokumen = docRows;
        return applicationDetails;
    }
}

module.exports = Aplikasi;
