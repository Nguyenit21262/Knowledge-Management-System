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
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/", getMaterials);
router.get("/:id", getMaterialById);
router.post("/", userAuth, upload.single("file"), createMaterial);
router.put("/:id", userAuth, updateMaterial);
router.patch("/:id/download", incrementDownload);
router.delete("/:id", userAuth, deleteMaterial);

export default router;
