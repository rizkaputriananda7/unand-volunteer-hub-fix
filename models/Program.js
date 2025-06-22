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
  
 // GANTI SELURUH FUNGSI findAll DENGAN VERSI DEBUG INI
static async findAll(filters = {}) {
    // ---- LOG DEBUG 1: Lihat filter yang masuk ----
    console.log("===== Filter yang diterima oleh Model =====");
    console.log(filters);

    let sql = `
        SELECT p.*, vc.nama_pusat, 
               (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id) as jumlah_pendaftar
        FROM programs p
        JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
    `;
    const params = [];
    let whereConditions = [];

    if (filters.status === "tersedia") {
      whereConditions.push("p.status = 'Aktif'");
      whereConditions.push("(p.quota IS NULL OR p.quota > (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id))");
      whereConditions.push("p.pendaftaran_akhir >= CURDATE()");
    } else if (filters.status === "penuh") {
      whereConditions.push("p.status = 'Aktif'");
      whereConditions.push("p.quota IS NOT NULL AND p.quota <= (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id)");
      whereConditions.push("p.pendaftaran_akhir >= CURDATE()");
    } else if (filters.status === "tutup") {
      whereConditions.push("p.pendaftaran_akhir < CURDATE()");
    } else {
      whereConditions.push("p.status = 'Aktif'");
    }

    if (filters.centerId) {
      whereConditions.push("p.volunteer_center_id = ?");
      params.push(filters.centerId);
    }
    if (filters.kategori) {
      whereConditions.push("p.kategori = ?");
      params.push(filters.kategori);
    }
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      whereConditions.push("p.title LIKE ?");
      params.push(`%${filters.searchTerm}%`);
    }

    if (whereConditions.length > 0) {
      sql += " WHERE " + whereConditions.join(" AND ");
    }
    
    sql += " ORDER BY p.pendaftaran_mulai DESC";

    // ---- LOG DEBUG 2: Lihat query SQL final ----
    console.log("===== Query SQL yang Dijalankan =====");
    console.log(sql);

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