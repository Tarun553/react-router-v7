import { useState } from "react";
import { useUploadContext } from "../hooks/useContext";
import "./UploadManager.css";
import UploadItem from "./UploadItem";

export default function UploadManager() {
  const { uploads, clearCompleted, clearAll } = useUploadContext();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Don't render if no uploads
  if (uploads.length === 0) return null;

  const completedCount = uploads.filter((u) => u.status === "completed").length;
  const uploadingCount = uploads.filter((u) => u.status === "uploading").length;
  const failedCount = uploads.filter((u) => u.status === "failed").length;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => clearAll(), 300); // Wait for animation
  };

  if (!isVisible) return null;

  return (
    <div className={`upload-manager ${isMinimized ? "minimized" : ""}`}>
      {/* Header */}
      <div className="upload-manager-header">
        <div className="upload-manager-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>
            {uploadingCount > 0
              ? `Uploading ${uploadingCount} ${uploadingCount === 1 ? "file" : "files"}...`
              : `${completedCount} upload${completedCount === 1 ? "" : "s"} complete`}
          </span>
        </div>

        <div className="upload-manager-actions">
          <button
            className="icon-button"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </button>

          {completedCount > 0 && (
            <button
              className="icon-button"
              onClick={clearCompleted}
              title="Clear completed"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          )}

          <button className="icon-button" onClick={handleClose} title="Close">
            <svg
              width="16"
              height="16"
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
      </div>

      {/* Upload List */}
      {!isMinimized && (
        <div className="upload-manager-body">
          {uploads.map((upload) => (
            <UploadItem key={upload.id} upload={upload} />
          ))}
        </div>
      )}

      {/* Footer with summary */}
      {!isMinimized && uploads.length > 1 && (
        <div className="upload-manager-footer">
          <div className="upload-summary">
            {uploadingCount > 0 && (
              <span className="uploading">{uploadingCount} uploading</span>
            )}
            {completedCount > 0 && (
              <span className="completed">{completedCount} completed</span>
            )}
            {failedCount > 0 && (
              <span className="failed">{failedCount} failed</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
