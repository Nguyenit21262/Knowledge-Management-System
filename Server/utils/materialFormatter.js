import { normalizeUserRole } from "../models/User.js";

const formatComment = (comment) => ({
  id: comment._id,
  content: comment.content,
  author: comment.author?.name || "Unknown",
  authorRole: normalizeUserRole(comment.author?.role),
  createdAt: comment.createdAt,
});

export const formatMaterial = (material, comments = []) => ({
  id: material._id,
  type: material.type,
  subject: material.subject,
  title: material.title,
  description: material.description,
  category: material.category,
  contentText: material.contentText || "",
  author: material.uploadedBy?.name || "Unknown",
  authorRole: normalizeUserRole(material.uploadedBy?.role),
  date: material.createdAt,
  views: material.views || 0,
  downloads: material.downloads || 0,
  commentsCount: material.commentsCount || 0,
  fileUrl: material.fileUrl,
  comments: comments.map(formatComment),
});
