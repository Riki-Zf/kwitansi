const Pembayaran = require("../models/pembayaran.js");

const tambahPembayaran = async (req, res) => {
  try {
    const count = await Pembayaran.countDocuments();
    const newPembayaran = new Pembayaran({
      ...req.body,
      no_kwitansi: `KW-${String(count + 1).padStart(5, "0")}`,
    });
    const saved = await newPembayaran.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPembayaran = async (req, res) => {
  try {
    const data = await Pembayaran.find().sort({ tanggal: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { tambahPembayaran, getPembayaran };
