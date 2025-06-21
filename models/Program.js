const db = require("../config/database");

class Program {
  /**
   * Membuat program baru dengan semua informasi detail.
   */
  static async create(data, coordinatorId, centerId) {
    const {
      title,
      description,
      persyaratan,
      tanggal_pelaksanaan,
      pendaftaran_mulai,
      pendaftaran_akhir,
      location,
      quota,
      durasi,
      manfaat,
      kontak_narahubung,
    } = data;

    const sql = `
            INSERT INTO programs 
            (title, description, persyaratan, tanggal_pelaksanaan, pendaftaran_mulai, pendaftaran_akhir, 
             location, quota, durasi, manfaat, kontak_narahubung, coordinator_id, volunteer_center_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const values = [
      title,
      description,
      persyaratan,
      tanggal_pelaksanaan,
      pendaftaran_mulai,
      pendaftaran_akhir,
      location,
      quota,
      durasi,
      manfaat,
      kontak_narahubung,
      coordinatorId,
      centerId,
      "Aktif",
    ];

    const [result] = await db.execute(sql, values);
    return result.insertId;
  }

  static async update(programId, data) {
    const {
      title,
      description,
      persyaratan,
      tanggal_pelaksanaan,
      pendaftaran_mulai,
      pendaftaran_akhir,
      location,
      quota,
      durasi,
      manfaat,
      kontak_narahubung,
      kategori,
      status,
    } = data;

    const sql = `
            UPDATE programs SET
                title = ?,
                description = ?,
                persyaratan = ?,
                tanggal_pelaksanaan = ?,
                pendaftaran_mulai = ?,
                pendaftaran_akhir = ?,
                location = ?,
                quota = ?,
                durasi = ?,
                manfaat = ?,
                kontak_narahubung = ?,
                kategori = ?,
                status = ?
            WHERE id = ?
        `;

    const values = [
      title,
      description,
      persyaratan,
      tanggal_pelaksanaan,
      pendaftaran_mulai,
      pendaftaran_akhir,
      location,
      quota,
      durasi,
      manfaat,
      kontak_narahubung,
      kategori,
      status,
      programId,
    ];

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  }

  static async delete(programId, centerId) {
    // Query ini memastikan pengurus hanya bisa menghapus program dari pusatnya sendiri
    const sql = "DELETE FROM programs WHERE id = ? AND volunteer_center_id = ?";
    const [result] = await db.execute(sql, [programId, centerId]);
    return result.affectedRows;
  }
  /**
   * Mengambil semua program berdasarkan ID pusat volunteer milik pengurus.
   */
  static async findByCenter(centerId) {
    const sql = `
            SELECT p.*, peng.nama_lengkap AS coordinator_name
            FROM programs p
            JOIN pengurus peng ON p.coordinator_id = peng.id
            WHERE p.volunteer_center_id = ?
            ORDER BY p.tanggal_pelaksanaan DESC
        `;
    const [rows] = await db.execute(sql, [centerId]);
    return rows;
  }

  static async findAll(filters = {}) {
    // Query dasar untuk mengambil program yang masih aktif
    let sql = `
            SELECT p.*, vc.nama_pusat 
            FROM programs p
            JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
            WHERE p.status = 'Aktif'
        `;
    const params = [];

    // Menambahkan filter untuk Status Pendaftaran
    if (filters.statusPendaftaran === "terbuka") {
      sql += " AND p.pendaftaran_akhir >= CURDATE()";
    } else if (filters.statusPendaftaran === "ditutup") {
      sql += " AND p.pendaftaran_akhir < CURDATE()";
    }

    // Menambahkan filter untuk Pusat Volunteer
    if (filters.centerId) {
      sql += " AND p.volunteer_center_id = ?";
      params.push(filters.centerId);
    }

    // Menambahkan filter untuk Kategori Program
    if (filters.kategori) {
      sql += " AND p.kategori = ?";
      params.push(filters.kategori);
    }

    // Menambahkan filter untuk kata kunci pencarian
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      sql += " AND p.title LIKE ?";
      params.push(`%${filters.searchTerm}%`);
    }

    sql += " ORDER BY p.pendaftaran_mulai DESC";

    const [rows] = await db.execute(sql, params);
    return rows;
  }

  static async findById(id) {
    const sql = `
            SELECT 
                p.*, 
                peng.nama_lengkap AS coordinator_name, 
                vc.nama_pusat 
            FROM programs p
            LEFT JOIN pengurus peng ON p.coordinator_id = peng.id
            LEFT JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
            WHERE p.id = ?
        `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
  }
  static async findUpcomingDeadlinesForMahasiswa(mahasiswaId) {
    const sql = `
            SELECT 
                p.title AS nama_program,
                p.pendaftaran_akhir
            FROM programs p
            JOIN aplikasi a ON p.id = a.program_id
            WHERE 
                a.mahasiswa_id = ?
                -- Ambil program yang pendaftarannya belum ditutup DAN akan berakhir dalam 7 hari ke depan
                AND p.pendaftaran_akhir >= CURDATE() 
                AND p.pendaftaran_akhir <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
            ORDER BY p.pendaftaran_akhir ASC
        `;
    const [rows] = await db.execute(sql, [mahasiswaId]);
    return rows;
  }
  static async findLatestByCenterName(centerName, limit = 2) {
    const sql = `
            SELECT p.*, vc.nama_pusat 
            FROM programs p
            JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
            WHERE 
                p.status = 'Aktif' 
                AND p.pendaftaran_akhir >= CURDATE()
                AND vc.nama_pusat = ?
            ORDER BY p.pendaftaran_mulai DESC
            LIMIT ?
        `;
    const [rows] = await db.execute(sql, [centerName, limit]);
    return rows;
  }
}

module.exports = Program;
