// Helper function to get icon based on notification type
export const getIconForType = (
    type: "info" | "success" | "warning" | "error",
  ): string => {
    const icons = {
      info: "https://cdn-icons-png.flaticon.com/512/471/471662.png",
      success: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
      warning: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
      error: "https://cdn-icons-png.flaticon.com/512/753/753345.png",
    };
    return icons[type];
  };