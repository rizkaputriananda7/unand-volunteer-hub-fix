const db = require('../config/database');

class VolunteerCenter {
    /**
     * Mengambil semua pusat volunteer. Jika ada searchTerm,
     * akan memfilter hasilnya.
     * @param {string} [searchTerm=''] - Kata kunci pencarian opsional.
     */
    static async findAll(searchTerm = '') {
        let sql = 'SELECT * FROM volunteer_centers';
        const params = [];
        
        // Jika ada kata kunci, tambahkan klausa WHERE untuk mencari nama_pusat
        if (searchTerm) {
            sql += ' WHERE nama_pusat LIKE ?';
            params.push(`%${searchTerm}%`); // % adalah wildcard untuk pencarian parsial
        }
        
        sql += ' ORDER BY nama_pusat ASC';
        
        const [rows] = await db.execute(sql, params);
        return rows;
    }

    /**
     * Membuat pusat volunteer baru di database.
     */
    static async create(data) {
        const { nama_pusat, deskripsi } = data;
        const [result] = await db.execute(
            'INSERT INTO volunteer_centers (nama_pusat, deskripsi) VALUES (?, ?)',
            [nama_pusat, deskripsi]
        );
        return result.insertId;
    }

    // Anda bisa menambahkan fungsi update dan delete di sini nanti.
}

module.exports = VolunteerCenter;
