const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');

// GET /api/comments/:materialId
router.get('/:materialId', async (req, res) => {
  try {
    const comments = await Comment.find({ material: req.params.materialId })
      .populate('author', 'name role')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// POST /api/comments/:materialId (phải đăng nhập)
router.post('/:materialId', protect, async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      material: req.params.materialId,
      author: req.user.id
    });
    await comment.save();

    const populated = await comment.populate('author', 'name role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;