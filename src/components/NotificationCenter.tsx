import { useState } from "react";
import "./NotificationCenter.css";
import NotificationItem from "./NotificationItem";
import { useNotificationContext } from "../hooks/useNotification";


export default function NotificationCenter() {
  const {
    notifications,
    markAllAsRead,
    clearAll,
    permissionStatus,
    requestPermission,
  } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAll();
    setIsOpen(false);
  };

  return (
    <div className="notification-center">
      {/* Bell Icon Button */}
      <button
        className="notification-bell-button"
        onClick={handleToggle}
        title="Notifications"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div
            className="notification-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="notification-panel">
            {/* Header */}
            <div className="notification-panel-header">
              <h3>Notifications</h3>
              <div className="notification-panel-actions">
                {unreadCount > 0 && (
                  <button
                    className="text-button"
                    onClick={handleMarkAllAsRead}
                    title="Mark all as read"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    className="text-button"
                    onClick={handleClearAll}
                    title="Clear all"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Permission Request */}
            {permissionStatus !== "granted" && (
              <div className="notification-permission-banner">
                <div className="permission-banner-content">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <div>
                    <p className="permission-title">Enable notifications</p>
                    <p className="permission-description">
                      Get notified about important updates
                    </p>
                  </div>
                </div>
                <button
                  className="permission-enable-button"
                  onClick={requestPermission}
                >
                  Enable
                </button>
              </div>
            )}

            {/* Notification List */}
            <div className="notification-panel-body">
              {notifications.length === 0 ? (
                <div className="notification-empty-state">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
