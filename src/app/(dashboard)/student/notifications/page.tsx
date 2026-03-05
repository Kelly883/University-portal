import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotificationsList from "@/components/student/notifications-list";

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-heading font-bold text-titan-blue dark:text-white uppercase tracking-tight">
          Notifications Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Stay updated with important announcements and alerts.
        </p>
      </div>

      <NotificationsList initialNotifications={notifications} />
    </div>
  );
}
