const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Material = require("../models/Material");
const Comment = require("../models/Comment");
const { protect } = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Tự nhận diện loại file
const detectFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();

  if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) return "VIDEO";
  return "PDF";
};

// Format dữ liệu trả về
const formatMaterial = (material, comments = []) => ({
  id: material._id,
  type: material.type,
  subject: material.subject,
  title: material.title,
  description: material.description,
  category: material.category,
  author: material.uploadedBy?.name || "Unknown",
  date: new Date(material.createdAt).toLocaleDateString("en-US"),
  downloads: material.downloads,
  commentsCount: material.commentsCount,
  fileUrl: material.fileUrl,
  comments: comments.map((c) => ({
    id: c._id,
    author: c.author?.name || "Unknown",
    role: c.author?.role || "student",
    date: new Date(c.createdAt).toLocaleDateString("en-US"),
    content: c.content,
  })),
});

// GET /api/materials
// Search theo title, description, subject, category, type
router.get("/", async (req, res) => {
  try {
    const { search, subject, type, category } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (subject) {
      filter.subject = subject;
    }

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    const materials = await Material.find(filter)
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(materials.map((m) => formatMaterial(m)));
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách tài liệu",
      error: err.message,
    });
  }
});

// GET /api/materials/:id
router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate(
      "uploadedBy",
      "name role",
    );

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    const comments = await Comment.find({ material: req.params.id })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    res.json(formatMaterial(material, comments));
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi lấy chi tiết tài liệu",
      error: err.message,
    });
  }
});

// POST /api/materials
// Teacher upload tài liệu
router.post(
  "/",
  protect,
  isTeacher,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description, subject, category } = req.body;

      if (!title || !subject || !category) {
        return res.status(400).json({
          message: "Thiếu title, subject hoặc category",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Vui lòng chọn file để upload",
        });
      }

      const fileType = detectFileType(req.file.originalname);
      const fileUrl = `/uploads/${req.file.filename}`;

      const material = new Material({
        title,
        description,
        subject,
        category,
        type: fileType,
        fileUrl,
        uploadedBy: req.user.id,
      });

      await material.save();
      await material.populate("uploadedBy", "name role");

      res.status(201).json({
        message: "Upload tài liệu thành công",
        material: formatMaterial(material),
      });
    } catch (err) {
      res.status(500).json({
        message: "Lỗi server khi thêm tài liệu",
        error: err.message,
      });
    }
  },
);

// PUT /api/materials/:id
// Sửa tài liệu
router.put("/:id", protect, isTeacher, async (req, res) => {
  try {
    const { title, description, subject, category } = req.body;

    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    material.title = title || material.title;
    material.description = description ?? material.description;
    material.subject = subject || material.subject;
    material.category = category || material.category;

    await material.save();
    await material.populate("uploadedBy", "name role");

    res.json({
      message: "Cập nhật tài liệu thành công",
      material: formatMaterial(material),
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi cập nhật tài liệu",
      error: err.message,
    });
  }
});

// PATCH /api/materials/:id/download
// Tăng số lượt tải
router.patch("/:id/download", async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true },
    );

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    res.json({
      message: "Cập nhật lượt tải thành công",
      downloads: material.downloads,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi cập nhật download",
      error: err.message,
    });
  }
});

// DELETE /api/materials/:id
// Xóa material + xóa comment liên quan
router.delete("/:id", protect, isTeacher, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
    }

    // Xóa file vật lý nếu có
    const filename = material.fileUrl?.split("/uploads/")[1];
    if (filename) {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Xóa comments liên quan
    await Comment.deleteMany({ material: req.params.id });

    // Xóa material
    await Material.findByIdAndDelete(req.params.id);

    res.json({ message: "Đã xóa tài liệu và toàn bộ comment liên quan" });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi xóa tài liệu",
      error: err.message,
    });
  }
});

module.exports = router;
