const express = require("express");
const router = express.Router();
const mahasiswaController = require("../controllers/mahasiswaController");
const { authenticateToken, authorizeRole } = require("../utils/authUtils");
const upload = require("../utils/uploadMiddleware");
const multer = require("multer");

// Terapkan middleware otentikasi dan otorisasi untuk semua rute di bawah ini
router.use(authenticateToken, authorizeRole("mahasiswa"));

// Definisikan rute untuk setiap fitur mahasiswa
router.get("/dashboard", mahasiswaController.showDashboard);
router.get("/aplikasi", mahasiswaController.showStatusAplikasi);
router.get('/kalender', mahasiswaController.showKalender);
router.get("/notifikasi", mahasiswaController.showNotifikasi);
router.get("/dokumen", mahasiswaController.showDokumen);
router.get("/bantuan-surat", mahasiswaController.showBantuanSurat);
router.get("/umpan-balik", mahasiswaController.showFeedbackPage);
router.post("/umpan-balik", mahasiswaController.handlePostFeedback);
router.get("/dokumen", mahasiswaController.showDokumen);
router.post("/dokumen/delete/:id", mahasiswaController.handleDeleteDokumen);
router.post("/dokumen/upload",
  (req, res, next) => {
    // Panggil middleware upload.single secara manual di sini
    const uploader = upload.single("dokumen");

    uploader(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Error dari Multer (misal: file terlalu besar)
        req.uploadError = `Error Multer: ${err.message}`;
      } else if (err) {
        // Error kustom dari fileFilter kita (format file salah)
        req.uploadError = err.message;
      }
      // Jika tidak ada error, lanjutkan ke controller
      next();
    });
  },
  mahasiswaController.handleUploadDokumen
);
router.get("/profil", mahasiswaController.showProfilePage);
router.post("/profil", mahasiswaController.handleUpdateProfile);
router.post("/profil/foto",
  upload.single("foto_profil"),
  mahasiswaController.handleUpdatePhoto
);
router.post("/profil/password", mahasiswaController.handleUpdatePassword);
router.get('/bookmark', mahasiswaController.showBookmarkPage);
router.post('/bookmark/add', mahasiswaController.handleAddBookmark);
router.post('/bookmark/remove', mahasiswaController.handleRemoveBookmark);
router.post('/bookmark/:programId', mahasiswaController.toggleBookmarkAjax);
router.get('/faq', mahasiswaController.showFaqPage);


module.exports = router;
