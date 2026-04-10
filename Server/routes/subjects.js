const express = require("express");
const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, isTeacher, createCategory);

module.exports = router;
