import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let isStreamClosed = false;
      let interval: NodeJS.Timeout | null = null;

      const safeEnqueue = (data: Uint8Array) => {
        if (isStreamClosed) return;
        try {
          controller.enqueue(data);
        } catch (error) {
          console.error("Stream enqueue error:", error);
          isStreamClosed = true;
          if (interval) clearInterval(interval);
          try { controller.close(); } catch (e) {}
        }
      };

      // Send initial connection message
      safeEnqueue(encoder.encode("data: connected\n\n"));

      const checkNotifications = async () => {
        if (isStreamClosed) return;
        
        try {
          const notifications = await prisma.notification.findMany({
            where: {
              userId: session.user.id,
              read: false,
              createdAt: { gt: new Date(Date.now() - 5000) } // Created in last 5s
            },
          });

          if (notifications.length > 0) {
            safeEnqueue(encoder.encode(`data: ${JSON.stringify(notifications)}\n\n`));
          } else {
             // Send a keep-alive comment to keep the connection open on some platforms
             safeEnqueue(encoder.encode(": keep-alive\n\n"));
          }
        } catch (error) {
          console.error("SSE Error:", error);
          // Don't close immediately on DB error, just log and retry next interval
        }
      };

      // Poll every 5 seconds
      interval = setInterval(checkNotifications, 5000);

      // Close on client disconnect
      req.signal.addEventListener("abort", () => {
        if (interval) clearInterval(interval);
        isStreamClosed = true;
        try { controller.close(); } catch (e) {}
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
