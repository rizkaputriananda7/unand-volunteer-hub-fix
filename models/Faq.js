const db = require('../config/database');

class Faq {
    /**
     * Mengambil semua data FAQ dari database.
     * Nantinya bisa ditambahkan filter jika diperlukan.
     */
    static async findAll() {
        const sql = `
            SELECT * FROM faqs 
            ORDER BY kategori, id
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // Nanti kita akan menambahkan fungsi create, update, delete di sini untuk Admin.
}

module.exports = Faq;
