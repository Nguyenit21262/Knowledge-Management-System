import express from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/categoryController.js";
import userAuth from "../middleware/userAuth.js";
import { isAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", userAuth, isAdmin, createCategory);

export default router;
