import { normalizeWhitespace } from "./normalizeText.js";

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildContainsInsensitiveRegex = (value) => {
  const normalized = normalizeWhitespace(
    typeof value === "string" ? value : "",
  );

  return new RegExp(escapeRegExp(normalized), "i");
};

export const buildExactInsensitiveRegex = (value) => {
  const normalized = normalizeWhitespace(
    typeof value === "string" ? value : "",
  );

  return new RegExp(`^${escapeRegExp(normalized)}$`, "i");
};
