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
