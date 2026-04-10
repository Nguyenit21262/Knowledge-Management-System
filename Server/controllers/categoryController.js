const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi lấy danh mục",
      error: err.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Tên category không được rỗng" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category đã tồn tại" });
    }

    const category = await Category.create({ name: name.trim() });

    return res.status(201).json({
      message: "Tạo category thành công",
      category,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi tạo category",
      error: err.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
};
