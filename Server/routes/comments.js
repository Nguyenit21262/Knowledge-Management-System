const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Material = require("../models/Material");
const { protect } = require("../middleware/authMiddleware");

// GET /api/comments/:materialId
router.get("/:materialId", async (req, res) => {
  try {
    const comments = await Comment.find({ material: req.params.materialId })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    const result = comments.map((c) => ({
      id: c._id,
      author: c.author?.name || "Unknown",
      role: c.author?.role || "student",
      date: new Date(c.createdAt).toLocaleDateString("en-US"),
      content: c.content,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi lấy comment",
      error: err.message,
    });
  }
});

// POST /api/comments/:materialId
router.post("/:materialId", protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Nội dung comment không được để trống",
      });
    }

    const material = await Material.findById(req.params.materialId);
    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    const comment = new Comment({
      content,
      material: req.params.materialId,
      author: req.user.id,
    });

    await comment.save();

    await Material.findByIdAndUpdate(req.params.materialId, {
      $inc: { commentsCount: 1 },
    });

    const populatedComment = await comment.populate("author", "name role");

    res.status(201).json({
      message: "Thêm comment thành công",
      comment: {
        id: populatedComment._id,
        author: populatedComment.author?.name || "Unknown",
        role: populatedComment.author?.role || "student",
        date: new Date(populatedComment.createdAt).toLocaleDateString("en-US"),
        content: populatedComment.content,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi thêm comment",
      error: err.message,
    });
  }
});

// DELETE /api/comments/delete/:commentId
// Cho phép người tạo comment hoặc teacher xóa
router.delete("/delete/:commentId", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy comment" });
    }

    const isOwner = comment.author.toString() === req.user.id;
    const isTeacher = req.user.role === "teacher";

    if (!isOwner && !isTeacher) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa comment này",
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    await Material.findByIdAndUpdate(comment.material, {
      $inc: { commentsCount: -1 },
    });

    res.json({ message: "Xóa comment thành công" });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi xóa comment",
      error: err.message,
    });
  }
});

module.exports = router;
