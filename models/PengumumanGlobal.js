const db = require('../config/database');

class PengumumanGlobal {
    static async findAll() {
        const sql = "SELECT pg.*, a.nama_lengkap AS nama_admin FROM pengumuman_global pg JOIN admins a ON pg.admin_id = a.id ORDER BY pg.created_at DESC";
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async findActive() {
        const sql = "SELECT * FROM pengumuman_global WHERE status = 'Aktif' ORDER BY created_at DESC LIMIT 1";
        const [rows] = await db.execute(sql);
        return rows[0] || null;
    }

    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM pengumuman_global WHERE id = ?", [id]);
        return rows[0] || null;
    }

    static async create(data, adminId) {
        const { subjek, pesan, level_urgensi } = data;
        const sql = "INSERT INTO pengumuman_global (admin_id, subjek, pesan, level_urgensi, status) VALUES (?, ?, ?, ?, 'Aktif')";
        await db.execute(sql, [adminId, subjek, pesan, level_urgensi]);
    }

    static async update(id, data) {
        const { subjek, pesan, level_urgensi, status } = data;
        const sql = "UPDATE pengumuman_global SET subjek = ?, pesan = ?, level_urgensi = ?, status = ? WHERE id = ?";
        await db.execute(sql, [subjek, pesan, level_urgensi, status, id]);
    }

    static async delete(id) {
        await db.execute("DELETE FROM pengumuman_global WHERE id = ?", [id]);
    }
}

module.exports = PengumumanGlobal;
