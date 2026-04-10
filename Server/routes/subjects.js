import express from "express";
import {
  getSubjects,
  createSubject,
} from "../controllers/subjectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isTeacher } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getSubjects);
router.post("/", protect, isTeacher, createSubject);

export default router;
