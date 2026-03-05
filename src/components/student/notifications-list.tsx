'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/notifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface Props {
  initialNotifications: Notification[];
}

export default function NotificationsList({ initialNotifications }: Props) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const filteredNotifications = filter === 'all' 
    ? initialNotifications 
    : initialNotifications.filter(n => !n.read);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    if (!confirm('Are you sure you want to mark all notifications as read?')) return;
    
    setLoading(true);
    try {
      await markAllNotificationsAsRead();
      router.refresh();
    } catch (error) {
      console.error("Failed to mark all as read");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'all' 
                ? 'bg-white dark:bg-slate-700 text-titan-blue dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              filter === 'unread' 
                ? 'bg-white dark:bg-slate-700 text-titan-blue dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Unread Only
          </button>
        </div>

        {initialNotifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            disabled={loading}
            className="text-sm font-medium text-titan-blue dark:text-blue-400 hover:underline disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">done_all</span>
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-4 opacity-20">notifications_off</span>
            <p className="text-lg font-medium">No notifications found</p>
            <p className="text-sm mt-1">Check back later for updates.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-6 transition-colors ${
                !notification.read 
                  ? 'bg-blue-50/40 dark:bg-blue-900/10 hover:bg-blue-50/60' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
              }`}
            >
              <div className="flex gap-4">
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  !notification.read ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'
                }`}></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-semibold text-lg ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
                        title="Mark as read"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {new Date(notification.createdAt).toLocaleString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
