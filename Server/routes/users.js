import express from "express";
import { getUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, isTeacher, getUsers);

export default router;
