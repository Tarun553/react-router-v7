import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  timestamp: number;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationContextType {
  notifications: AppNotification[];
  permissionStatus: NotificationPermission;
  requestPermission: () => Promise<void>;
  sendNotification: (
    title: string,
    body: string,
    type?: "info" | "success" | "warning" | "error",
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

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

  // Helper function to get icon based on notification type
  const getIconForType = (
    type: "info" | "success" | "warning" | "error",
  ): string => {
    const icons = {
      info: "https://cdn-icons-png.flaticon.com/512/471/471662.png",
      success: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
      warning: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
      error: "https://cdn-icons-png.flaticon.com/512/753/753345.png",
    };
    return icons[type];
  };

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
      };

      setNotifications((prev) => [newNotification, ...prev]);

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
    [permissionStatus, markAsRead, getIconForType],
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

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }
  return context;
}
