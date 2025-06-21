// models/Program.js

const db = require('../config/database');

class Program {
    /**
     * Membuat program baru di database.
     * @param {object} programData - Data program dari form.
     * @returns {Promise<object>} Hasil dari operasi insert.
     */
    static async create(programData) {
        const { nama_program, deskripsi, persyaratan, durasi, manfaat, kontak, id_pusat_volunteer } = programData;
        const sql = `
            INSERT INTO program (nama_program, deskripsi, persyaratan, durasi, manfaat, kontak, id_pusat_volunteer)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await db.execute(sql, [nama_program, deskripsi, persyaratan, durasi, manfaat, kontak, id_pusat_volunteer]);
            return result;
        } catch (error) {
            console.error("Error creating program:", error);
            throw error;
        }
    }

    /**
     * Mengambil semua program berdasarkan ID pusat volunteer.
     * @param {number} centerId - ID dari pusat volunteer milik pengurus.
     * @returns {Promise<Array>} Array berisi program.
     */
    static async findAllByCenter(centerId) {
        const sql = 'SELECT * FROM program WHERE id_pusat_volunteer = ? ORDER BY id_program DESC';
        try {
            const [rows] = await db.execute(sql, [centerId]);
            return rows;
        } catch (error) {
            console.error("Error finding all programs by center:", error);
            throw error;
        }
    }

    /**
     * Mengambil satu data program dari database berdasarkan ID-nya.
     * @param {number} id - ID dari program yang akan diambil.
     * @returns {Promise<object|null>} Objek program jika ditemukan, atau null jika tidak.
     */
    static async findById(id) {
        const sql = 'SELECT * FROM program WHERE id_program = ?';
        try {
            const [rows] = await db.execute(sql, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding program by ID:', error);
            throw error;
        }
    }

    /**
     * Memperbarui data program di database.
     * @param {number} id - ID dari program yang akan diperbarui.
     * @param {object} programData - Objek berisi data baru untuk program.
     * @returns {Promise<boolean>} True jika berhasil, false jika gagal.
     */
    static async update(id, programData) {
        const { nama_program, deskripsi, persyaratan, durasi, manfaat, kontak, id_pusat_volunteer } = programData;
        const sql = `
            UPDATE program SET nama_program = ?, deskripsi = ?, persyaratan = ?, durasi = ?, manfaat = ?, kontak = ?, id_pusat_volunteer = ?
            WHERE id_program = ?
        `;
        try {
            const [result] = await db.execute(sql, [nama_program, deskripsi, persyaratan, durasi, manfaat, kontak, id_pusat_volunteer, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating program:', error);
            throw error;
        }
    }

    /**
     * Menghapus program dari database berdasarkan ID.
     * @param {number} id - ID dari program yang akan dihapus.
     * @returns {Promise<boolean>} True jika berhasil, false jika gagal.
     */
    static async deleteById(id) {
        const sql = 'DELETE FROM program WHERE id_program = ?';
        try {
            const [result] = await db.execute(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting program by ID:', error);
            throw error;
        }
    }
}

module.exports = Program;