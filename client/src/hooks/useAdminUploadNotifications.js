import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllMaterials } from "../api/materials.js";
import { useAppContext } from "../context/useAppContext.js";

const POLL_INTERVAL_MS = 20000;

const buildStorageKey = (userId) =>
  `kms-admin-upload-notifications-last-seen-${userId || "teacher"}`;

const sortByNewest = (items) =>
  [...items].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

const mapMaterialToNotification = (material) => ({
  id: material.id,
  title: material.title,
  author: material.author,
  authorRole: material.authorRole,
  subject: material.subject,
  category: material.category,
  createdAt: material.date,
});

const useAdminUploadNotifications = () => {
  const { user } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [lastSeenAt, setLastSeenAt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const storageKey = useMemo(
    () => buildStorageKey(user?.id || user?._id),
    [user?.id, user?._id],
  );

  const markAllAsRead = useCallback(
    (items = notifications) => {
      const latestCreatedAt = items[0]?.createdAt;

      if (!latestCreatedAt) {
        return;
      }

      setLastSeenAt(latestCreatedAt);
      localStorage.setItem(storageKey, latestCreatedAt);
    },
    [notifications, storageKey],
  );

  const loadNotifications = useCallback(
    async ({ initialize = false } = {}) => {
      try {
        setError("");

        const materials = await getAllMaterials();
        const nextNotifications = sortByNewest(
          materials
            .filter((material) => material.authorRole === "student")
            .map(mapMaterialToNotification),
        );

        setNotifications(nextNotifications);

        if (initialize && !localStorage.getItem(storageKey) && nextNotifications[0]) {
          const initialSeenAt = nextNotifications[0].createdAt;
          setLastSeenAt(initialSeenAt);
          localStorage.setItem(storageKey, initialSeenAt);
        }
      } catch (loadError) {
        setError(loadError.message || "Unable to load notifications.");
      } finally {
        if (initialize) {
          setIsLoading(false);
        }
      }
    },
    [storageKey],
  );

  useEffect(() => {
    const storedLastSeenAt = localStorage.getItem(storageKey);
    setLastSeenAt(storedLastSeenAt || null);
    setIsLoading(true);

    loadNotifications({ initialize: true });

    const intervalId = window.setInterval(() => {
      loadNotifications();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadNotifications, storageKey]);

  const unreadCount = useMemo(() => {
    if (!lastSeenAt) {
      return 0;
    }

    return notifications.filter(
      (notification) => new Date(notification.createdAt) > new Date(lastSeenAt),
    ).length;
  }, [notifications, lastSeenAt]);

  return {
    notifications: notifications.slice(0, 8),
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
  };
};

export default useAdminUploadNotifications;
