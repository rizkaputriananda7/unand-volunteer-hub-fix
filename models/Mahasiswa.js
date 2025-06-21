const db = require("../config/database");
const bcrypt = require("bcryptjs");

class Mahasiswa {
  static async create(data) {
    const { nama_lengkap, nim, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO mahasiswa (nama_lengkap, nim, email, password) VALUES (?, ?, ?, ?)",
      [nama_lengkap, nim, email, hashedPassword]
    );
    return result.insertId;
  }

  static async findByNim(nim) {
    const [rows] = await db.execute("SELECT * FROM mahasiswa WHERE nim = ?", [
      nim,
    ]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM mahasiswa WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }
  static async updateProfile(id, data) {
    const { nama_lengkap, email, nomor_hp } = data;
    const sql = `UPDATE mahasiswa SET nama_lengkap = ?, email = ?, nomor_hp = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [nama_lengkap, email, nomor_hp, id]);
    return result.affectedRows;
  }
  static async updatePhoto(id, filePath) {
    const sql = `UPDATE mahasiswa SET foto_profil = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [filePath, id]);
    return result.affectedRows;
  }
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = `UPDATE mahasiswa SET password = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [hashedPassword, id]);
    return result.affectedRows;
  }
  static async update(id, data) {
        const { nama_lengkap, nim, email } = data;
        const sql = `UPDATE mahasiswa SET nama_lengkap = ?, nim = ?, email = ? WHERE id = ?`;
        await db.execute(sql, [nama_lengkap, nim, email, id]);
    }
}
module.exports = Mahasiswa;
