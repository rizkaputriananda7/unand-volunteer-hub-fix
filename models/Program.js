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

  static async findAll(filters = {}, user = {}) {
    // Kueri dasar untuk mengambil program, pusat relawan, dan jumlah pendaftar saat ini
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
      // Kuota tidak ada (tak terbatas) ATAU kuota lebih besar dari jumlah pendaftar, dan pendaftaran masih terbuka
      sql += " AND (p.quota IS NULL OR p.quota > (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id)) AND p.pendaftaran_akhir >= CURDATE()";
    } else if (filters.status === "penuh") {
      // Kuota tidak null DAN kuota kurang dari atau sama dengan jumlah pendaftar, dan pendaftaran masih terbuka
      sql += " AND p.quota IS NOT NULL AND p.quota <= (SELECT COUNT(*) FROM aplikasi WHERE program_id = p.id) AND p.pendaftaran_akhir >= CURDATE()";
    } else if (filters.status === "tutup") {
      // Pendaftaran sudah lewat dari tanggal akhir
      sql += " AND p.pendaftaran_akhir < CURDATE()";
    }

    // Filter Pusat Volunteer
    if (filters.centerId) {
      sql += " AND p.volunteer_center_id = ?";
      params.push(filters.centerId);
    }
    
    // Filter Kategori (sudah ada sebelumnya)
    if (filters.kategori) {
      sql += " AND p.kategori = ?";
      params.push(filters.kategori);
    }
    
    // Filter Pencarian (sudah ada sebelumnya)
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      sql += " AND p.title LIKE ?";
      params.push(`%${filters.searchTerm}%`);
    }

    // Filter berdasarkan Mahasiswa (logika awal di sisi SQL)
    if (filters.mahasiswa === 'mahasiswa_feb') {
        // Hanya tampilkan program dari 'GID BEI' atau yang memiliki persyaratan umum untuk FEB
        sql += " AND (vc.nama_pusat = 'GID BEI' OR p.persyaratan LIKE '%Fakultas Ekonomi%')";
    } else if (filters.mahasiswa === 'penerima_beasiswa_bi') {
        // Hanya tampilkan program dari 'Bank Indonesia corner' atau yang memiliki persyaratan umum untuk penerima beasiswa BI
        sql += " AND (vc.nama_pusat = 'Bank Indonesia corner' OR p.persyaratan LIKE '%Penerima Beasiswa BI%')";
    }
    
    sql += " ORDER BY p.pendaftaran_mulai DESC";

    let [rows] = await db.execute(sql, params);
    
    // Filter tambahan di sisi aplikasi untuk memastikan kecocokan
    if (user && user.role === 'mahasiswa') {
        rows = rows.filter(program => {
            if (program.nama_pusat === 'GID BEI' && user.fakultas !== 'Ekonomi dan Bisnis') {
                return false; // Jika program khusus GID BEI, hanya tampilkan untuk mahasiswa FEB
            }
            if (program.nama_pusat === 'Bank Indonesia corner' && !user.is_penerima_beasiswa) {
                return false; // Jika program khusus BI Corner, hanya tampilkan untuk penerima beasiswa BI
            }
            return true;
        });
    }

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