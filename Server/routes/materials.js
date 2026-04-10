import express from "express";
import upload from "../config/upload.js";
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  incrementDownload,
  deleteMaterial,
} from "../controllers/materialController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getMaterials);
router.get("/:id", getMaterialById);
router.post("/", protect, isTeacher, upload.single("file"), createMaterial);
router.put("/:id", protect, isTeacher, updateMaterial);
router.patch("/:id/download", incrementDownload);
router.delete("/:id", protect, isTeacher, deleteMaterial);

export default router;
