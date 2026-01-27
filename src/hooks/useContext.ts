import { createContext, useContext } from "react";
import type { Upload } from "../types/uploadTypes";

interface UploadContextType {
  uploads: Upload[];
  addUpload: (fileName: string, fileSize: number) => string;
  updateProgress: (id: string, progress: number) => void;
  completeUpload: (id: string) => void;
  failUpload: (id: string) => void;
  cancelUpload: (id: string) => void;
  retryUpload: (id: string) => void;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
}

export const UploadContext = createContext<UploadContextType | undefined>(undefined);



export function useUploadContext() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploadContext must be used within UploadProvider");
  }
  return context;
}

