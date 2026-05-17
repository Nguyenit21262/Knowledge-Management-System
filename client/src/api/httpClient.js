import axios from "axios";

const FALLBACK_BACKEND_URL = "http://localhost:5000";
const isLocalhostUrl = (value = "") => /\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(String(value).trim());

const getDefaultBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_BACKEND_URL;

  if (configuredBaseUrl && (import.meta.env.DEV || !isLocalhostUrl(configuredBaseUrl))) {
    return configuredBaseUrl;
  }

  if (!import.meta.env.DEV && typeof window !== "undefined") {
    return window.location.origin;
  }

  if (configuredBaseUrl) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  if (import.meta.env.DEV) {
    return FALLBACK_BACKEND_URL;
  }

  return FALLBACK_BACKEND_URL;
};

const normalizeBaseUrl = (baseUrl) =>
  String(baseUrl || FALLBACK_BACKEND_URL)
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\/+$/, "");

const removeApiSuffix = (baseUrl) => baseUrl.replace(/\/api$/, "");

export const API_BASE_URL = removeApiSuffix(
  normalizeBaseUrl(getDefaultBaseUrl()),
);

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getErrorMessage = (
  error,
  fallback = "Something went wrong.",
) => {
  if (error?.code === "ERR_NETWORK") {
    return `Unable to connect to the server at ${API_BASE_URL}. Make sure the backend is running.`;
  }

  return error?.response?.data?.message || error?.message || fallback;
};
