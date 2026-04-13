import Comment from "../models/Comment.js";
import Material from "../models/Material.js";
import { normalizeWhitespace } from "../utils/normalizeText.js";

const formatComment = (comment) => ({
  id: comment._id.toString(),
  content: comment.content,
  author: comment.author?.name || "Unknown",
  authorRole: comment.author?.role || "student",
  createdAt: comment.createdAt,
});

export const getCommentsByMaterial = async (req, res) => {
  try {
    const comments = await Comment.find({ material: req.params.materialId })
      .populate("author", "name role")
      .sort({ createdAt: 1 })
      .lean();

    return res.json(comments.map(formatComment));
  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching comments.",
      error: err.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const content = normalizeWhitespace(
      typeof req.body?.content === "string" ? req.body.content : "",
    );

    if (!content) {
      return res.status(400).json({
        message: "Comment content cannot be empty.",
      });
    }

    const material = await Material.findById(req.params.materialId).lean();

    if (!material) {
      return res.status(404).json({
        message: "Material not found.",
      });
    }

    const comment = await Comment.create({
      material: req.params.materialId,
      author: req.user._id,
      content,
    });

    await comment.populate("author", "name role");

    return res.status(201).json({
      message: "Comment created successfully.",
      comment: formatComment(comment),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while creating comment.",
      error: err.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    const isOwner = comment.author.toString() === req.user.id;
    const canModerate = ["teacher", "admin"].includes(req.user.role);

    if (!isOwner && !canModerate) {
      return res.status(403).json({
        message: "You do not have permission to delete this comment.",
      });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    return res.json({
      message: "Comment deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while deleting comment.",
      error: err.message,
    });
  }
};
