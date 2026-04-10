import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.js";
import materialRoutes from "./routes/materials.js";
import commentRoutes from "./routes/comments.js";
import categoryRoutes from "./routes/categories.js";
import subjectRoutes from "./routes/subjects.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "Server", "uploads")),
);

app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
