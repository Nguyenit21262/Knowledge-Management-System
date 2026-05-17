import path from "path";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"];
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".ogg"];

const MIME_TYPE_BY_EXTENSION = {
  ".avi": "video/x-msvideo",
  ".bmp": "image/bmp",
  ".csv": "text/csv",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mkv": "video/x-matroska",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".ogg": "video/ogg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export const detectFileType = (filename = "") => {
  const ext = path.extname(filename).toLowerCase();

  if (VIDEO_EXTENSIONS.includes(ext)) {
    return "VIDEO";
  }

  if (IMAGE_EXTENSIONS.includes(ext)) {
    return "IMAGE";
  }

  return "PDF";
};

export const getMimeType = (filename = "", fallback = "application/octet-stream") => {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPE_BY_EXTENSION[ext] || fallback;
};

export const buildMaterialFileUrl = (materialId, originalFilename = "file") => {
  const safeFilename = encodeURIComponent(String(originalFilename || "file").trim() || "file");
  return `/api/materials/${materialId}/file/${safeFilename}`;
};

export const buildMaterialDownloadName = (title = "", originalFilename = "file") => {
  const extension = path.extname(originalFilename);
  const normalizedTitle = String(title || "")
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, " ");

  if (!normalizedTitle) {
    return originalFilename;
  }

  return `${normalizedTitle}${extension}`;
};
