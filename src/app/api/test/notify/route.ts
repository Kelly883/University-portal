import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Test endpoint to trigger a notification for the current user
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, message } = await req.json();

  const notification = await prisma.notification.create({
    data: {
      userId: session.user.id,
      title: title || "Test Notification",
      message: message || "This is a real-time notification test.",
    },
  });

  return NextResponse.json(notification);
}
