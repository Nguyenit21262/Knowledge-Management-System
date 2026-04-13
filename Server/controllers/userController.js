import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    return res.json(
      users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    );
  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching users.",
      error: err.message,
    });
  }
};
