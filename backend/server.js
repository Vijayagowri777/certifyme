const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded certificate files
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // backend/uploads folder

// ✅ Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("Welcome to CertifyMe Backend!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
