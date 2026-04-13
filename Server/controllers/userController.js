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

export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { materialId } = req.params;
    
    // Check if it exists
    const index = user.bookmarks.indexOf(materialId);
    if (index === -1) {
      user.bookmarks.push(materialId);
    } else {
      user.bookmarks.splice(index, 1);
    }
    
    await user.save();
    
    return res.json({
      message: index === -1 ? "Material bookmarked." : "Bookmark removed.",
      bookmarks: user.bookmarks,
      user: user.toSafeObject()
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while toggling bookmark.",
      error: err.message,
    });
  }
};
