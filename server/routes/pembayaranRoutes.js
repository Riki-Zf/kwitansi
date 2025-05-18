const express = require("express");
const router = express.Router();
const { tambahPembayaran, getPembayaran } = require("../controllers/pembayaranController.js");

router.post("/add", tambahPembayaran);
router.get("/list", getPembayaran);

module.exports = router;
