const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Mahasiswa {
    static async create(data) {
        const { nama_lengkap, nim, email, password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO mahasiswa (nama_lengkap, nim, email, password) VALUES (?, ?, ?, ?)',
            [nama_lengkap, nim, email, hashedPassword]
        );
        return result.insertId;
    }

    static async findByNim(nim) {
        const [rows] = await db.execute('SELECT * FROM mahasiswa WHERE nim = ?', [nim]);
        return rows[0] || null;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM mahasiswa WHERE id = ?', [id]);
        return rows[0] || null;
    }
}
module.exports = Mahasiswa;