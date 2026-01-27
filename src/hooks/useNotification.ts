import { createContext, useContext } from "react";
import type { NotificationContextType } from "../types/notificationType";



export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);  

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }
  return context;
}
