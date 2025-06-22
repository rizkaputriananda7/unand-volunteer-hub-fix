const db = require("../config/database");

class Program {
  // ... (Fungsi lain seperti create, update, delete tidak berubah) ...
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
    const sql = "DELETE FROM programs WHERE id = ? AND volunteer_center_id = ?";
    const [result] = await db.execute(sql, [programId, centerId]);
    return result.affectedRows;
  }
  
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
    // Fungsi 'user' tidak lagi diperlukan di sini
    let sql = `
        SELECT p.*, vc.nama_pusat, 
               (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id) as jumlah_pendaftar
        FROM programs p
        JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
        WHERE p.status = 'Aktif'
    `;
    const params = [];

    // Filter Status Ketersediaan
    if (filters.status === "tersedia") {
      sql += " AND (p.quota IS NULL OR p.quota > (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id)) AND p.pendaftaran_akhir >= CURDATE()";
    } else if (filters.status === "penuh") {
      sql += " AND p.quota IS NOT NULL AND p.quota <= (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id) AND p.pendaftaran_akhir >= CURDATE()";
    } else if (filters.status === "tutup") {
      sql += " AND p.pendaftaran_akhir < CURDATE()";
    }

    // Filter Pusat Volunteer
    if (filters.centerId) {
      sql += " AND p.volunteer_center_id = ?";
      params.push(filters.centerId);
    }
    
    // Filter Kategori (jika ada)
    if (filters.kategori) {
      sql += " AND p.kategori = ?";
      params.push(filters.kategori);
    }
    
    // Filter Pencarian
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      sql += " AND p.title LIKE ?";
      params.push(`%${filters.searchTerm}%`);
    }

    // Logika untuk filter mahasiswa dan aturan khusus sudah dihapus
    
    sql += " ORDER BY p.pendaftaran_mulai DESC";

    const [rows] = await db.execute(sql, params);
    return rows;
  }

  static async findById(id) {
    const sql = `
            SELECT 
                p.*, 
                peng.nama_lengkap AS coordinator_name, 
                vc.nama_pusat,
                (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id) as jumlah_pendaftar
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