import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { comparePassword, hashPassword } from "../utils/password.js";

const SELF_REGISTER_ROLES = new Set(["student", "teacher"]);
const MIN_PASSWORD_LENGTH = 6;

const getInputString = (value) => (typeof value === "string" ? value : "");

const buildCurrentUserResponse = (user) => user.toSafeObject();

const buildAuthResponse = (res, user) => ({
  token: generateToken(res, user._id),
  user: buildCurrentUserResponse(user),
});

export const register = async (req, res) => {
  try {
    const name = getInputString(req.body?.name).trim();
    const email = getInputString(req.body?.email).trim().toLowerCase();
    const password = getInputString(req.body?.password);
    const requestedRole = getInputString(req.body?.role).trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const role = SELF_REGISTER_ROLES.has(requestedRole)
      ? requestedRole
      : "student";
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please log in.",
      user: buildCurrentUserResponse(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    console.error("Register error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while registering user.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = getInputString(req.body?.email).trim().toLowerCase();
    const password = getInputString(req.body?.password);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.json({
      success: true,
      message: "Login successful.",
      ...buildAuthResponse(res, user),
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.json({
      success: true,
      message: "Logout successful.",
    });
  } catch (err) {
    console.error("Logout error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while logging out.",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: buildCurrentUserResponse(req.user),
    });
  } catch (err) {
    console.error("Get current user error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user profile.",
    });
  }
};
