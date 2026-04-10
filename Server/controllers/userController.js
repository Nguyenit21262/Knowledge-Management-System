const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách user",
      error: err.message,
    });
  }
};

module.exports = {
  getUsers,
};
