import type { Payment } from "@prisma/client";

export interface PaystackEvent {
  event: string;
  data: {
    reference: string;
    id: number | string;
    amount: number; // kobo
    currency?: string;
    status?: string;
    customer?: { email?: string };
    metadata?: Record<string, unknown>;
  };
}

export type WebhookDecision =
  | { action: "ignore"; reason: string }
  | { action: "already_processed"; paymentId: string }
  | {
      action: "complete";
      paymentId: string;
      transactionId: string;
      amount: number;
      currency: string;
    };

/**
 * Pure, testable Paystack charge.success decision. Enforces:
 * - idempotency (already COMPLETED is not reprocessed)
 * - strict amount equality (provider kobo / 100 must equal the authoritative amount)
 * - currency match when the provider supplies one
 * The route applies the decision after the HMAC signature is verified.
 */
export function decidePaystackCharge(
  evt: PaystackEvent,
  payment: Payment | null,
  opts: { expectedCurrency?: string } = {}
): WebhookDecision {
  if (evt.event !== "charge.success") {
    return { action: "ignore", reason: "event is not charge.success" };
  }
  if (!payment) {
    return { action: "ignore", reason: "no matching payment for reference" };
  }
  if (payment.status === "COMPLETED") {
    return { action: "already_processed", paymentId: payment.id };
  }

  const paidAmount = evt.data.amount / 100;
  const paidCents = Math.round(paidAmount * 100);
  const expectedCents = Math.round(payment.amount * 100);
  if (paidCents !== expectedCents) {
    return { action: "ignore", reason: "amount mismatch" };
  }

  if (
    opts.expectedCurrency &&
    evt.data.currency &&
    evt.data.currency.toUpperCase() !== opts.expectedCurrency.toUpperCase()
  ) {
    return { action: "ignore", reason: "currency mismatch" };
  }

  return {
    action: "complete",
    paymentId: payment.id,
    transactionId: String(evt.data.id),
    amount: paidAmount,
    currency: evt.data.currency?.toUpperCase() ?? payment.currency,
  };
}
