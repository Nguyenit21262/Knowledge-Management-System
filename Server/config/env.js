import dotenv from "dotenv";

dotenv.config({ quiet: true });

const normalizeOrigin = (origin = "") =>
  String(origin).trim().replace(/^['"]|['"]$/g, "");

export const env = Object.freeze({
  port: Number(process.env.PORT) || 5000,
  allowedOrigins: (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean),
});
