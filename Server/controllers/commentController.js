import Comment from "../models/Comment.js";
import Material from "../models/Material.js";

const formatComment = (comment) => ({
  id: comment._id,
  content: comment.content,
  author: comment.author?.name || "Unknown",
  authorRole: comment.author?.role || "student",
  createdAt: comment.createdAt,
});

export const getCommentsByMaterial = async (req, res) => {
  try {
    const comments = await Comment.find({ material: req.params.materialId })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    return res.json(comments.map(formatComment));
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi lấy comment",
      error: err.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Nội dung comment không được rỗng",
      });
    }

    const material = await Material.findById(req.params.materialId);

    if (!material) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu",
      });
    }

    const comment = await Comment.create({
      material: req.params.materialId,
      author: req.user.id,
      content: content.trim(),
    });

    await Material.findByIdAndUpdate(req.params.materialId, {
      $inc: { commentsCount: 1 },
    });

    await comment.populate("author", "name role");

    return res.status(201).json({
      message: "Thêm comment thành công",
      comment: formatComment(comment),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi thêm comment",
      error: err.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Không tìm thấy comment",
      });
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

    return res.json({
      message: "Xóa comment thành công",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi xóa comment",
      error: err.message,
    });
  }
};
