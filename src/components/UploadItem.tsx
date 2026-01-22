import { useUploadContext } from "../contexts/UploadContext";
import type { Upload } from "../contexts/UploadContext";
import "./UploadItem.css";

interface UploadItemProps {
  upload: Upload;
}

export default function UploadItem({ upload }: UploadItemProps) {
  const { cancelUpload, retryUpload, removeUpload } = useUploadContext();

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    }

    if (["pdf"].includes(ext || "")) {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    }

    if (["mp4", "mov", "avi", "mkv"].includes(ext || "")) {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    }

    // Default file icon
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={`upload-item ${upload.status}`}>
      <div className="upload-item-icon">{getFileIcon(upload.fileName)}</div>

      <div className="upload-item-content">
        <div className="upload-item-header">
          <span className="upload-item-name" title={upload.fileName}>
            {upload.fileName}
          </span>
          <span className="upload-item-size">
            {formatFileSize(upload.fileSize)}
          </span>
        </div>

        {upload.status === "uploading" && (
          <>
            <div className="upload-progress-bar">
              <div
                className="upload-progress-fill"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
            <div className="upload-item-footer">
              <span className="upload-progress-text">{upload.progress}%</span>
              <button
                className="upload-action-button cancel"
                onClick={() => cancelUpload(upload.id)}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {upload.status === "completed" && (
          <div className="upload-item-footer">
            <div className="upload-status-badge success">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Upload complete</span>
            </div>
            <button
              className="upload-action-button remove"
              onClick={() => removeUpload(upload.id)}
            >
              Remove
            </button>
          </div>
        )}

        {upload.status === "failed" && (
          <div className="upload-item-footer">
            <div className="upload-status-badge error">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Upload failed</span>
            </div>
            <button
              className="upload-action-button retry"
              onClick={() => retryUpload(upload.id)}
            >
              Retry
            </button>
          </div>
        )}

        {upload.status === "cancelled" && (
          <div className="upload-item-footer">
            <div className="upload-status-badge cancelled">
              <span>Cancelled</span>
            </div>
            <button
              className="upload-action-button remove"
              onClick={() => removeUpload(upload.id)}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
