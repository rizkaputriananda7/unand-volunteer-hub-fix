// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs", // <-- TAMBAHKAN BARIS INI
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/js/**/*.js"
  ],
  theme: {
    extend: {
      // Daftarkan variabel warna CSS Anda di sini
      colors: {
        'primary-teal': 'var(--primary-teal)',
        'light-teal': 'var(--light-teal)',
        'dark-teal': 'var(--dark-teal)',
        'bg-light': 'var(--bg-light)',
        'bg-primary': 'var(--bg-primary)',
        'accent-blue': 'var(--accent-blue)',
        'light-blue': 'var(--light-blue)',
        'dark-blue': 'var(--dark-blue)',
        'accent-red': 'var(--accent-red)',
        'light-red': 'var(--light-red)',
        'dark-red': 'var(--dark-red)',
        'accent-purple': 'var(--accent-purple)',
        'light-purple': 'var(--light-purple)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      fontFamily: {
        // Daftarkan font Inter agar bisa digunakan dengan class 'font-inter'
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}