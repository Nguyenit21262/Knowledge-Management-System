import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadDir = path.join(__dirname, "..", "uploads");

export const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

export const detectFileType = (filename = "") => {
  const ext = path.extname(filename).toLowerCase();

  if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(ext)) {
    return "VIDEO";
  }

  return "PDF";
};

export const deleteUploadedFile = (fileUrl) => {
  if (!fileUrl) return;

  const filename = path.basename(fileUrl);
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
