import Material from "../models/Material.js";
import Comment from "../models/Comment.js";
import { formatMaterial } from "../utils/materialFormatter.js";
import { detectFileType, deleteUploadedFile } from "../utils/fileHelpers.js";
import path from "path";
import { extractPdfText } from "../utils/pdfHelpers.js";

const buildMaterialFilter = ({ search, subject, type, category }) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { contentText: { $regex: search, $options: "i" } },
    ];
  }

  if (subject) filter.subject = subject;
  if (type) filter.type = type;
  if (category) filter.category = category;

  return filter;
};

export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find(buildMaterialFilter(req.query))
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    return res.json(materials.map((material) => formatMaterial(material)));
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách tài liệu",
      error: err.message,
    });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate(
      "uploadedBy",
      "name role",
    );

    if (!material) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu",
      });
    }

    const comments = await Comment.find({ material: req.params.id })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    return res.json(formatMaterial(material, comments));
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi lấy chi tiết tài liệu",
      error: err.message,
    });
  }
};

export const createMaterial = async (req, res) => {
  try {
    console.log("=== CREATE MATERIAL HIT ===");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const body = req.body || {};
    const title = body.title?.trim?.() || "";
    const description = body.description?.trim?.() || "";
    const subject = body.subject?.trim?.() || "";
    const category = body.category?.trim?.() || "";

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

    const detectedType = detectFileType(req.file.originalname);
    let contentText = "";

    if (detectedType === "PDF") {
      const filePath = path.join(
        process.cwd(),
        "Server",
        "uploads",
        req.file.filename,
      );

      contentText = await extractPdfText(filePath);

      console.log("Extracted PDF content length:", contentText.length);
      if (!contentText) {
        console.log("PDF uploaded but no extractable text found.");
      }
    }

    const material = await Material.create({
      title,
      description,
      subject,
      category,
      type: detectedType,
      fileUrl: `/uploads/${req.file.filename}`,
      contentText,
      uploadedBy: req.user?._id || req.user?.id,
    });

    await material.populate("uploadedBy", "name role");

    return res.status(201).json({
      message: "Upload tài liệu thành công",
      material: formatMaterial(material),
    });
  } catch (err) {
    console.error("CREATE MATERIAL ERROR:", err);
    return res.status(500).json({
      message: "Lỗi server khi thêm tài liệu",
      error: err.message,
    });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { title, description, subject, category } = req.body || {};
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu",
      });
    }

    if (title) material.title = title;
    if (description !== undefined) material.description = description;
    if (subject) material.subject = subject;
    if (category) material.category = category;

    await material.save();
    await material.populate("uploadedBy", "name role");

    return res.json({
      message: "Cập nhật tài liệu thành công",
      material: formatMaterial(material),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi cập nhật tài liệu",
      error: err.message,
    });
  }
};

export const incrementDownload = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true },
    );

    if (!material) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu",
      });
    }

    return res.json({
      message: "Cập nhật lượt tải thành công",
      downloads: material.downloads,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi cập nhật download",
      error: err.message,
    });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu",
      });
    }

    deleteUploadedFile(material.fileUrl);
    await Comment.deleteMany({ material: req.params.id });
    await Material.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Đã xóa tài liệu và toàn bộ comment liên quan",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi xóa tài liệu",
      error: err.message,
    });
  }
};
