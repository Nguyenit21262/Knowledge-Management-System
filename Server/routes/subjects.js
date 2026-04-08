const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { protect } = require('../middleware/authMiddleware');
const { isTeacher } = require('../middleware/roleMiddleware');

// GET /api/subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// POST /api/subjects (teacher only)
router.post('/', protect, isTeacher, async (req, res) => {
  try {
    const existing = await Subject.findOne({ name: req.body.name });
    if (existing) {
      return res.status(400).json({ message: 'Môn học đã tồn tại' });
    }
    const subject = new Subject({ name: req.body.name });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// DELETE /api/subjects/:id (teacher only)
router.delete('/:id', protect, isTeacher, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa môn học' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;