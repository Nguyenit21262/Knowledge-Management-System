import express from "express";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/", userAuth, getMyNotifications);
router.patch("/read-all", userAuth, markAllNotificationsAsRead);

export default router;
