import authRoutes from "./auth.js";
import materialRoutes from "./materials.js";
import commentRoutes from "./comments.js";
import categoryRoutes from "./categories.js";
import notificationRoutes from "./notifications.js";
import subjectRoutes from "./subjects.js";
import userRoutes from "./users.js";

export const registerRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/materials", materialRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/users", userRoutes);
};
