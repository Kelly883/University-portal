import { test } from "node:test";
import assert from "node:assert/strict";
import { decidePaystackCharge } from "../lib/paystack-webhook.ts";
import type { Payment } from "@prisma/client";

function payment(over: Partial<Payment> = {}): Payment {
  return {
    id: "pay-1",
    studentId: "student-1",
    amount: 50000,
    currency: "NGN",
    status: "PENDING",
    provider: "paystack",
    transactionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  } as Payment;
}

test("charge.success with matching amount completes", () => {
  const evt = { event: "charge.success", data: { reference: "pay-1", id: 999, amount: 5000000, currency: "NGN" } };
  const d = decidePaystackCharge(evt as any, payment(), { expectedCurrency: "NGN" });
  assert.equal(d.action, "complete");
  assert.equal((d as any).paymentId, "pay-1");
});

test("non charge.success event is ignored", () => {
  const evt = { event: "transfer.success", data: { reference: "pay-1", id: 1, amount: 5000000 } };
  const d = decidePaystackCharge(evt as any, payment());
  assert.equal(d.action, "ignore");
});

test("already COMPLETED payment is idempotent (no reprocess)", () => {
  const evt = { event: "charge.success", data: { reference: "pay-1", id: 999, amount: 5000000 } };
  const d = decidePaystackCharge(evt as any, payment({ status: "COMPLETED" }));
  assert.equal(d.action, "already_processed");
});

test("amount mismatch is ignored (prevents under/over payment acceptance)", () => {
  const evt = { event: "charge.success", data: { reference: "pay-1", id: 999, amount: 4000000 } };
  const d = decidePaystackCharge(evt as any, payment());
  assert.equal(d.action, "ignore");
  assert.match((d as any).reason, /amount/i);
});

test("currency mismatch is ignored", () => {
  const evt = { event: "charge.success", data: { reference: "pay-1", id: 999, amount: 5000000, currency: "USD" } };
  const d = decidePaystackCharge(evt as any, payment(), { expectedCurrency: "NGN" });
  assert.equal(d.action, "ignore");
  assert.match((d as any).reason, /currency/i);
});

test("unknown reference is ignored", () => {
  const evt = { event: "charge.success", data: { reference: "pay-x", id: 999, amount: 5000000 } };
  const d = decidePaystackCharge(evt as any, null);
  assert.equal(d.action, "ignore");
});
