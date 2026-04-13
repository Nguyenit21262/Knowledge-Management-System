import express from "express";
import { register, login, getMe, logout } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", userAuth, getMe);

export default router;
