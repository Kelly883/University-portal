"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { Bell, X } from "lucide-react";
import { useState, useEffect } from "react";

export function NotificationToast() {
  const { notifications, markAsRead } = useNotifications();
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length > 0) {
      // Show the most recent unread notification
      setActiveToast(unread[0].id);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setActiveToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!activeToast) return null;

  const notification = notifications.find((n) => n.id === activeToast);
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-[#161B22] border-l-4 border-university-gold shadow-2xl rounded-lg p-4 max-w-sm flex gap-4 items-start relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none"></div>
        <div className="p-2 bg-university-gold/10 rounded-full text-university-gold">
          <Bell size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-heading uppercase tracking-wide text-sm text-accent dark:text-white mb-1">
            {notification.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
            {notification.message}
          </p>
          <button
            onClick={() => {
              markAsRead(notification.id);
              setActiveToast(null);
            }}
            className="text-xs font-bold text-accent dark:text-university-gold hover:underline uppercase tracking-wider"
          >
            Mark as Read
          </button>
        </div>
        <button
          onClick={() => setActiveToast(null)}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
