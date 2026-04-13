import { getErrorMessage, httpClient } from "./httpClient.js";

export const uploadMaterial = async (formData) => {
  try {
    const response = await httpClient.post("/api/materials", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to upload document."));
  }
};

export const getUserMaterials = async (userId) => {
  try {
    const response = await httpClient.get(`/api/materials?uploadedBy=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch your uploads."));
  }
};

export const deleteMaterial = async (id) => {
  try {
    const response = await httpClient.delete(`/api/materials/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to delete document."));
  }
};

export const getAllMaterials = async () => {
  try {
    const response = await httpClient.get("/api/materials");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch documents."));
  }
};

export const getMaterialSuggestions = async (query) => {
  try {
    const response = await httpClient.get("/api/materials/search/suggestions", {
      params: { q: query },
    });
    return response.data?.suggestions || [];
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch suggestions."));
  }
};

export const searchMaterials = async (query, { letter, sortBy, sortOrder, subject } = {}) => {
  try {
    const params = {};
    if (query) params.q = query;
    if (letter) params.letter = letter;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (subject) params.subject = subject;

    const response = await httpClient.get("/api/materials/search", { params });
    return response.data?.materials || [];
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to search documents."));
  }
};

export const getLetterCounts = async () => {
  try {
    const response = await httpClient.get("/api/materials/search/letter-counts");
    return response.data?.counts || {};
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch letter counts."));
  }
};

export const getMaterialById = async (id) => {
  try {
    const response = await httpClient.get(`/api/materials/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch document details."));
  }
};

export const incrementDownload = async (id) => {
  try {
    const response = await httpClient.patch(`/api/materials/${id}/download`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to register download."));
  }
};
