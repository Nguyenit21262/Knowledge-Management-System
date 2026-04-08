const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Material = require('../models/Material');
const { protect } = require('../middleware/authMiddleware');

// GET /api/comments/:materialId
router.get('/:materialId', async (req, res) => {
  try {
    const comments = await Comment.find({ material: req.params.materialId })
      .populate('author', 'name role')
      .sort({ createdAt: 1 });

    const result = comments.map(c => ({
      id: c._id,
      author: c.author?.name || 'Unknown',
      role: c.author?.role || 'student',
      date: new Date(c.createdAt).toLocaleDateString('en-US'),
      content: c.content
    }));

    res.json(result);
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

    // Tăng commentsCount trong material
    await Material.findByIdAndUpdate(
      req.params.materialId,
      { $inc: { commentsCount: 1 } }
    );

    const populated = await comment.populate('author', 'name role');

    res.status(201).json({
      id: populated._id,
      author: populated.author?.name,
      role: populated.author?.role,
      date: new Date(populated.createdAt).toLocaleDateString('en-US'),
      content: populated.content
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;