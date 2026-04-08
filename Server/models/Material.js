const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  type: { type: String, enum: ["PDF", "VIDEO"], required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  downloads: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Material", MaterialSchema);