const db = require("../config/database"); // Pastikan ini adalah satu-satunya impor koneksi database

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
  static async create(mahasiswaId, programId) {
    const sql =
      "INSERT INTO aplikasi (mahasiswa_id, program_id, status) VALUES (?, ?, 'Ditinjau')";
    const [result] = await db.execute(sql, [mahasiswaId, programId]);
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
}

module.exports = Aplikasi;
