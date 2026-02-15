import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let isStreamClosed = false;

      const safeEnqueue = (data: Uint8Array) => {
        if (isStreamClosed) return;
        try {
          controller.enqueue(data);
        } catch (error) {
          console.error("Stream enqueue error:", error);
          isStreamClosed = true;
        }
      };

      const safeClose = () => {
        if (isStreamClosed) return;
        try {
          controller.close();
        } catch (error) {
          console.error("Stream close error:", error);
        } finally {
          isStreamClosed = true;
        }
      };

      // Send initial connection message
      safeEnqueue(encoder.encode("data: connected\n\n"));

      const checkNotifications = async () => {
        if (isStreamClosed) return;
        
        try {
          // Find unread notifications created in the last few seconds
          // In a real production app with high load, this polling is inefficient.
          // Ideally use Postgres LISTEN/NOTIFY or Redis Pub/Sub.
          // For this MVP/Serverless env, we poll for *unread* notifications.
          // To avoid re-sending, we could track last checked timestamp.
          
          // However, managing state in serverless function is tricky. 
          // Client should track 'lastId' and send it, but standard EventSource doesn't send headers easily.
          // Simplified approach: Client fetches existing unread on load. 
          // This stream just pings "check_new" periodically or sends actual data if we can track it.
          
          // Let's assume we want to push *any* unread notification that the user hasn't seen?
          // Better: The client polling is actually more robust for serverless than this stream if we can't keep it open long.
          // But per requirements, let's try to keep this open and check DB.
          
          const notifications = await prisma.notification.findMany({
            where: {
              userId: session.user.id,
              read: false,
              createdAt: { gt: new Date(Date.now() - 5000) } // Created in last 5s
            },
          });

          if (notifications.length > 0) {
            safeEnqueue(encoder.encode(`data: ${JSON.stringify(notifications)}\n\n`));
          }
        } catch (error) {
          console.error("SSE Error:", error);
          safeClose();
        }
      };

      // Poll every 5 seconds
      const interval = setInterval(checkNotifications, 5000);

      // Close on client disconnect (handled by runtime usually, but good practice)
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        safeClose();
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
