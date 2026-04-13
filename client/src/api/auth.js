import { getErrorMessage, httpClient } from "./httpClient.js";

export const register = async (payload) => {
  try {
    const response = await httpClient.post("/api/auth/register", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to create account."));
  }
};

export const login = async (payload) => {
  try {
    const response = await httpClient.post("/api/auth/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to sign in."));
  }
};

export const getMe = async () => {
  try {
    const response = await httpClient.get("/api/auth/me");

    return response.data?.user || response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to load the current user profile."),
    );
  }
};

export const logout = async () => {
  try {
    const response = await httpClient.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to log out."));
  }
};
