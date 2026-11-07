"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { notificationService, AppNotification } from "@/lib/api/services/notification";

interface NotificationCenterProps {
  role: "candidate" | "employer" | "admin";
}
export function NotificationCenter({ role }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await notificationService.getNotifications(role);
      setNotifications(data);
    };
    fetchNotifications();
  }, [role]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(role);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Helper to get icon and color based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-primary-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-slate-600 relative transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No notifications yet.</div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`p-4 border-b border-slate-50 flex gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${
                    !notification.isRead ? "bg-primary-50/30" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!notification.isRead ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notification.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2">{notification.timestamp}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 shrink-0"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50 rounded-b-xl">
            <button className="text-xs font-medium text-slate-500 hover:text-slate-800">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}