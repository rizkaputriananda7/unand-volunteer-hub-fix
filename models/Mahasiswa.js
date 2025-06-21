// models/Mahasiswa.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Mahasiswa {
    static async findAll() {
        const sql = 'SELECT id, nama_lengkap, nim, email, created_at FROM mahasiswa';
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async findById(id) {
        const sql = 'SELECT id, nama_lengkap, nim, email FROM mahasiswa WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async create(data) {
        const { nama_lengkap, nim, email, password } = data;
        const hashedPassword = await bcrypt.hash(password, 12);
        const sql = 'INSERT INTO mahasiswa (nama_lengkap, nim, email, password) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [nama_lengkap, nim, email, hashedPassword]);
        return result;
    }

    static async update(id, data) {
        const { nama_lengkap, nim, email } = data;
        const sql = 'UPDATE mahasiswa SET nama_lengkap = ?, nim = ?, email = ? WHERE id = ?';
        const [result] = await db.execute(sql, [nama_lengkap, nim, email, id]);
        return result.affectedRows > 0;
    }

    static async deleteById(id) {
        const sql = 'DELETE FROM mahasiswa WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}
module.exports = Mahasiswa;