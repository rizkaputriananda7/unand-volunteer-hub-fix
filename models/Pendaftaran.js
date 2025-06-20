const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Mahasiswa = require('./Mahasiswa');
const Program = require('./Program');

// Mendefinisikan model Pendaftaran
const Pendaftaran = sequelize.define('Pendaftaran', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  mahasiswa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Mahasiswa, // Mereferensikan model Mahasiswa
      key: 'id'
    }
  },
  program_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Program, // Mereferensikan model Program
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Terkirim', 'Sedang Ditinjau', 'Diterima', 'Ditolak'),
    defaultValue: 'Terkirim', // Status default saat pendaftaran dibuat
    allowNull: false
  },
  tanggal_pendaftaran: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // Tanggal default saat pendaftaran dibuat
  }
}, {
  tableName: 'pendaftaran', // Nama tabel di database
  timestamps: false // Tidak menggunakan kolom createdAt dan updatedAt
});

// Mendefinisikan hubungan (asosiasi) antar model
// Setiap Pendaftaran milik satu Program
Pendaftaran.belongsTo(Program, { foreignKey: 'program_id', as: 'program' });
// Setiap Program bisa memiliki banyak Pendaftaran
Program.hasMany(Pendaftaran, { foreignKey: 'program_id' });

// Setiap Pendaftaran milik satu Mahasiswa
Pendaftaran.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_id', as: 'mahasiswa' });
// Setiap Mahasiswa bisa memiliki banyak Pendaftaran
Mahasiswa.hasMany(Pendaftaran, { foreignKey: 'mahasiswa_id' });

module.exports = Pendaftaran;