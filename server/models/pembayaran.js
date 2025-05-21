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
  idPelanggan: { type: String }, // untuk ID seperti M219
});

// Generate auto increment ID
pembayaranSchema.pre("save", async function (next) {
  if (!this.idPelanggan) {
    const count = await mongoose.model("Pembayaran").countDocuments();
    this.idPelanggan = `M${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Pembayaran", pembayaranSchema);
