const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const detectFileType = (filename = "") => {
  const ext = path.extname(filename).toLowerCase();

  if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(ext)) {
    return "VIDEO";
  }

  return "PDF";
};

const deleteUploadedFile = (fileUrl) => {
  if (!fileUrl) return;

  const filename = path.basename(fileUrl);
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  uploadDir,
  ensureUploadDir,
  detectFileType,
  deleteUploadedFile,
};
