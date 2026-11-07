export type NotificationType = "info" | "success" | "warning" | "error";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: NotificationType;
  // Add a role target so we know who this is for (in a real app this is a userId)
  targetRole: "candidate" | "employer" | "admin";
}

// Simulated database - now with role targeting
let DB_NOTIFICATIONS: AppNotification[] = [
  { id: "1", title: "Interview Accepted", message: "Abebe Kebede accepted your interview request for Senior ICU Nurse.", timestamp: "10 mins ago", isRead: false, type: "success", targetRole: "employer" },
  { id: "2", title: "Payment Confirmed", message: "Your Gold subscription payment of 3,000 ETB was successful.", timestamp: "2 hours ago", isRead: false, type: "success", targetRole: "employer" },
  { id: "3", title: "Welcome to Rohobot", message: "Your profile has been created. Please complete your verification.", timestamp: "1 day ago", isRead: true, type: "info", targetRole: "candidate" },
];

export const notificationService = {
  // Fetch only for the logged-in role
  getNotifications: async (role: "candidate" | "employer" | "admin"): Promise<AppNotification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return DB_NOTIFICATIONS.filter(n => n.targetRole === role);
  },

  markAsRead: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    DB_NOTIFICATIONS = DB_NOTIFICATIONS.map(n => n.id === id ? { ...n, isRead: true } : n);
  },

  markAllAsRead: async (role: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    DB_NOTIFICATIONS = DB_NOTIFICATIONS.map(n => n.targetRole === role ? { ...n, isRead: true } : n);
  },

  // 🔥 NEW: PUSH NOTIFICATION (Called by other services)
  pushNotification: (title: string, message: string, type: NotificationType, targetRole: "candidate" | "employer" | "admin") => {
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      targetRole,
      timestamp: "Just now",
      isRead: false,
    };
    DB_NOTIFICATIONS.unshift(newNotif);
    console.log(`🔔 [NOTIFICATION] For ${targetRole}: ${title}`);
    return newNotif;
  }
};