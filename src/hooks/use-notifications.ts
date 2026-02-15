"use client";

import { useEffect, useState } from "react";

export type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initial fetch of unread notifications
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(console.error);

    // Subscribe to SSE
    const eventSource = new EventSource("/api/notifications/subscribe");

    eventSource.onmessage = (event) => {
      if (event.data === "connected") return;
      try {
        const newNotifications = JSON.parse(event.data);
        setNotifications((prev) => {
          // Avoid duplicates
          const ids = new Set(prev.map((n) => n.id));
          const uniqueNew = newNotifications.filter((n: Notification) => !ids.has(n.id));
          return [...uniqueNew, ...prev];
        });
      } catch (error) {
        console.error("Error parsing notification:", error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  return { notifications, markAsRead };
}
