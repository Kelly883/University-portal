import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

const SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH || "my_secret_hash";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("verif-hash");
    if (!signature || signature !== SECRET_HASH) {
      // If we don't have a hash set in env, we might want to log a warning or skip.
      // But for security, we should enforce it.
      // For now, if env is not set, we might be vulnerable, so user must set it.
      if (process.env.NODE_ENV === "production" && !process.env.FLUTTERWAVE_SECRET_HASH) {
         console.warn("FLUTTERWAVE_SECRET_HASH not set in production");
      }
      if (signature !== SECRET_HASH) {
        return new NextResponse("Invalid signature", { status: 401 });
      }
    }

    const body = await req.json();
    const { event, data } = body;

    if (event === "charge.completed" && data.status === "successful") {
      const paymentId = data.tx_ref;
      
      const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
      
      if (payment) {
        // Verify amount matches
        if (payment.amount <= data.amount) {
           await prisma.payment.update({
             where: { id: paymentId },
             data: { 
               status: "COMPLETED",
               transactionId: data.id.toString(), // Update with actual FW ID
               updatedAt: new Date()
             }
           });
           // TODO: Unlock course access if this was for a course
        } else {
           // Amount mismatch (partial payment?)
           console.warn("Payment amount mismatch", payment.amount, data.amount);
        }
      }
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("Flutterwave Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
