import { useNotificationContext } from "../contexts/NotificationContext";
import type { AppNotification } from "../contexts/NotificationContext";
import { useState, useEffect } from "react";
import "./NotificationItem.css";

interface NotificationItemProps {
  notification: AppNotification;
  isToast?: boolean;
}

export default function NotificationItem({
  notification,
  isToast = false,
}: NotificationItemProps) {
  const { markAsRead, removeNotification } = useNotificationContext();
  const [now, setNow] = useState(() => Date.now());
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // Update "now" every minute to refresh relative timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Timer logic for auto-dismiss
  useEffect(() => {
    if (notification.autoDismiss && notification.duration && notification.duration > 0) {
      const endTime = notification.timestamp + notification.duration;
      const updateRemainingTime = () => {
        const currentTime = Date.now();
        const remaining = Math.max(0, endTime - currentTime);
        setRemainingTime(remaining);
        if (remaining <= 0) {
          // Auto-remove will be handled by the context
        }
      };

      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 100); // Update every 100ms for smooth progress

      return () => clearInterval(interval);
    } else {
      setRemainingTime(null);
    }
  }, [notification.timestamp, notification.duration, notification.autoDismiss]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case "warning":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case "error":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default: // info
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const progressPercentage = remainingTime !== null && notification.duration
    ? (remainingTime / notification.duration) * 100
    : 100;

  return (
    <div
      className={`notification-item ${notification.type} ${notification.read ? "read" : "unread"} ${isToast ? "toast" : ""}`}
      onClick={handleClick}
    >
      <div className={`notification-item-icon ${notification.type}`}>
        {getNotificationIcon(notification.type)}
      </div>

      <div className="notification-item-content">
        <div className="notification-item-header">
          <span className="notification-item-title">{notification.title}</span>
          {!isToast && (
            <span className="notification-item-time">
              {formatTimestamp(notification.timestamp)}
            </span>
          )}
        </div>
        <p className="notification-item-body">{notification.body}</p>

        {/* Timer progress bar for auto-dismiss notifications */}
        {remainingTime !== null && notification.autoDismiss && (
          <div className="notification-timer-bar">
            <div
              className="notification-timer-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>

      <button
        className="notification-remove-button"
        onClick={(e) => {
          e.stopPropagation();
          removeNotification(notification.id);
        }}
        title="Remove"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
