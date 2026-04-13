import multer from "multer";
import path from "path";
import { ensureUploadDir, uploadDir } from "../utils/fileHelpers.js";

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname,
    )}`;
    cb(null, uniqueName);
  },
});

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB — matches the UI specification

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

export default upload;
