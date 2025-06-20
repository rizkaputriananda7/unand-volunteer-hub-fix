const db = require('../config/database');

class Pengumuman {
    /**
     * Membuat pengumuman baru di database.
     * @param {object} data - Data dari form (program_id, subjek, pesan).
     * @param {number} pengurusId - ID dari pengurus yang mengirim.
     */
    static async create(data, pengurusId) {
        const { program_id, subjek, pesan } = data;
        const sql = `
            INSERT INTO pengumuman (program_id, pengurus_id, subjek, pesan) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [program_id, pengurusId, subjek, pesan]);
        return result.insertId;
    }

    /**
     * Mengambil riwayat pengumuman yang dikirim oleh pengurus dari pusat volunteer tertentu.
     * @param {number} centerId - ID pusat volunteer.
     */
    static async findByCenter(centerId) {
        const sql = `
            SELECT 
                peng.id, 
                peng.subjek, 
                peng.created_at, 
                p.title AS nama_program
            FROM pengumuman peng
            JOIN programs p ON peng.program_id = p.id
            WHERE p.volunteer_center_id = ?
            ORDER BY peng.created_at DESC
        `;
        const [rows] = await db.execute(sql, [centerId]);
        return rows;
    }
}

module.exports = Pengumuman;
