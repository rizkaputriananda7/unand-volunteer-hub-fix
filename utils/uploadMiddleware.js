const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Tentukan folder berdasarkan nama field (cv, transkrip, ktm)
        let uploadPath = 'public/uploads/dokumen/';
        if (file.fieldname === 'cv' || file.fieldname === 'transkrip' || file.fieldname === 'ktm') {
            uploadPath = `public/uploads/aplikasi/${file.fieldname}/`;
        } else if (file.fieldname === 'foto_profil') {
             uploadPath = 'public/uploads/profil/';
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.user.nim + '-' + file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter file
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: Format file tidak valid! Hanya PDF, JPG, PNG yang diizinkan.'));
};

// Buat instance Multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

module.exports = upload;