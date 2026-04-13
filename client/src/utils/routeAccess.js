export const normalizeRole = (role) =>
  role === "teacher" || role === "admin" ? "teacher" : "student";

export const getDefaultRouteByRole = (role) =>
  normalizeRole(role) === "teacher" ? "/admin" : "/";

export const hasAllowedRole = (role, allowedRoles = []) => {
  if (!allowedRoles.length) {
    return true;
  }

  return allowedRoles.map(normalizeRole).includes(normalizeRole(role));
};
