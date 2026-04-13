import { normalizeUserRole } from "../models/User.js";

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (normalizeUserRole(req.user.role) !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Teacher access required",
    });
  }
  next();
};
