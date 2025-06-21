const db = require('../config/database');

class Feedback {
    /**
     * Menyimpan umpan balik baru ke dalam database.
     * @param {object} data - Data dari form (program_id, rating, dll).
     * @param {number} mahasiswaId - ID dari mahasiswa yang login.
     */
    static async create(data, mahasiswaId) {
        const { program_id, rating, saran, masalah_teknis } = data;
        const sql = `
            INSERT INTO feedback
            (mahasiswa_id, program_id, rating, saran, masalah_teknis)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // Pastikan program_id yang kosong disimpan sebagai NULL
        const finalProgramId = program_id || null;

        const [result] = await db.execute(sql, [mahasiswaId, finalProgramId, rating, saran, masalah_teknis]);
        return result.insertId;
    }
    static async findGeneralFeedback() {
        const sql = `
            SELECT f.*, m.nama_lengkap AS nama_mahasiswa
            FROM feedback f
            JOIN mahasiswa m ON f.mahasiswa_id = m.id
            WHERE f.program_id IS NULL
            ORDER BY f.created_at DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
    static async findFeedbackByCenter(centerId) {
        const sql = `
            SELECT f.*, m.nama_lengkap AS nama_mahasiswa, p.title AS nama_program
            FROM feedback f
            JOIN mahasiswa m ON f.mahasiswa_id = m.id
            JOIN programs p ON f.program_id = p.id
            WHERE p.volunteer_center_id = ?
            ORDER BY f.created_at DESC
        `;
        const [rows] = await db.execute(sql, [centerId]);
        return rows;
    }
}

module.exports = Feedback;
