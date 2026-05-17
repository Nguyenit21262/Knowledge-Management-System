import multer from "multer";

const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB - matches the UI specification

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

export default upload;
