import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import useUserNotifications from "../hooks/useUserNotifications.js";

const formatNotificationTime = (dateValue) =>
  new Date(dateValue).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getNotificationMessage = (notification) => {
  if (notification.type === "comment_reply") {
    return `${notification.actor.name} replied to your comment.`;
  }

  return `${notification.actor.name} commented on your upload.`;
};

const UserNotificationsBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { notifications, unreadCount, isLoading, error, markAllAsRead } =
    useUserNotifications();

  const hasNotifications = notifications.length > 0;
  const buttonLabel = useMemo(
    () =>
      unreadCount > 0
        ? `Notifications (${unreadCount} unread)`
        : "Notifications",
    [unreadCount],
  );

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((currentState) => {
      const nextState = !currentState;

      if (nextState && unreadCount > 0) {
        markAllAsRead();
      }

      return nextState;
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--theme-blue)] sm:h-12 sm:w-12"
        aria-label={buttonLabel}
      >
        <Bell className="h-5 w-5" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.72rem] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-[1rem] font-semibold text-slate-950">
              Notifications
            </h3>
            <p className="mt-1 text-[0.9rem] text-slate-500">
              New activity on your uploads and comments.
            </p>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {isLoading ? (
              <div className="px-5 py-6 text-[0.95rem] text-slate-500">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="px-5 py-6 text-[0.95rem] text-red-500">{error}</div>
            ) : !hasNotifications ? (
              <div className="px-5 py-6 text-[0.95rem] text-slate-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={
                    notification.material?.id
                      ? `/documents/${notification.material.id}`
                      : "/"
                  }
                  onClick={() => setIsOpen(false)}
                  className="block border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 last:border-b-0"
                >
                  <p className="text-[0.98rem] font-medium text-slate-950">
                    {getNotificationMessage(notification)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[0.9rem] text-slate-600">
                    {notification.material?.title || "Related material"}
                  </p>
                  {notification.comment?.content && (
                    <p className="mt-1 line-clamp-2 text-[0.86rem] text-slate-400">
                      "{notification.comment.content}"
                    </p>
                  )}
                  <p className="mt-2 text-[0.82rem] text-slate-400">
                    {formatNotificationTime(notification.createdAt)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotificationsBell;
