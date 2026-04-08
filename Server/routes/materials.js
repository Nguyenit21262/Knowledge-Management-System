const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Material = require('../models/Material');
const { protect } = require('../middleware/authMiddleware');
const { isTeacher } = require('../middleware/roleMiddleware');

// Cấu hình multer lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Hàm detect fileType từ extension
const detectFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (['.pdf'].includes(ext)) return 'pdf';
  if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) return 'video';
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return 'image';
  if (['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'].includes(ext)) return 'document';
  return 'other';
};

// GET /api/materials
router.get('/', async (req, res) => {
  try {
    const { search, subject } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (subject) filter.subject = subject;

    const materials = await Material.find(filter)
      .populate('uploadedBy', 'name role')
      .populate('subject', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/materials/:id
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name role')
      .populate('subject', 'name')
      .populate('category', 'name');

    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// POST /api/materials (teacher only)
router.post('/', protect, isTeacher, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file để upload' });
    }

    const { title, description, subject, category } = req.body;
    const fileType = detectFileType(req.file.originalname);
    const fileUrl = `/uploads/${req.file.filename}`;

    const material = new Material({
      title,
      description,
      fileUrl,
      fileType,
      subject,
      category,
      uploadedBy: req.user.id
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// PATCH /api/materials/:id/download — Tăng download count
router.patch('/:id/download', async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    res.json({ downloadCount: material.downloadCount });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// DELETE /api/materials/:id (teacher only)
router.delete('/:id', protect, isTeacher, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa tài liệu' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;