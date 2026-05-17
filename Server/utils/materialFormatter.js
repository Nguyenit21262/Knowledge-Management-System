import { normalizeUserRole } from "../models/User.js";
import { buildMaterialFileUrl } from "./fileHelpers.js";

const formatComment = (comment) => ({
  id: comment._id,
  content: comment.content,
  author: comment.author?.name || "Unknown",
  authorRole: normalizeUserRole(comment.author?.role),
  createdAt: comment.createdAt,
});

export const formatMaterial = (material, comments = []) => {
  const derivedFileUrl =
    material.fileId && material.originalFilename
      ? buildMaterialFileUrl(material._id, material.originalFilename)
      : material.fileUrl;

  return {
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
    fileUrl: derivedFileUrl,
    originalFilename: material.originalFilename || "",
    mimeType: material.mimeType || "",
    fileSize: material.fileSize || 0,
    comments: comments.map(formatComment),
  };
};
