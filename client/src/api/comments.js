import { getErrorMessage, httpClient } from "./httpClient.js";

export const getCommentsByMaterial = async (materialId) => {
  try {
    const response = await httpClient.get(`/api/comments/${materialId}`);
    return response.data.comments || [];
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch comments."));
  }
};

export const createComment = async (materialId, payload) => {
  try {
    const response = await httpClient.post(`/api/comments/${materialId}`, payload);
    return response.data.comment;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to post comment."));
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await httpClient.delete(`/api/comments/delete/${commentId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to delete comment."));
  }
};
