// models/Faq.js

const db = require('../config/database');

class Faq {
    /**
     * Membuat data FAQ baru.
     * @param {object} faqData - Berisi pertanyaan, jawaban, dan kategori.
     * @returns {Promise<object>}
     */
    static async create(faqData) {
        const { pertanyaan, jawaban, kategori } = faqData;
        const sql = 'INSERT INTO faq (pertanyaan, jawaban, kategori) VALUES (?, ?, ?)';
        try {
            const [result] = await db.execute(sql, [pertanyaan, jawaban, kategori || 'Umum']);
            return result;
        } catch (error) {
            console.error("Error creating FAQ:", error);
            throw error;
        }
    }

    /**
     * Mengambil semua data FAQ dari database.
     * @returns {Promise<Array>}
     */
    static async findAll() {
        const sql = 'SELECT * FROM faq ORDER BY kategori, id';
        try {
            const [rows] = await db.execute(sql);
            return rows;
        } catch (error) {
            console.error("Error finding all FAQs:", error);
            throw error;
        }
    }

    /**
     * Mengambil satu data FAQ berdasarkan ID.
     * @param {number} id - ID dari FAQ.
     * @returns {Promise<object|null>}
     */
    static async findById(id) {
        const sql = 'SELECT * FROM faq WHERE id = ?';
        try {
            const [rows] = await db.execute(sql, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error("Error finding FAQ by ID:", error);
            throw error;
        }
    }

    /**
     * Memperbarui data FAQ berdasarkan ID.
     * @param {number} id - ID dari FAQ yang akan diupdate.
     * @param {object} faqData - Data baru untuk FAQ.
     * @returns {Promise<boolean>}
     */
    static async update(id, faqData) {
        const { pertanyaan, jawaban, kategori } = faqData;
        const sql = 'UPDATE faq SET pertanyaan = ?, jawaban = ?, kategori = ? WHERE id = ?';
        try {
            const [result] = await db.execute(sql, [pertanyaan, jawaban, kategori, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating FAQ:", error);
            throw error;
        }
    }

    /**
     * Menghapus data FAQ berdasarkan ID.
     * @param {number} id - ID dari FAQ yang akan dihapus.
     * @returns {Promise<boolean>}
     */
    static async deleteById(id) {
        const sql = 'DELETE FROM faq WHERE id = ?';
        try {
            const [result] = await db.execute(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting FAQ by ID:", error);
            throw error;
        }
    }
}

module.exports = Faq;