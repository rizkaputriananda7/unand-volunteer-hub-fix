// models/Program.js

const db = require('../config/database');

class Program {
    /**
     * Membuat program baru di database.
     * @param {object} programData - Data program dari form.
     * @returns {Promise<object>} Hasil dari operasi insert.
     */
    static async create(programData) {
        // Menggunakan nama kolom yang sesuai dengan database
        const { title, description, persyaratan, durasi, manfaat, kontak_narahubung, volunteer_center_id, coordinator_id, tanggal_pelaksanaan, location, quota, pendaftaran_mulai, pendaftaran_akhir } = programData;
        
        const sql = `
            INSERT INTO programs (title, description, persyaratan, durasi, manfaat, kontak_narahubung, volunteer_center_id, coordinator_id, tanggal_pelaksanaan, location, quota, pendaftaran_mulai, pendaftaran_akhir)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await db.execute(sql, [title, description, persyaratan, durasi, manfaat, kontak_narahubung, volunteer_center_id, coordinator_id, tanggal_pelaksanaan, location, quota, pendaftaran_mulai, pendaftaran_akhir]);
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
        const sql = 'SELECT * FROM programs WHERE volunteer_center_id = ? ORDER BY id DESC';
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
     * @param {number} programId - ID dari program yang akan diambil.
     * @returns {Promise<object|null>} Objek program jika ditemukan, atau null jika tidak.
     */
    static async findById(programId) {
        const sql = 'SELECT * FROM programs WHERE id = ?';
        try {
            const [rows] = await db.execute(sql, [programId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding program by ID:', error);
            throw error;
        }
    }

    /**
     * Memperbarui data program di database.
     * @param {number} programId - ID dari program yang akan diperbarui.
     * @param {object} programData - Objek berisi data baru untuk program.
     * @returns {Promise<boolean>} True jika berhasil, false jika gagal.
     */
    static async update(programId, programData) {
        const { title, description, persyaratan, durasi, manfaat, kontak_narahubung, volunteer_center_id, coordinator_id, tanggal_pelaksanaan, location, quota, pendaftaran_mulai, pendaftaran_akhir } = programData;
        const sql = `
            UPDATE programs SET title = ?, description = ?, persyaratan = ?, durasi = ?, manfaat = ?, kontak_narahubung = ?, volunteer_center_id = ?, coordinator_id = ?, tanggal_pelaksanaan = ?, location = ?, quota = ?, pendaftaran_mulai = ?, pendaftaran_akhir = ?
            WHERE id = ?
        `;
        try {
            const [result] = await db.execute(sql, [title, description, persyaratan, durasi, manfaat, kontak_narahubung, volunteer_center_id, coordinator_id, tanggal_pelaksanaan, location, quota, pendaftaran_mulai, pendaftaran_akhir, programId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating program:', error);
            throw error;
        }
    }

    /**
     * Menghapus program dari database berdasarkan ID.
     * @param {number} programId - ID dari program yang akan dihapus.
     * @returns {Promise<boolean>} True jika berhasil, false jika gagal.
     */
    static async deleteById(programId) {
        const sql = 'DELETE FROM programs WHERE id = ?';
        try {
            const [result] = await db.execute(sql, [programId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting program by ID:', error);
            throw error;
        }
    }
}

module.exports = Program;