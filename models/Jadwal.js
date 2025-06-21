const db = require("../config/database");

class Jadwal {
  /**
   * Membuat jadwal acara baru untuk sebuah program.
   * @param {object} data - Data dari form (program_id, nama_acara, dll).
   */
  static async create(data) {
    const { program_id, nama_acara, deskripsi_acara, tanggal_acara } = data;
    const sql = `
            INSERT INTO jadwal_seleksi 
            (program_id, nama_acara, deskripsi_acara, tanggal_acara) 
            VALUES (?, ?, ?, ?)
        `;
    const [result] = await db.execute(sql, [
      program_id,
      nama_acara,
      deskripsi_acara,
      tanggal_acara,
    ]);
    return result.insertId;
  }

  /**
   * Mengambil semua jadwal untuk program-program yang berada
   * di bawah pusat volunteer tertentu.
   * @param {number} centerId - ID dari pusat volunteer pengurus.
   */
  static async findByCenter(centerId) {
    const sql = `
            SELECT 
                js.id, 
                js.nama_acara, 
                js.deskripsi_acara, 
                js.tanggal_acara, 
                p.title AS nama_program
            FROM jadwal_seleksi js
            JOIN programs p ON js.program_id = p.id
            WHERE p.volunteer_center_id = ?
            ORDER BY js.tanggal_acara ASC
        `;
    const [rows] = await db.execute(sql, [centerId]);
    return rows;
  }
  static async findUpcomingForMahasiswa(mahasiswaId) {
    const sql = `
            SELECT 
                js.nama_acara, js.tanggal_acara, p.title AS nama_program
            FROM jadwal_seleksi js
            JOIN programs p ON js.program_id = p.id
            JOIN aplikasi a ON a.program_id = p.id
            WHERE 
                a.mahasiswa_id = ? 
                AND a.status = 'Diterima' 
                AND js.tanggal_acara >= CURDATE()
            ORDER BY js.tanggal_acara ASC
            LIMIT 5
        `;
    // Menggunakan 'db' yang benar, bukan 'dbJadwal'
    const [rows] = await db.execute(sql, [mahasiswaId]);
    return rows;
  }
  static async findAllForMahasiswa(mahasiswaId) {
    const sql = `
            SELECT 
                js.nama_acara, 
                js.tanggal_acara, 
                p.title AS nama_program
            FROM jadwal_seleksi js
            JOIN programs p ON js.program_id = p.id
            -- Kita hanya perlu join ke tabel aplikasi untuk memastikan mahasiswa pernah melamar
            JOIN aplikasi a ON a.program_id = p.id
            WHERE a.mahasiswa_id = ?
            -- Ambil semua jadwal, tidak peduli sudah lewat atau belum
            ORDER BY js.tanggal_acara ASC
        `;
    const [rows] = await db.execute(sql, [mahasiswaId]);
    return rows;
  }
  static async findById(id) {
        const sql = "SELECT * FROM jadwal_seleksi WHERE id = ?";
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    }
    static async update(id, data) {
        const { program_id, nama_acara, deskripsi_acara, tanggal_acara } = data;
        const sql = `
            UPDATE jadwal_seleksi SET
                program_id = ?,
                nama_acara = ?,
                deskripsi_acara = ?,
                tanggal_acara = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [program_id, nama_acara, deskripsi_acara, tanggal_acara, id]);
        return result.affectedRows;
    }
    static async delete(id) {
        const sql = "DELETE FROM jadwal_seleksi WHERE id = ?";
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows;
    }
}

module.exports = Jadwal;
