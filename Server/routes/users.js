const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Material = require("../models/Material");
const Comment = require("../models/Comment");
const { protect } = require("../middleware/authMiddleware");

// GET /api/users/profile — Lấy thông tin user đang đăng nhập
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// GET /api/users/stats — Lấy thống kê của user
router.get("/stats", protect, async (req, res) => {
  try {
    const commentsCount = await Comment.countDocuments({ author: req.user.id });
    const materialsUploaded = await Material.countDocuments({ uploadedBy: req.user.id });

    res.json({
      commentsPosted: commentsCount,
      materialsUploaded,
      downloads: 0,      // sẽ implement sau
      bookmarked: 0      // sẽ implement sau
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// PUT /api/users/profile — Cập nhật thông tin user
router.put("/profile", protect, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;