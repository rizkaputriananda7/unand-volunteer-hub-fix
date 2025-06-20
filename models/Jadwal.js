const db = require('../config/database');

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
        const [result] = await db.execute(sql, [program_id, nama_acara, deskripsi_acara, tanggal_acara]);
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
}

module.exports = Jadwal;
