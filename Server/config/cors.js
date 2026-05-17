import cors from "cors";
import { env } from "./env.js";

const NGROK_HOST_SUFFIXES = [
  ".ngrok-free.app",
  ".ngrok.app",
  ".ngrok-free.dev",
  ".ngrok.dev",
];

const isAllowedNgrokOrigin = (origin) => {
  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && NGROK_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
  } catch {
    return false;
  }
};

export const corsMiddleware = cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || env.allowedOrigins.includes(origin) || isAllowedNgrokOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
});
