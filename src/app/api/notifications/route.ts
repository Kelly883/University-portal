import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notifications);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await req.json();

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (notification?.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return new NextResponse("Invalid request data", { status: 400 });
  }
}
