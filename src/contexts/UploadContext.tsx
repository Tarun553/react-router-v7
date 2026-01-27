import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Upload } from "../types/uploadTypes";
import { UploadContext } from "../hooks/useContext";


export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<Upload[]>([]);

  const addUpload = useCallback(
    (fileName: string, fileSize: number): string => {
      const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newUpload: Upload = {
        id,
        fileName,
        fileSize,
        progress: 0,
        status: "uploading",
      };

      setUploads((prev) => [...prev, newUpload]);
      return id;
    },
    [],
  );

  const updateProgress = useCallback((id: string, progress: number) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id
          ? { ...upload, progress: Math.min(100, Math.max(0, progress)) }
          : upload,
      ),
    );
  }, []);

  const completeUpload = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id
          ? { ...upload, progress: 100, status: "completed" }
          : upload,
      ),
    );
  }, []);

  const failUpload = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id ? { ...upload, status: "failed" } : upload,
      ),
    );
  }, []);

  const cancelUpload = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id ? { ...upload, status: "cancelled" } : upload,
      ),
    );
  }, []);

  const retryUpload = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id
          ? { ...upload, progress: 0, status: "uploading" }
          : upload,
      ),
    );
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) =>
      prev.filter((upload) => upload.status !== "completed"),
    );
  }, []);

  const clearAll = useCallback(() => {
    setUploads([]);
  }, []);

  return (
    <UploadContext.Provider
      value={{
        uploads,
        addUpload,
        updateProgress,
        completeUpload,
        failUpload,
        cancelUpload,
        retryUpload,
        removeUpload,
        clearCompleted,
        clearAll,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}


