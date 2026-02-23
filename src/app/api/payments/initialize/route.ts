import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { initializeFlutterwavePayment, initializePaystackPayment } from "@/lib/payment-providers";

const schema = z.object({
  amount: z.number().min(1),
  provider: z.enum(["flutterwave", "paystack"]),
  courseId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validated = schema.safeParse(body);

    if (!validated.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { amount, provider, courseId } = validated.data;

    // Create a pending payment record
    const payment = await prisma.payment.create({
      data: {
        studentId: session.user.id,
        amount,
        currency: "NGN",
        provider,
        status: "PENDING",
      },
    });

    // Callback URL (replace with actual production URL)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/student/payments/verify?paymentId=${payment.id}`;

    let response;
    const paymentData = {
      email: session.user.email,
      name: session.user.name || "Student",
      amount,
      callbackUrl,
      metadata: {
        paymentId: payment.id,
        courseId,
        studentId: session.user.id,
      },
    };

    if (provider === "flutterwave") {
      response = await initializeFlutterwavePayment(paymentData, payment.id);
    } else {
      response = await initializePaystackPayment(paymentData, payment.id);
    }

    // Update payment with provider's reference if needed (e.g. access_code)
    if (response.transactionId) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { transactionId: response.transactionId },
      });
    }

    return NextResponse.json({ url: response.checkoutUrl });

  } catch (error) {
    console.error("Payment Init Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
