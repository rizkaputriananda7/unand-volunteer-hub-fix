const db = require('../config/database');

class Bookmark {
    /**
     * Menambahkan program ke daftar bookmark seorang mahasiswa.
     */
    static async add(mahasiswaId, programId) {
        const sql = "INSERT INTO bookmarks (mahasiswa_id, program_id) VALUES (?, ?)";
        const [result] = await db.execute(sql, [mahasiswaId, programId]);
        return result.insertId;
    }

    /**
     * Menghapus program dari daftar bookmark seorang mahasiswa.
     */
    static async remove(mahasiswaId, programId) {
        const sql = "DELETE FROM bookmarks WHERE mahasiswa_id = ? AND program_id = ?";
        const [result] = await db.execute(sql, [mahasiswaId, programId]);
        return result.affectedRows;
    }

    /**
     * Mengambil semua ID program yang telah di-bookmark oleh seorang mahasiswa.
     * Ini adalah fungsi helper yang efisien.
     */
    static async findBookmarkedProgramIds(mahasiswaId) {
        const sql = "SELECT program_id FROM bookmarks WHERE mahasiswa_id = ?";
        const [rows] = await db.execute(sql, [mahasiswaId]);
        // Mengembalikan array dari ID, contoh: [1, 5, 12]
        return rows.map(row => row.program_id);
    }

    /**
     * Mengambil semua detail program yang telah di-bookmark oleh seorang mahasiswa.
     * Digunakan untuk halaman "Program Tersimpan".
     */
    static async findAllForMahasiswa(mahasiswaId) {
        const sql = `
            SELECT p.*, vc.nama_pusat
            FROM bookmarks b
            JOIN programs p ON b.program_id = p.id
            JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
            WHERE b.mahasiswa_id = ?
            ORDER BY b.created_at DESC
        `;
        const [rows] = await db.execute(sql, [mahasiswaId]);
        return rows;
    }
}

module.exports = Bookmark;
