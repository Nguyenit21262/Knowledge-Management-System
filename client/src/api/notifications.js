import { getErrorMessage, httpClient } from "./httpClient.js";

export const getNotifications = async () => {
  try {
    const response = await httpClient.get("/api/notifications");

    return {
      notifications: response.data?.notifications || [],
      unreadCount: response.data?.unreadCount || 0,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to fetch notifications."));
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await httpClient.patch("/api/notifications/read-all");
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update notifications."),
    );
  }
};
