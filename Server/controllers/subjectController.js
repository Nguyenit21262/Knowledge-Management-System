import Subject from "../models/Subject.js";

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    return res.json(subjects);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi lấy môn học",
      error: err.message,
    });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Tên subject không được rỗng",
      });
    }

    const existing = await Subject.findOne({ name: name.trim() });

    if (existing) {
      return res.status(400).json({
        message: "Subject đã tồn tại",
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
    });

    return res.status(201).json({
      message: "Tạo subject thành công",
      subject,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi tạo subject",
      error: err.message,
    });
  }
};
