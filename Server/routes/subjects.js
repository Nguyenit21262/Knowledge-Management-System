const express = require("express");
const {
  getSubjects,
  createSubject,
} = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getSubjects);
router.post("/", protect, isTeacher, createSubject);

module.exports = router;
