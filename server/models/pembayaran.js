const mongoose = require("mongoose");

const pembayaranSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  alamat: { type: String, required: true },
  jumlah: { type: Number, required: true },
  tanggal: { type: Date, default: Date.now },
  keterangan: { type: String },
  no_kwitansi: { type: String, unique: true },
});

module.exports = mongoose.model("Pembayaran", pembayaranSchema);
