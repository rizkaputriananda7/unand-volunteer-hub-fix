const db = require("../config/database");

class Aplikasi {
  /**
   * Mengambil semua aplikasi untuk program-program
   * yang berada di bawah pusat volunteer tertentu.
   * @param {number} centerId - ID dari pusat volunteer.
   */
  static async findByCenter(centerId) {
    const sql = `
            SELECT 
                a.id, 
                a.status,
                a.tanggal_wawancara,
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
   * @param {number} applicationId - ID dari aplikasi yang akan diubah.
   * @param {object} data - Data baru (status, tanggal_wawancara, catatan).
   */
  static async updateStatus(applicationId, data) {
    const { status, tanggal_wawancara, catatan_seleksi } = data;

    // Hanya perbarui kolom yang relevan
    let fields = [];
    let values = [];

    if (status) {
      fields.push("status = ?");
      values.push(status);
    }
    if (tanggal_wawancara) {
      fields.push("tanggal_wawancara = ?");
      values.push(tanggal_wawancara);
    }
    if (catatan_seleksi) {
      fields.push("catatan_seleksi = ?");
      values.push(catatan_seleksi);
    }

    if (fields.length === 0) {
      throw new Error("Tidak ada data untuk diperbarui.");
    }

    const sql = `UPDATE aplikasi SET ${fields.join(", ")} WHERE id = ?`;
    values.push(applicationId);

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  }

  // Fungsi untuk membuat aplikasi baru (akan digunakan oleh mahasiswa nanti)
  static async create(mahasiswaId, programId) {
    const sql =
      "INSERT INTO aplikasi (mahasiswa_id, program_id, status) VALUES (?, ?, 'Ditinjau')";
    const [result] = await db.execute(sql, [mahasiswaId, programId]);
    return result.insertId;
  }
  static async getStatisticsForCenter(centerId) {
    // Query untuk total pendaftar di pusat ini
    const pendaftarSql = `
            SELECT COUNT(a.id) as totalPendaftar 
            FROM aplikasi a
            JOIN programs p ON a.program_id = p.id
            WHERE p.volunteer_center_id = ?`;
    const [pendaftarRows] = await db.execute(pendaftarSql, [centerId]);

    // Query untuk total yang diterima di pusat ini
    const diterimaSql = `
            SELECT COUNT(a.id) as totalDiterima
            FROM aplikasi a
            JOIN programs p ON a.program_id = p.id
            WHERE p.volunteer_center_id = ? AND a.status = 'Diterima'`;
    const [diterimaRows] = await db.execute(diterimaSql, [centerId]);

    // Query untuk total program aktif di pusat ini
    const programSql = `
            SELECT COUNT(id) as programAktif 
            FROM programs 
            WHERE volunteer_center_id = ? AND status = 'Aktif'`;
    const [programRows] = await db.execute(programSql, [centerId]);

    // Query untuk distribusi pendaftar per program di pusat ini
    const distribusiSql = `
            SELECT p.title, COUNT(a.id) as jumlahPendaftar
            FROM aplikasi a
            JOIN programs p ON a.program_id = p.id
            WHERE p.volunteer_center_id = ?
            GROUP BY p.title
            ORDER BY jumlahPendaftar DESC`;
    const [distribusiRows] = await db.execute(distribusiSql, [centerId]);

    // Gabungkan semua hasil ke dalam satu objek
    return {
      totalPendaftar: pendaftarRows[0].totalPendaftar || 0,
      totalDiterima: diterimaRows[0].totalDiterima || 0,
      programAktif: programRows[0].programAktif || 0,
      distribusiProgram: distribusiRows,
    };
  }
}

module.exports = Aplikasi;
