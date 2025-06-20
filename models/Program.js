const db = require('../config/database');

class Program {
    /**
     * Membuat program baru dengan semua informasi detail.
     */
    static async create(data, coordinatorId, centerId) {
        const {
            title, description, persyaratan, tanggal_pelaksanaan, pendaftaran_mulai, 
            pendaftaran_akhir, location, quota, durasi, manfaat, kontak_narahubung
        } = data;
        
        const sql = `
            INSERT INTO programs 
            (title, description, persyaratan, tanggal_pelaksanaan, pendaftaran_mulai, pendaftaran_akhir, 
             location, quota, durasi, manfaat, kontak_narahubung, coordinator_id, volunteer_center_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            title, description, persyaratan, tanggal_pelaksanaan, pendaftaran_mulai, pendaftaran_akhir,
            location, quota, durasi, manfaat, kontak_narahubung, coordinatorId, centerId, 'Aktif'
        ];

        const [result] = await db.execute(sql, values);
        return result.insertId;
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

    /**
     * Mengambil semua program yang tersedia untuk ditampilkan ke publik.
     */
    static async findAll() {
        const sql = `
            SELECT p.*, vc.nama_pusat 
            FROM programs p
            JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
            WHERE p.status = 'Aktif' AND p.pendaftaran_akhir >= CURDATE()
            ORDER BY p.pendaftaran_mulai DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    /**
     * Mengambil satu program spesifik berdasarkan ID-nya.
     */
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
}

module.exports = Program;
