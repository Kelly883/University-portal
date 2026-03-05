'use server';

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id
      },
      data: {
        read: true
      }
    });

    revalidatePath('/student/notifications');
    revalidatePath('/student'); // Update dashboard widget too
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Failed to update notification" };
  }
}

export async function markAllNotificationsAsRead() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false
      },
      data: {
        read: true
      }
    });

    revalidatePath('/student/notifications');
    revalidatePath('/student');
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { error: "Failed to update notifications" };
  }
}
