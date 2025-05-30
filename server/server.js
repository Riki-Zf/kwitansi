const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // development port Vite
      "http://localhost:5000", // alternative development port
      "https://kwitansi-ew3n.vercel.app", // production URL tanpa trailing slash
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // specify allowed headers
  })
);
app.use(express.json());

app.use("/api/pembayaran", require("./routes/pembayaranRoutes"));

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port http://localhost:${PORT}`));

module.exports = app;
