import Comment from "../models/Comment.js";
import Material from "../models/Material.js";
import { normalizeUserRole } from "../models/User.js";
import { createCommentNotifications } from "../utils/notificationService.js";

const MAX_COMMENT_LENGTH = 1000;

const isValidObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ""));

const validateContent = (content) => {
  if (!content || !content.trim()) {
    return "Comment content is required.";
  }

  if (content.trim().length > MAX_COMMENT_LENGTH) {
    return `Comment must be ${MAX_COMMENT_LENGTH} characters or less.`;
  }

  return null;
};

const buildCommentNode = (comment) => ({
  _id: comment._id.toString(),
  id: comment._id.toString(),
  materialId: comment.material?.toString?.() || comment.material,
  parentId: comment.parent?.toString?.() || comment.parent || null,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  author: {
    id: comment.author?._id?.toString?.() || "",
    name: comment.author?.name || "Unknown",
    role: normalizeUserRole(comment.author?.role),
  },
  children: [],
});

const buildCommentTree = (comments) => {
  const commentMap = new Map();
  const rootComments = [];

  comments.forEach((comment) => {
    const node = buildCommentNode(comment);
    commentMap.set(node.id, node);
  });

  comments.forEach((comment) => {
    const currentId = comment._id.toString();
    const parentId = comment.parent?.toString?.() || null;
    const currentNode = commentMap.get(currentId);

    if (parentId && commentMap.has(parentId)) {
      commentMap.get(parentId).children.push(currentNode);
      return;
    }

    rootComments.push(currentNode);
  });

  const sortTreeByNewest = (nodes) =>
    [...nodes]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((node) => ({
        ...node,
        children: sortTreeByNewest(node.children || []),
      }));

  return sortTreeByNewest(rootComments);
};

const deleteCommentBranch = async (commentId) => {
  const childComments = await Comment.find({ parent: commentId }).select("_id");

  for (const childComment of childComments) {
    await deleteCommentBranch(childComment._id);
  }

  await Comment.findByIdAndDelete(commentId);
};

export const getCommentsByMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    if (!isValidObjectId(materialId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid material id.",
      });
    }

    const comments = await Comment.find({ material: materialId })
      .populate("author", "name role")
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      comments: buildCommentTree(comments),
    });
  } catch (error) {
    console.error("Get comments by material error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments.",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { content, parentId } = req.body;

    if (!isValidObjectId(materialId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid material id.",
      });
    }

    const contentError = validateContent(content);

    if (contentError) {
      return res.status(400).json({
        success: false,
        message: contentError,
      });
    }

    const material = await Material.findById(materialId).select(
      "_id uploadedBy title",
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found.",
      });
    }

    let parentComment = null;

    if (parentId) {
      if (!isValidObjectId(parentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent comment id.",
        });
      }

      parentComment = await Comment.findOne({
        _id: parentId,
        material: materialId,
      }).select("_id author content");

      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found.",
        });
      }
    }

    const comment = await Comment.create({
      material: materialId,
      author: req.user?._id || req.user?.id || req.userId,
      parent: parentComment?._id || null,
      content: content.trim(),
    });

    await comment.populate("author", "name role");

    try {
      await createCommentNotifications({
        actorId: req.user?._id || req.user?.id || req.userId,
        material,
        parentComment,
        commentId: comment._id,
      });
    } catch (notificationError) {
      console.error("Create comment notification error:", notificationError);
    }

    return res.status(201).json({
      success: true,
      message: "Comment posted successfully.",
      comment: buildCommentNode(comment),
    });
  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create comment.",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const currentUserId = req.user?._id?.toString?.() || req.userId?.toString?.();

    if (!isValidObjectId(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment id.",
      });
    }

    const comment = await Comment.findById(commentId).select("author");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (comment.author.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments.",
      });
    }

    await deleteCommentBranch(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment.",
    });
  }
};
