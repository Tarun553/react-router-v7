export interface Upload {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: "uploading" | "completed" | "failed" | "cancelled";
}