import { useRef } from "react";
import { useUploadContext } from "../hooks/useContext";
import "./FileUploadButton.css";

export default function FileUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addUpload, updateProgress, completeUpload, failUpload } =
    useUploadContext();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Add upload to the manager
      const uploadId = addUpload(file.name, file.size);

      // Simulate upload progress (hardcoded since no backend)
      simulateUpload(uploadId);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const simulateUpload = (uploadId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;

      if (progress >= 100) {
        updateProgress(uploadId, 100);
        clearInterval(interval);

        // Randomly succeed or fail (90% success rate)
        setTimeout(() => {
          if (Math.random() > 0.1) {
            completeUpload(uploadId);
          } else {
            failUpload(uploadId);
          }
        }, 300);
      } else {
        updateProgress(uploadId, progress);
      }
    }, 500);
  };

  return (
    <div className="file-upload-button-container">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input" className="file-upload-button">
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
        <span>Upload Files</span>
      </label>
    </div>
  );
}
