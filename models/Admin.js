const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Admin {
    /**
     * Membuat admin baru.
     */
    static async create(data) {
        const { nama_lengkap, username, email, password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO admins (nama_lengkap, username, email, password) VALUES (?, ?, ?, ?)',
            [nama_lengkap, username, email, hashedPassword]
        );
        return result.insertId;
    }

    /**
     * Mencari admin berdasarkan username. Ini yang dibutuhkan untuk login.
     */
    static async findByUsername(username) {
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
        return rows[0] || null;
    }
    
    /**
     * Mencari admin berdasarkan ID.
     */
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM admins WHERE id = ?', [id]);
        return rows[0] || null;
    }

    /**
     * FUNGSI YANG DIPERBAIKI: Mengambil semua pengguna dari 3 tabel dengan pencarian yang lebih komprehensif.
     */
    static async findAllUsers(searchTerm = '') {
        const baseQueryMahasiswa = `(SELECT id, nama_lengkap, nim, NULL as username, email, 'mahasiswa' as role FROM mahasiswa`;
        const baseQueryPengurus = `(SELECT id, nama_lengkap, NULL as nim, username, email, 'pengurus' as role FROM pengurus`;
        const baseQueryAdmin = `(SELECT id, nama_lengkap, NULL as nim, username, email, 'admin' as role FROM admins`;

        let finalQuery;
        let finalParams = [];

        if (searchTerm) {
            // Jika ada kata kunci pencarian, tambahkan klausa WHERE yang sesuai
            const likeTerm = `%${searchTerm}%`;
            
            const whereMahasiswa = ` WHERE nama_lengkap LIKE ? OR email LIKE ? OR nim LIKE ?)`;
            const wherePengurusAdmin = ` WHERE nama_lengkap LIKE ? OR email LIKE ? OR username LIKE ?)`;
            
            finalQuery = `
                ${baseQueryMahasiswa}${whereMahasiswa}
                UNION ALL
                ${baseQueryPengurus}${wherePengurusAdmin}
                UNION ALL
                ${baseQueryAdmin}${wherePengurusAdmin}
                ORDER BY role, nama_lengkap
            `;
            // Siapkan parameter untuk setiap klausa WHERE
            finalParams = [likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm];
        } else {
            // Jika tidak ada pencarian, gabungkan saja semuanya tanpa WHERE
            finalQuery = `
                ${baseQueryMahasiswa})
                UNION ALL
                ${baseQueryPengurus})
                UNION ALL
                ${baseQueryAdmin})
                ORDER BY role, nama_lengkap
            `;
        }
        
        // Logging untuk debugging: Lihat ini di terminal Anda!
        console.log("Executing SQL Query for findAllUsers:", finalQuery);
        console.log("With Parameters:", finalParams);

        const [rows] = await db.execute(finalQuery, finalParams);
        
        console.log("Rows received from DB:", rows.length); // Lihat berapa banyak baris yang didapat
        return rows;
    }

    /**
     * Menghapus pengguna dari tabel yang benar.
     */
    static async deleteUser(userId, role) {
        let tableName;
        switch (role) {
            case 'mahasiswa': tableName = 'mahasiswa'; break;
            case 'pengurus': tableName = 'pengurus'; break;
            case 'admin': tableName = 'admins'; break;
            default: throw new Error('Peran pengguna tidak valid untuk dihapus.');
        }
        const sql = `DELETE FROM ${tableName} WHERE id = ?`;
        const [result] = await db.execute(sql, [userId]);
        return result.affectedRows;
    }
}

module.exports = Admin;
