import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/env.mjs";

const SECRET_HASH = env.FLUTTERWAVE_SECRET_HASH;

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("verif-hash");
    
    // Only check signature if we have a secret hash configured
    if (SECRET_HASH) {
      if (!signature || signature !== SECRET_HASH) {
        return new NextResponse("Invalid signature", { status: 401 });
      }
    } else if (process.env.NODE_ENV === "production") {
        console.warn("FLUTTERWAVE_SECRET_HASH not set in production - Webhook is insecure");
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
