import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    
    // Read body as text first for HMAC verification
    const bodyText = await req.text();
    
    if (SECRET_KEY) {
        const hash = crypto.createHmac('sha512', SECRET_KEY).update(bodyText).digest('hex');
        if (hash !== signature) {
            return new NextResponse("Invalid signature", { status: 401 });
        }
    }

    const body = JSON.parse(bodyText);
    const { event, data } = body;

    if (event === "charge.success") {
      const paymentId = data.reference;
      
      const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
      
      if (payment) {
        // Paystack amount is in kobo (x100)
        const paidAmount = data.amount / 100;
        
        if (payment.amount <= paidAmount) {
           await prisma.payment.update({
             where: { id: paymentId },
             data: { 
               status: "COMPLETED", 
               transactionId: data.id.toString(),
               updatedAt: new Date()
             }
           });
        }
      }
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("Paystack Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
