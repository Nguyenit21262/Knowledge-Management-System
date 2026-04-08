const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    fileUrl: { type: String, required: true },
    originalName: { type: String },
    fileSize: { type: Number, default: 0 },

    fileType: {
      type: String,
      enum: ["pdf", "video", "image", "document", "other"],
      default: "other",
    },

    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    downloadCount: { type: Number, default: 0 },

    // chừa sẵn cho nâng cấp sau
    tags: [{ type: String, trim: true, lowercase: true }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Material", MaterialSchema);
