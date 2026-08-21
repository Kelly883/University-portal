import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { decidePaystackCharge } from "@/lib/paystack-webhook";

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const EXPECTED_CURRENCY = process.env.PAYMENT_CURRENCY || "NGN";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    const bodyText = await req.text();

    // 1. Verify the provider signature before trusting any payload content.
    if (SECRET_KEY) {
      const hash = crypto.createHmac("sha512", SECRET_KEY).update(bodyText).digest("hex");
      if (hash !== signature) {
        return new NextResponse("Invalid signature", { status: 401 });
      }
    }

    const body = JSON.parse(bodyText) as Parameters<typeof decidePaystackCharge>[0];

    // 2. Look up the authoritative payment by our reference (stored as payment id).
    const payment = await prisma.payment.findUnique({ where: { id: body.data.reference } });

    // 3. Decide using the hardened, idempotent verifier (amount + currency + idempotency).
    const decision = decidePaystackCharge(body, payment, { expectedCurrency: EXPECTED_CURRENCY });

    if (decision.action === "complete") {
      await prisma.payment.update({
        where: { id: decision.paymentId },
        data: {
          status: "COMPLETED",
          transactionId: decision.transactionId,
          currency: decision.currency,
          updatedAt: new Date(),
        },
      });
    }
    // "already_processed" and "ignore" require no mutation (idempotent).

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Paystack Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
