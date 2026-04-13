import express from "express";
import {
  getSubjects,
  createSubject,
} from "../controllers/subjectController.js";
import userAuth from "../middleware/userAuth.js";
import { isAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getSubjects);
router.post("/", userAuth, isAdmin, createSubject);

export default router;
