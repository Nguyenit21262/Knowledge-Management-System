import { httpClient, getErrorMessage } from "./httpClient.js";

export const getProfileSummary = async () => {
  try {
    const response = await httpClient.get("/api/users/profile");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load profile."));
  }
};

export const getUsers = async (options = {}) => {
  try {
    const response = await httpClient.get("/api/users", {
      params: options,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load users."));
  }
};

export const updateStudentStatus = async (userId, isActive) => {
  try {
    const response = await httpClient.patch(`/api/users/${userId}/active`, {
      isActive,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update student status."));
  }
};

export const toggleBookmark = async (materialId) => {
  try {
    const response = await httpClient.post(`/api/users/bookmarks/${materialId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to toggle bookmark."));
  }
};
