const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Admin {
    static async create(data) {
        const { nama_lengkap, username, email, password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO admins (nama_lengkap, username, email, password, status) VALUES (?, ?, ?, ?, "Aktif")',
            [nama_lengkap, username, email, hashedPassword]
        );
    }

    static async findByUsername(username) {
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
        return rows[0] || null;
    }
    
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM admins WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async findUserByIdAndRole(id, role) {
        let tableName;
        switch (role) {
            case 'mahasiswa': tableName = 'mahasiswa'; break;
            case 'pengurus': tableName = 'pengurus'; break;
            case 'admin': tableName = 'admins'; break;
            default: throw new Error('Peran tidak valid.');
        }
        const [rows] = await db.execute(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
        return rows[0] || null;
    }

    static async update(id, data) {
        const { nama_lengkap, username, email } = data;
        const sql = `UPDATE admins SET nama_lengkap = ?, username = ?, email = ? WHERE id = ?`;
        await db.execute(sql, [nama_lengkap, username, email, id]);
    }
    static async findAllUsers(searchTerm = '') {
        const whereClause = searchTerm ? `WHERE nama_lengkap LIKE ? OR email LIKE ? OR nim LIKE ? OR username LIKE ?` : '';
        const params = searchTerm ? Array(4).fill(`%${searchTerm}%`) : [];

        const query = `
            SELECT id, nama_lengkap, nim, NULL as username, email, 'mahasiswa' as role, status FROM mahasiswa ${searchTerm ? 'WHERE nama_lengkap LIKE ? OR email LIKE ? OR nim LIKE ?' : ''}
            UNION ALL
            SELECT id, nama_lengkap, NULL as nim, username, email, 'pengurus' as role, status FROM pengurus ${searchTerm ? 'WHERE nama_lengkap LIKE ? OR email LIKE ? OR username LIKE ?' : ''}
            UNION ALL
            SELECT id, nama_lengkap, NULL as nim, username, email, 'admin' as role, status FROM admins ${searchTerm ? 'WHERE nama_lengkap LIKE ? OR email LIKE ? OR username LIKE ?' : ''}
            ORDER BY role, nama_lengkap
        `;
        
        const finalParams = searchTerm ? [
            `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`,
            `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`,
            `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`
        ] : [];

        const [rows] = await db.execute(query, finalParams);
        return rows;
    }

    static async updateUserStatus(userId, role, newStatus) {
        let tableName;
        switch (role) {
            case 'mahasiswa': tableName = 'mahasiswa'; break;
            case 'pengurus': tableName = 'pengurus'; break;
            case 'admin': tableName = 'admins'; break;
            default: throw new Error('Peran pengguna tidak valid.');
        }
        const sql = `UPDATE ${tableName} SET status = ? WHERE id = ?`;
        await db.execute(sql, [newStatus, userId]);
    }

    static async deleteUser(userId, role) {
        let tableName;
        switch (role) {
            case 'mahasiswa': tableName = 'mahasiswa'; break;
            case 'pengurus': tableName = 'pengurus'; break;
            case 'admin': tableName = 'admins'; break;
            default: throw new Error('Peran pengguna tidak valid untuk dihapus.');
        }
        await db.execute(`DELETE FROM ${tableName} WHERE id = ?`, [userId]);
    }
    static async getGlobalDashboardStats() {
        // Jalankan semua query statistik secara paralel
        const [
            [userCounts],
            [programCount],
            [aplikasiCount],
            [pusatCount],
            recentActivities
        ] = await Promise.all([
            db.execute(`
                SELECT 
                    (SELECT COUNT(*) FROM mahasiswa) as mahasiswa,
                    (SELECT COUNT(*) FROM pengurus) as pengurus,
                    (SELECT COUNT(*) FROM admins) as admin
            `),
            db.execute("SELECT COUNT(*) as total FROM programs"),
            db.execute("SELECT COUNT(*) as total FROM aplikasi"),
            db.execute("SELECT COUNT(*) as total FROM volunteer_centers"),
            // Query untuk aktivitas terbaru yang sudah diperbaiki
            db.execute(`
                (SELECT nama_lengkap as nama_aktivitas, 'Mahasiswa Baru' as tipe, created_at FROM mahasiswa ORDER BY created_at DESC LIMIT 3)
                UNION ALL
                (SELECT title as nama_aktivitas, 'Program Baru' as tipe, created_at FROM programs ORDER BY created_at DESC LIMIT 3)
                ORDER BY created_at DESC
                LIMIT 5
            `)
        ]);

        const totalUsers = userCounts[0].mahasiswa + userCounts[0].pengurus + userCounts[0].admin;
        
        return {
            totalUsers,
            totalPrograms: programCount[0].total,
            totalAplikasi: aplikasiCount[0].total,
            totalPusat: pusatCount[0].total,
            recentActivities
        };
    }
    static async getComprehensiveAnalytics() {
        // Jalankan semua query statistik yang kompleks secara paralel
        const [
            // Statistik utama
            [userCounts],
            [programCount],
            [aplikasiCount],
            [pusatCount],
            // Data untuk grafik
            [userGrowth],
            [applicantsPerProgram],
            [volunteersPerCenter],
            [applicationStatus]
        ] = await Promise.all([
            db.execute(`SELECT (SELECT COUNT(*) FROM mahasiswa) as mhs, (SELECT COUNT(*) FROM pengurus) as pgr, (SELECT COUNT(*) FROM admins) as adm`),
            db.execute("SELECT COUNT(*) as total FROM programs"),
            db.execute("SELECT COUNT(*) as total FROM aplikasi"),
            db.execute("SELECT COUNT(*) as total FROM volunteer_centers"),
            db.execute("SELECT DATE(created_at) as date, COUNT(id) as count FROM mahasiswa GROUP BY DATE(created_at) ORDER BY date ASC LIMIT 30"),
            db.execute("SELECT p.title, COUNT(a.id) as count FROM aplikasi a JOIN programs p ON a.program_id = p.id GROUP BY p.title ORDER BY count DESC"),
            db.execute("SELECT vc.nama_pusat, COUNT(a.id) as count FROM aplikasi a JOIN programs p ON a.program_id = p.id JOIN volunteer_centers vc ON p.volunteer_center_id = vc.id WHERE a.status = 'Diterima' GROUP BY vc.nama_pusat"),
            db.execute("SELECT status, COUNT(*) as count FROM aplikasi GROUP BY status")
        ]);

        return {
            stats: {
                totalUsers: userCounts[0].mhs + userCounts[0].pgr + userCounts[0].adm,
                totalPrograms: programCount[0].total,
                totalAplikasi: aplikasiCount[0].total,
                totalPusat: pusatCount[0].total,
            },
            charts: {
                userGrowth,
                applicantsPerProgram,
                volunteersPerCenter,
                applicationStatus
            }
        };
    }
    static async getSelectionOverviewStats() {
        // Query untuk menghitung jumlah aplikasi berdasarkan statusnya
        const statusSql = "SELECT status, COUNT(*) as count FROM aplikasi GROUP BY status";
        
        // Query untuk menghitung jumlah pendaftar dan yang diterima untuk setiap program
        const programSql = `
            SELECT 
                p.id,
                p.title,
                COUNT(a.id) as totalApplicants,
                SUM(CASE WHEN a.status = 'Diterima' THEN 1 ELSE 0 END) as acceptedApplicants
            FROM programs p
            LEFT JOIN aplikasi a ON p.id = a.program_id
            GROUP BY p.id, p.title
            ORDER BY totalApplicants DESC
        `;

        // Jalankan kedua query secara paralel
        const [
            [statusRows],
            [programSummaries]
        ] = await Promise.all([
            db.execute(statusSql),
            db.execute(programSql)
        ]);

        // Proses hasil query status menjadi objek yang mudah digunakan
        const stats = {
            totalAplikasi: 0,
            Ditinjau: 0,
            Wawancara: 0,
            Diterima: 0,
            Ditolak: 0
        };
        statusRows.forEach(row => {
            stats[row.status] = row.count;
            stats.totalAplikasi += row.count;
        });

        return { stats, programSummaries };
    }
}

module.exports = Admin;
