import express from "express";
import {
  getCommentsByMaterial,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/:materialId", getCommentsByMaterial);
router.post("/:materialId", userAuth, createComment);
router.delete("/delete/:commentId", userAuth, deleteComment);

export default router;
