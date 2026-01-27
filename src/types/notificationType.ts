export interface AppNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  timestamp: number;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  duration?: number; // Duration in milliseconds for auto-dismiss
  autoDismiss?: boolean; // Whether to auto-dismiss
}

export interface NotificationContextType {
  notifications: AppNotification[];
  permissionStatus: NotificationPermission;
  requestPermission: () => Promise<void>;
  sendNotification: (
    title: string,
    body: string,
    type?: "info" | "success" | "warning" | "error",
    duration?: number,
    autoDismiss?: boolean,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}
