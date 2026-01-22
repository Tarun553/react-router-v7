import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router/router.tsx";
import { RouterProvider } from "react-router";
import { UploadProvider } from "./contexts/UploadContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UploadProvider>
      <RouterProvider router={router} />
    </UploadProvider>
  </StrictMode>,
);
