import express from "express";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { corsMiddleware } from "./config/cors.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { registerRoutes } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistDir = path.join(__dirname, "..", "client", "dist");
const clientIndexFile = path.join(clientDistDir, "index.html");
const hasClientBuild = fs.existsSync(clientIndexFile);

export const createApp = () => {
  const app = express();

  app.use(corsMiddleware);
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  registerRoutes(app);

  if (hasClientBuild) {
    app.use(express.static(clientDistDir));

    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(clientIndexFile);
    });
  } else {
    app.get("/", (req, res) => {
      res.send("Server is running...");
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
