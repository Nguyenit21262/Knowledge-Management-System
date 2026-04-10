import express from "express";
import {
  getCommentsByMaterial,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:materialId", getCommentsByMaterial);
router.post("/:materialId", protect, createComment);
router.delete("/delete/:commentId", protect, deleteComment);

export default router;
