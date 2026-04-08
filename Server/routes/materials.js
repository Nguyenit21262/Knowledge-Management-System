const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Material = require("../models/Material");
const { protect } = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// Danh sách extension được hỗ trợ
const allowedExtensions = [
  ".pdf",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
];

// Lọc file upload
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Loại file không được hỗ trợ"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Detect file type
const detectFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if ([".pdf"].includes(ext)) return "pdf";
  if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) return "video";
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) return "image";
  if ([".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"].includes(ext))
    return "document";
  return "other";
};

// Chuẩn hóa tags
const normalizeTags = (tags) => {
  if (!tags) return [];

  // nếu frontend gửi string kiểu "math, grade10, exam"
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  // nếu frontend gửi mảng
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean);
  }

  return [];
};

// GET /api/materials
router.get("/", async (req, res) => {
  try {
    const {
      search,
      subject,
      category,
      fileType,
      tag,
      sort = "newest",
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (subject) filter.subject = subject;
    if (category) filter.category = category;
    if (fileType) filter.fileType = fileType;
    if (tag) filter.tags = tag.toLowerCase();

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "downloads") sortOption = { downloadCount: -1 };

    const materials = await Material.find(filter)
      .populate("uploadedBy", "name role")
      .populate("subject", "name")
      .populate("category", "name")
      .sort(sortOption);

    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// GET /api/materials/:id
router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("uploadedBy", "name role")
      .populate("subject", "name")
      .populate("category", "name");

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// POST /api/materials
router.post(
  "/",
  protect,
  isTeacher,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description, subject, category, tags } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ message: "Title không được để trống" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Vui lòng chọn file để upload" });
      }

      const fileType = detectFileType(req.file.originalname);
      const fileUrl = `/uploads/${req.file.filename}`;

      const material = new Material({
        title: title.trim(),
        description: description?.trim() || "",
        fileUrl,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        fileType,
        subject: subject || null,
        category: category || null,
        uploadedBy: req.user.id,
        tags: normalizeTags(tags),
      });

      await material.save();

      const populatedMaterial = await Material.findById(material._id)
        .populate("uploadedBy", "name role")
        .populate("subject", "name")
        .populate("category", "name");

      res.status(201).json(populatedMaterial);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },
);

// PUT /api/materials/:id
router.put("/:id", protect, isTeacher, async (req, res) => {
  try {
    const { title, description, subject, category, tags } = req.body;

    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Title không được để trống" });
      }
      material.title = title.trim();
    }

    if (description !== undefined) {
      material.description = description.trim();
    }

    if (subject !== undefined) {
      material.subject = subject || null;
    }

    if (category !== undefined) {
      material.category = category || null;
    }

    if (tags !== undefined) {
      material.tags = normalizeTags(tags);
    }

    await material.save();

    const updatedMaterial = await Material.findById(material._id)
      .populate("uploadedBy", "name role")
      .populate("subject", "name")
      .populate("category", "name");

    res.json({
      message: "Cập nhật tài liệu thành công",
      material: updatedMaterial,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// PATCH /api/materials/:id/download
router.patch("/:id/download", async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true },
    );

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    res.json({ downloadCount: material.downloadCount });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// DELETE /api/materials/:id
router.delete("/:id", protect, isTeacher, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    // Xóa file vật lý
    if (material.fileUrl) {
      const filePath = path.join(
        __dirname,
        "..",
        material.fileUrl.replace(/^\//, ""),
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Material.findByIdAndDelete(req.params.id);

    res.json({ message: "Đã xóa tài liệu" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
