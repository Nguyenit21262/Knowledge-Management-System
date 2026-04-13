import Notification from "../models/Notification.js";
import { normalizeUserRole } from "../models/User.js";

const formatNotification = (notification) => ({
  id: notification._id.toString(),
  type: notification.type,
  isRead: Boolean(notification.isRead),
  createdAt: notification.createdAt,
  actor: {
    id: notification.actor?._id?.toString?.() || "",
    name: notification.actor?.name || "Unknown",
    role: normalizeUserRole(notification.actor?.role),
  },
  material: notification.material
    ? {
        id: notification.material?._id?.toString?.() || "",
        title: notification.material?.title || "Untitled material",
      }
    : null,
  comment: notification.comment
    ? {
        id: notification.comment?._id?.toString?.() || "",
        content: notification.comment?.content || "",
      }
    : null,
});

export const getMyNotifications = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.userId;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: currentUserId })
        .populate("actor", "name role")
        .populate("material", "title")
        .populate("comment", "content")
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Notification.countDocuments({
        recipient: currentUserId,
        isRead: false,
      }),
    ]);

    return res.status(200).json({
      success: true,
      notifications: notifications.map(formatNotification),
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.userId;

    await Notification.updateMany(
      {
        recipient: currentUserId,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Notifications marked as read.",
    });
  } catch (error) {
    console.error("Mark notifications as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notifications.",
    });
  }
};
