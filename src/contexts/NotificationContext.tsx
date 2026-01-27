import {
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { getIconForType } from "../utils/NotificationIcon";
import { NotificationContext } from "../hooks/useNotification";
import type { AppNotification } from "../types/notificationType";





export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>("default");

  // Check initial permission status - use lazy initialization instead
  const [initialPermission] = useState(() => {
    if ("Notification" in window) {
      return Notification.permission;
    }
    return "default" as NotificationPermission;
  });

  useEffect(() => {
    setPermissionStatus(initialPermission);
  }, [initialPermission]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications");
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
  }, []);



  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  }, []);

  const sendNotification = useCallback(
    (
      title: string,
      body: string,
      type: "info" | "success" | "warning" | "error" = "info",
      duration: number = 5000, // Default 5 seconds
      autoDismiss: boolean = true,
    ) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();

      // Add to our internal notification list
      const newNotification: AppNotification = {
        id,
        title,
        body,
        timestamp,
        read: false,
        type,
        duration,
        autoDismiss,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Auto-dismiss if enabled
      if (autoDismiss && duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        }, duration);
      }

      // Send browser notification if permission granted
      if (permissionStatus === "granted") {
        const iconUrl = getIconForType(type);
        const notification = new Notification(title, {
          body,
          icon: iconUrl,
          badge: iconUrl,
        });

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          notification.close();
          markAsRead(id);
        };
      }
    },
    [markAsRead, permissionStatus ],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        permissionStatus,
        requestPermission,
        sendNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

