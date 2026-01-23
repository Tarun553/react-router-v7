import { useNotificationContext } from "../contexts/NotificationContext";
import "./SendNotificationButton.css";

export default function SendNotificationButton() {
  const { sendNotification } = useNotificationContext();

  const handleSendNotification = () => {
    // Mock notification examples
    const notifications = [
      {
        title: "Upload Complete",
        body: "Your file 'presentation.pdf' has been uploaded successfully.",
        type: "success" as const,
      },
      {
        title: "New Message",
        body: "You have a new message from John Doe.",
        type: "info" as const,
      },
      {
        title: "Storage Warning",
        body: "You're running low on storage space. Only 10% remaining.",
        type: "warning" as const,
      },
      {
        title: "Upload Failed",
        body: "Failed to upload 'document.docx'. Please try again.",
        type: "error" as const,
      },
      {
        title: "Task Reminder",
        body: "Don't forget to submit your report by 5 PM today.",
        type: "info" as const,
      },
    ];

    // Send a random notification
    const randomNotif =
      notifications[Math.floor(Math.random() * notifications.length)];
    sendNotification(randomNotif.title, randomNotif.body, randomNotif.type);
  };

  return (
    <button
      className="send-notification-button"
      onClick={handleSendNotification}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span>Send Test Notification</span>
    </button>
  );
}
