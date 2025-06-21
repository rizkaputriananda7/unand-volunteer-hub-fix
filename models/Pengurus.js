const dbPengurus = require('../config/database');
const bcryptPengurus = require('bcryptjs');

class Pengurus {
    static async create(data) {
        const { nama_lengkap, username, email, password, volunteer_center_id } = data;
        const hashedPassword = await bcryptPengurus.hash(password, 10);
        const [result] = await dbPengurus.execute(
            'INSERT INTO pengurus (nama_lengkap, username, email, password, volunteer_center_id) VALUES (?, ?, ?, ?, ?)',
            [nama_lengkap, username, email, hashedPassword, volunteer_center_id]
        );
        return result.insertId;
    }

    static async findByUsername(username) {
        const [rows] = await dbPengurus.execute('SELECT * FROM pengurus WHERE username = ?', [username]);
        return rows[0] || null;
    }

    static async findById(id) {
        const [rows] = await dbPengurus.execute('SELECT p.*, vc.nama_pusat FROM pengurus p JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id WHERE p.id = ?', [id]);
        return rows[0] || null;
    }
    static async update(id, data) {
        const { nama_lengkap, username, email, volunteer_center_id } = data;
        const sql = `UPDATE pengurus SET nama_lengkap = ?, username = ?, email = ?, volunteer_center_id = ? WHERE id = ?`;
        await db.execute(sql, [nama_lengkap, username, email, volunteer_center_id, id]);
    }
}
module.exports = Pengurus;
