const db = require('../config/database');

class Konten {
    /**
     * Membuat konten baru.
     */
    static async create(data, pengurusId, centerId) {
        const { judul_konten, isi_konten, gambar_konten } = data;
        const sql = `
            INSERT INTO konten (volunteer_center_id, pengurus_id, judul_konten, isi_konten, gambar_konten) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [centerId, pengurusId, judul_konten, isi_konten, gambar_konten]);
        return result.insertId;
    }

    /**
     * Mengambil semua konten untuk pusat volunteer tertentu.
     */
    static async findByCenter(centerId) {
        const sql = "SELECT * FROM konten WHERE volunteer_center_id = ? ORDER BY created_at DESC";
        const [rows] = await db.execute(sql, [centerId]);
        return rows;
    }

    /**
     * Mengambil konten spesifik berdasarkan ID.
     */
    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM konten WHERE id = ?", [id]);
        return rows[0] || null;
    }
    
    /**
     * Mengambil beberapa konten terbaru dari semua pusat untuk ditampilkan di dashboard mahasiswa.
     */
    static async findLatest(limit = 4) {
        const sql = `
            SELECT k.*, vc.nama_pusat
            FROM konten k
            JOIN volunteer_centers vc ON k.volunteer_center_id = vc.id
            ORDER BY k.created_at DESC
            LIMIT ?
        `;
        const [rows] = await db.execute(sql, [limit]);
        return rows;
    }

    /**
     * Memperbarui konten yang sudah ada.
     */
    static async update(id, data) {
        const { judul_konten, isi_konten, gambar_konten } = data;
        // Query akan secara dinamis menyertakan gambar hanya jika ada gambar baru yang diunggah
        let sql = 'UPDATE konten SET judul_konten = ?, isi_konten = ?';
        const params = [judul_konten, isi_konten];
        
        if (gambar_konten) {
            sql += ', gambar_konten = ?';
            params.push(gambar_konten);
        }
        
        sql += ' WHERE id = ?';
        params.push(id);

        const [result] = await db.execute(sql, params);
        return result.affectedRows;
    }

    /**
     * Menghapus konten.
     */
    static async delete(id, centerId) {
        const sql = "DELETE FROM konten WHERE id = ? AND volunteer_center_id = ?";
        const [result] = await db.execute(sql, [id, centerId]);
        return result.affectedRows;
    }
}

module.exports = Konten;
