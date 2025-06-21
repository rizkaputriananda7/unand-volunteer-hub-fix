// models/Admin.js

const db = require('../config/database');

class Admin {
    /**
     * Mencari satu admin berdasarkan username-nya.
     * @param {string} username - Username admin yang akan dicari.
     * @returns {Promise<object|null>} Objek admin jika ditemukan, atau null.
     */
    static async findByUsername(username) {
        const sql = 'SELECT * FROM admins WHERE username = ?';
        try {
            const [rows] = await db.execute(sql, [username]);
            return rows[0] || null;
        } catch (error) {
            console.error("Error finding admin by username:", error);
            throw error;
        }
    }
}

module.exports = Admin;