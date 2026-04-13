import express from "express";
import {
  getProfileSummary,
  getUsers,
  toggleBookmark,
  updateStudentStatus,
} from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import { isAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", userAuth, isAdmin, getUsers);
router.get("/profile", userAuth, getProfileSummary);
router.patch("/:userId/active", userAuth, isAdmin, updateStudentStatus);
router.post("/bookmarks/:materialId", userAuth, toggleBookmark);

export default router;
