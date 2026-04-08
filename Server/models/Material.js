const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileType: {
    type: String,
    enum: ['pdf', 'video', 'image', 'document', 'other'],
    default: 'other'
  },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  downloadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', MaterialSchema);