import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./config/cors.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { registerRoutes } from "./routes/index.js";
import { uploadDir } from "./utils/fileHelpers.js";

export const createApp = () => {
  const app = express();

  app.use(corsMiddleware);
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/uploads", express.static(uploadDir));

  registerRoutes(app);

  app.get("/", (req, res) => {
    res.send("Server is running...");
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
