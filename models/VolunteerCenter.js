const db = require('../config/database');

class VolunteerCenter {
    /**
     * Mengambil semua pusat volunteer dengan filter pencarian dan status.
     */
    static async findAll(searchTerm = '') {
        let sql = "SELECT * FROM volunteer_centers WHERE 1=1"; // 1=1 untuk memudahkan penambahan AND
        const params = [];
        
        if (searchTerm) {
            sql += ' AND nama_pusat LIKE ?';
            params.push(`%${searchTerm}%`);
        }
        
        sql += ' ORDER BY nama_pusat ASC';
        const [rows] = await db.execute(sql, params);
        return rows;
    }

    /**
     * Membuat pusat volunteer baru.
     */
    static async create(data) {
        const { nama_pusat, deskripsi } = data;
        const [result] = await db.execute(
            'INSERT INTO volunteer_centers (nama_pusat, deskripsi, status) VALUES (?, ?, "Aktif")',
            [nama_pusat, deskripsi || null]
        );
        return result.insertId;
    }

    /**
     * Mengambil satu pusat volunteer berdasarkan ID.
     */
    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM volunteer_centers WHERE id = ?", [id]);
        return rows[0] || null;
    }

    /**
     * Memperbarui data pusat volunteer.
     */
    static async update(id, data) {
        const { nama_pusat, deskripsi, status } = data;
        const sql = "UPDATE volunteer_centers SET nama_pusat = ?, deskripsi = ?, status = ? WHERE id = ?";
        const [result] = await db.execute(sql, [nama_pusat, deskripsi || null, status, id]);
        return result.affectedRows;
    }

    /**
     * Menghapus pusat volunteer secara permanen.
     */
    static async delete(id) {
        const [result] = await db.execute("DELETE FROM volunteer_centers WHERE id = ?", [id]);
        return result.affectedRows;
    }
}

module.exports = VolunteerCenter;
