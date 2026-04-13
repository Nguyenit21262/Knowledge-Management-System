import express from "express";
import {
  getProfileSummary,
  getUsers,
  toggleBookmark,
} from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import { isAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", userAuth, isAdmin, getUsers);
router.get("/profile", userAuth, getProfileSummary);
router.post("/bookmarks/:materialId", userAuth, toggleBookmark);

export default router;
