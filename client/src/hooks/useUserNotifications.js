import { useCallback, useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../api/notifications.js";
import { useAppContext } from "../context/useAppContext.js";

const POLL_INTERVAL_MS = 20000;

const useUserNotifications = () => {
  const { isAuthenticated, user } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(
    async ({ showLoader = false } = {}) => {
      if (!isAuthenticated || !user) {
        setNotifications([]);
        setUnreadCount(0);
        setError("");
        setIsLoading(false);
        return;
      }

      if (showLoader) {
        setIsLoading(true);
      }

      try {
        setError("");

        const data = await getNotifications();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (loadError) {
        setError(loadError.message || "Unable to load notifications.");
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [isAuthenticated, user],
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) {
      return;
    }

    const previousNotifications = notifications;
    const previousUnreadCount = unreadCount;

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (markError) {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      setError(markError.message || "Unable to update notifications.");
    }
  }, [notifications, unreadCount]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      setError("");
      setIsLoading(false);
      return undefined;
    }

    loadNotifications({ showLoader: true });

    const intervalId = window.setInterval(() => {
      loadNotifications();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, loadNotifications, user]);

  return {
    notifications: notifications.slice(0, 10),
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
  };
};

export default useUserNotifications;
