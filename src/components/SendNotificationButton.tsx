import { useNotificationContext } from "../hooks/useNotification";
import "./SendNotificationButton.css";

export default function SendNotificationButton() {
  const { sendNotification } = useNotificationContext();

  const handleSendNotification = () => {
    // Mock notification examples with different durations
    const notifications = [
      {
        title: "Upload Complete",
        body: "Your file 'presentation.pdf' has been uploaded successfully.",
        type: "success" as const,
        duration: 3000, // 3 seconds
      },
      {
        title: "New Message",
        body: "You have a new message from John Doe.",
        type: "info" as const,
        duration: 5000, // 5 seconds
      },
      {
        title: "Storage Warning",
        body: "You're running low on storage space. Only 10% remaining.",
        type: "warning" as const,
        duration: 7000, // 7 seconds
      },
      {
        title: "Upload Failed",
        body: "Failed to upload 'document.docx'. Please try again.",
        type: "error" as const,
        duration: 10000, // 10 seconds
      },
      {
        title: "Task Reminder",
        body: "Don't forget to submit your report by 5 PM today.",
        type: "info" as const,
        duration: 4000, // 4 seconds
      },
    ];

    // Send a random notification
    const randomNotif =
      notifications[Math.floor(Math.random() * notifications.length)];
    sendNotification(
      randomNotif.title,
      randomNotif.body,
      randomNotif.type,
      randomNotif.duration
    );
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
