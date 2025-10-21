const express = require("express");
const multer = require("multer");
const Certificate = require("../models/Certificate");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const path = require("path");

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Upload certificate
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const certificate = new Certificate({
      userId: req.user.id,
      title,
      category,
      image: req.file.path.replace(/\\/g, "/") // replace backslashes for Windows paths
    });

    await certificate.save();
    res.status(201).json({ message: "Certificate uploaded successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get all certificates of logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Delete certificate
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    if (cert.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
