// models/Pengurus.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Pengurus {
    static async findAll() {
        const sql = `
            SELECT p.id, p.nama_lengkap, p.username, p.email, p.created_at, vc.nama_pusat 
            FROM pengurus p
            LEFT JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
    
    static async create(data) {
        const { nama_lengkap, username, email, password, volunteer_center_id } = data;
        const hashedPassword = await bcrypt.hash(password, 12);
        const sql = 'INSERT INTO pengurus (nama_lengkap, username, email, password, volunteer_center_id) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [nama_lengkap, username, email, hashedPassword, volunteer_center_id]);
        return result;
    }

    static async deleteById(id) {
        const sql = 'DELETE FROM pengurus WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}
module.exports = Pengurus;