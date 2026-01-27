import { useNotificationContext } from "../hooks/useNotification";
import "./NotificationToaster.css";
import NotificationItem from "./NotificationItem";

export default function NotificationToaster() {
  const { notifications } = useNotificationContext();

  // Don't render if no notifications
  if (notifications.length === 0) return null;

  return (
    <div className="notification-toaster">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isToast={true}
        />
      ))}
    </div>
  );
}