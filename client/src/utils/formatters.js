/**
 * Shared formatting utilities used across multiple pages and components.
 * Centralizes date and role formatting to avoid duplication.
 */

/**
 * Format a date string into a short, human-readable format.
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format a user role string with capitalized first letter.
 * Falls back to a provided default (or "Student") when empty.
 * @param {string} role
 * @param {string} fallback
 * @returns {string}
 */
export const formatRole = (role = "", fallback = "Student") => {
  if (!role) return fallback;
  return role.charAt(0).toUpperCase() + role.slice(1);
};
