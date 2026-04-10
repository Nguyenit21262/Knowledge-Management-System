const express = require("express");
const upload = require("../config/upload");
const {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  incrementDownload,
  deleteMaterial,
} = require("../controllers/materialController");
const { protect } = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getMaterials);
router.get("/:id", getMaterialById);
router.post("/", protect, isTeacher, upload.single("file"), createMaterial);
router.put("/:id", protect, isTeacher, updateMaterial);
router.patch("/:id/download", incrementDownload);
router.delete("/:id", protect, isTeacher, deleteMaterial);

module.exports = router;
