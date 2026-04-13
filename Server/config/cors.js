import cors from "cors";
import { env } from "./env.js";

export const corsMiddleware = cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
});
