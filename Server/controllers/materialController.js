const Material = require("../models/Material");
const Comment = require("../models/Comment");
const { formatMaterial } = require("../utils/materialFormatter");
const { detectFileType, deleteUploadedFile } = require("../utils/fileHelpers");

const buildMaterialFilter = ({ search, subject, type, category }) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  if (subject) filter.subject = subject;
  if (type) filter.type = type;
  if (category) filter.category = category;

  return filter;
};

const getMaterials = async (req, res) => {
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

const getMaterialById = async (req, res) => {
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

    return res.json(formatMaterial(material, comments));
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi lấy chi tiết tài liệu",
      error: err.message,
    });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { title, description, subject, category } = req.body;

    if (!title || !subject || !category) {
      return res
        .status(400)
        .json({ message: "Thiếu title, subject hoặc category" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file để upload" });
    }

    const material = await Material.create({
      title,
      description,
      subject,
      category,
      type: detectFileType(req.file.originalname),
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id,
    });

    await material.populate("uploadedBy", "name role");

    return res.status(201).json({
      message: "Upload tài liệu thành công",
      material: formatMaterial(material),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi thêm tài liệu",
      error: err.message,
    });
  }
};

const updateMaterial = async (req, res) => {
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

const incrementDownload = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true },
    );

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
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

const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Không tìm thấy tài liệu" });
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

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  incrementDownload,
  deleteMaterial,
};
