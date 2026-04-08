const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Material = require('../models/Material');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');
const { isTeacher } = require('../middleware/roleMiddleware');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Detect file type
const detectFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) return 'VIDEO';
  return 'PDF';
};

// Format document trả về cho frontend
const formatMaterial = (material, comments = []) => ({
  id: material._id,
  type: material.type,
  subject: material.subject,
  title: material.title,
  description: material.description,
  category: material.category,
  author: material.uploadedBy?.name || 'Unknown',
  date: new Date(material.createdAt).toLocaleDateString('en-US'),
  downloads: material.downloads,
  commentsCount: material.commentsCount,
  fileUrl: material.fileUrl,
  comments: comments.map(c => ({
    id: c._id,
    author: c.author?.name || 'Unknown',
    role: c.author?.role || 'student',
    date: new Date(c.createdAt).toLocaleDateString('en-US'),
    content: c.content
  }))
});

// GET /api/materials — Lấy tất cả tài liệu
router.get('/', async (req, res) => {
  try {
    const { search, subject, type } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (subject) filter.subject = subject;
    if (type) filter.type = type;

    const materials = await Material.find(filter)
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    const result = materials.map(m => formatMaterial(m));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/materials/:id — Lấy chi tiết + comments
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name role');

    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }

    const comments = await Comment.find({ material: req.params.id })
      .populate('author', 'name role')
      .sort({ createdAt: 1 });

    res.json(formatMaterial(material, comments));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// POST /api/materials — Upload tài liệu (teacher only)
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
      subject,
      category,
      type: fileType,
      fileUrl,
      uploadedBy: req.user.id
    });

    await material.save();
    const populated = await material.populate('uploadedBy', 'name role');
    res.status(201).json(formatMaterial(populated));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// PATCH /api/materials/:id/download — Tăng download count
router.patch('/:id/download', async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    res.json({ downloads: material.downloads });
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