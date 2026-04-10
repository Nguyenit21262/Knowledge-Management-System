const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, isTeacher, getUsers);

module.exports = router;
