const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware untuk meng-inject data dan menentukan layout.
 * Menyimpan `user` dan `layout` di res.locals untuk diakses dari view EJS.
 */
exports.injectUserAndSetLayout = async (req, res, next) => {
  // Secara default, tidak ada user dan layout diatur untuk halaman otentikasi.
  res.locals.user = null;
  res.locals.layout = 'partials/layout-auth'; // Layout untuk login & register

  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (user) {
        // Jika user valid, timpa default.
        req.user = user;
        res.locals.user = user;
        // Atur layout sesuai role user.
        res.locals.layout = `partials/layout-${user.role}`;
      }
    } catch (err) {
      console.log('Token tidak valid, melanjutkan sebagai guest.');
      res.clearCookie('token');
    }
  }

  // Lanjutkan ke request berikutnya.
  next();
};
