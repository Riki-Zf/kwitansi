const mongoose = require("mongoose");

const pembayaranSchema = new mongoose.Schema({
  tanggal: { type: Date, default: Date.now },
  nama: { type: String, required: true },
  alamat: { type: String, required: true },
  no_kwitansi: { type: String, unique: true },
  layanan: { type: String, required: true },
  pararel: { type: Number, default: 0 },
  dendah: { type: Number, default: 0 },
  jumlahBulan: { type: Number, default: 1 },
  iuranBulanan: { type: Number, default: 0 },
  jumlahTV: { type: Number, default: 1 },
  idPelanggan: { type: String }, // untuk ID seperti M219
});

module.exports = mongoose.model("Pembayaran", pembayaranSchema);
