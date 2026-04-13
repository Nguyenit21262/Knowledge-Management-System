import express from "express";
import { getUsers } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import { isAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", userAuth, isAdmin, getUsers);

export default router;
