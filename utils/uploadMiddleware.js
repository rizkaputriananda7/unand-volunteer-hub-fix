const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file dengan Multer
const storage = multer.diskStorage({
    // Menentukan folder tujuan untuk menyimpan file
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/dokumen/');
    },
    // Membuat nama file yang unik untuk mencegah konflik
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter untuk hanya menerima jenis file tertentu (misalnya, PDF, gambar)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: Hanya file dengan format PDF, JPG, dan PNG yang diizinkan!'));
};

// Buat instance Multer dengan konfigurasi di atas
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file 5 MB
    fileFilter: fileFilter
});

module.exports = upload;
