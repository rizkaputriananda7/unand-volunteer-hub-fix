const db = require('../config/database');
const fs = require('fs/promises'); // Menggunakan fs promises untuk operasi file
const path = require('path');

class Dokumen {
    static async create(fileData, mahasiswaId, bodyData) {
        const { originalname, filename } = fileData;
        let filePath = fileData.path;
        filePath = filePath.replace(/\\/g, '/').replace('public/', '');
        const { tipe_dokumen, volunteer_center_id } = bodyData;
        
        const sql = `
            INSERT INTO dokumen_mahasiswa 
            (mahasiswa_id, volunteer_center_id, tipe_dokumen, nama_file_asli, nama_file_tersimpan, path_file) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const finalCenterId = volunteer_center_id || null;
        const values = [mahasiswaId, finalCenterId, tipe_dokumen, originalname, filename, filePath];
        
        const [result] = await db.execute(sql, values);
        return result.insertId;
    }
    static async findForCenterValidation(centerId) {
        const specificDocsSql = `
            SELECT d.*, m.nama_lengkap AS nama_mahasiswa FROM dokumen_mahasiswa d
            JOIN mahasiswa m ON d.mahasiswa_id = m.id WHERE d.volunteer_center_id = ?
        `;
        const generalDocsSql = `
            SELECT d.*, m.nama_lengkap AS nama_mahasiswa FROM dokumen_mahasiswa d
            JOIN mahasiswa m ON d.mahasiswa_id = m.id
            WHERE d.volunteer_center_id IS NULL AND d.mahasiswa_id IN (
                SELECT DISTINCT a.mahasiswa_id FROM aplikasi a
                JOIN programs p ON a.program_id = p.id WHERE p.volunteer_center_id = ?
            )
        `;
        const [specificDocs] = await db.execute(specificDocsSql, [centerId]);
        const [generalDocs] = await db.execute(generalDocsSql, [centerId]);
        return { specific: specificDocs, general: generalDocs };
    }
    static async updateValidationStatus(dokumenId, status) {
        const sql = "UPDATE dokumen_mahasiswa SET status_validasi = ? WHERE id = ?";
        const [result] = await db.execute(sql, [status, dokumenId]);
        return result.affectedRows;
    }
    static async findByMahasiswaId(mahasiswaId) {
        const sql = "SELECT * FROM dokumen_mahasiswa WHERE mahasiswa_id = ? ORDER BY uploaded_at DESC";
        const [rows] = await db.execute(sql, [mahasiswaId]);
        return rows;
    }
    static async delete(dokumenId, mahasiswaId) {
        // Pertama, ambil path file dari database untuk dihapus dari server
        const [rows] = await db.execute("SELECT path_file FROM dokumen_mahasiswa WHERE id = ? AND mahasiswa_id = ?", [dokumenId, mahasiswaId]);
        
        if (rows.length > 0) {
            const filePath = rows[0].path_file;
            
            // Hapus record dari database
            await db.execute("DELETE FROM dokumen_mahasiswa WHERE id = ?", [dokumenId]);
            
            // Hapus file fisik dari server
            try {
                await fs.unlink(path.join(__dirname, '..', filePath));
            } catch (err) {
                console.error("Gagal menghapus file fisik:", err);
            }
            return true;
        }
        return false;
    }
}

module.exports = Dokumen;
