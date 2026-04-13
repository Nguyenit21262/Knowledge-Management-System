import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Material from "../models/Material.js";

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

export const getProfileSummary = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const [uploadedMaterials, commentsPosted, downloadStats] = await Promise.all([
      Material.countDocuments({ uploadedBy: currentUserId }),
      Comment.countDocuments({ author: currentUserId }),
      Material.aggregate([
        { $match: { uploadedBy: user._id } },
        {
          $group: {
            _id: null,
            totalDownloads: { $sum: "$downloads" },
          },
        },
      ]),
    ]);

    return res.json({
      user: user.toSafeObject(),
      stats: {
        materialsUploaded: uploadedMaterials,
        totalDownloads: downloadStats[0]?.totalDownloads || 0,
        commentsPosted,
        bookmarked: user.bookmarks?.length || 0,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching profile summary.",
      error: err.message,
    });
  }
};
