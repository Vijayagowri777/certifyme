const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Technical", "Non-Technical", "Academic"],
    required: true
  },
  image: {
    type: String, // store URL or file path
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Certificate", certificateSchema);
