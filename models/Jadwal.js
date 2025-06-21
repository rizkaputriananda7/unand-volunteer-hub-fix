// models/Jadwal.js

const db = require('../config/database');

class Jadwal {
    /**
     * Membuat jadwal seleksi baru untuk sebuah program.
     * @param {object} jadwalData - Data jadwal dari form.
     * @returns {Promise<object>} Hasil dari operasi insert.
     */
    static async create(jadwalData) {
        const { program_id, nama_acara, deskripsi_acara, tanggal_acara } = jadwalData;
        const sql = `
            INSERT INTO jadwal_seleksi (program_id, nama_acara, deskripsi_acara, tanggal_acara)
            VALUES (?, ?, ?, ?)
        `;
        try {
            const [result] = await db.execute(sql, [program_id, nama_acara, deskripsi_acara, tanggal_acara]);
            return result;
        } catch (error) {
            console.error("Error creating schedule:", error);
            throw error;
        }
    }

    /**
     * Mengambil semua jadwal berdasarkan ID program.
     * @param {number} programId - ID dari program.
     * @returns {Promise<Array>} Array berisi jadwal untuk program tersebut.
     */
    static async findByProgramId(programId) {
        const sql = 'SELECT *, DATE_FORMAT(tanggal_acara, "%d %M %Y %H:%i") as tanggal_formatted FROM jadwal_seleksi WHERE program_id = ? ORDER BY tanggal_acara ASC';
        try {
            const [rows] = await db.execute(sql, [programId]);
            return rows;
        } catch (error) {
            console.error("Error finding schedules by program ID:", error);
            throw error;
        }
    }

    /**
     * Menghapus jadwal seleksi berdasarkan ID-nya.
     * @param {number} jadwalId - ID dari jadwal yang akan dihapus.
     * @returns {Promise<boolean>} True jika berhasil, false jika gagal.
     */
    static async deleteById(jadwalId) {
        const sql = 'DELETE FROM jadwal_seleksi WHERE id = ?';
        try {
            const [result] = await db.execute(sql, [jadwalId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting schedule by ID:", error);
            throw error;
        }
    }
}

module.exports = Jadwal;