const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pembayaran", require("./routes/pembayaranRoutes"));

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port http://localhost:${PORT}`));
