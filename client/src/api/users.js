import { httpClient, getErrorMessage } from "./httpClient.js";

export const toggleBookmark = async (materialId) => {
  try {
    const response = await httpClient.post(`/api/users/bookmarks/${materialId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to toggle bookmark."));
  }
};
