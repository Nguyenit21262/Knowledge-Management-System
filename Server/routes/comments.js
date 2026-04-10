const express = require("express");
const {
  getCommentsByMaterial,
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:materialId", getCommentsByMaterial);
router.post("/:materialId", protect, createComment);
router.delete("/delete/:commentId", protect, deleteComment);

module.exports = router;
