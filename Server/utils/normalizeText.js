export const normalizeWhitespace = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/\s+/g, " ");
};

export const normalizeEmail = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().toLowerCase();
};
