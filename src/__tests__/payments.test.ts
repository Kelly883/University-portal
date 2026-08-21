import { test } from "node:test";
import assert from "node:assert/strict";
import {
  processPaymentCallback,
  generateReference,
  safeEqual,
  DuplicatePaymentError,
  PaymentSignatureError,
  PaymentAmountMismatchError,
  PaymentAccountMismatchError,
  type VerificationDeps,
  type PaymentRecord,
} from "../lib/payments.ts";

function makeDeps(overrides: Partial<VerificationDeps> = {}): VerificationDeps {
  return {
    verifySignature: (raw, sig, secret) => raw === "goodbody" && sig === "sig" && secret === "sekret",
    findByTransactionId: async () => null,
    persist: async (rec) => ({ id: "p1", ...rec } as PaymentRecord),
    ...overrides,
  };
}

const baseOpts = {
  expectedAmount: 50000,
  expectedCurrency: "NGN",
  expectedStudentId: "student-1",
  provider: "paystack",
  secret: "sekret",
};

test("successful payment is verified and persisted", async () => {
  const deps = makeDeps();
  let persisted: any = null;
  deps.persist = async (rec) => {
    persisted = rec;
    return { id: "p1", ...rec } as PaymentRecord;
  };
  const res = await processPaymentCallback(
    {
      transactionId: "tx-123",
      reference: "TXN_1",
      status: "successful",
      amount: 50000,
      currency: "NGN",
      metadata: { studentId: "student-1" },
    },
    { ...baseOpts, rawBody: "goodbody", signature: "sig" },
    deps
  );
  assert.equal(res.status, "SUCCESSFUL");
  assert.equal(res.duplicate, false);
  assert.equal(persisted.studentId, "student-1");
  assert.equal(persisted.amount, 50000);
});

test("invalid signature is rejected", async () => {
  await assert.rejects(
    () =>
      processPaymentCallback(
        {
          transactionId: "tx-1",
          reference: "TXN_1",
          status: "successful",
          amount: 50000,
          currency: "NGN",
          metadata: { studentId: "student-1" },
        },
        { ...baseOpts, rawBody: "badbody", signature: "sig" },
        makeDeps()
      ),
    PaymentSignatureError
  );
});

test("amount mismatch is rejected", async () => {
  await assert.rejects(
    () =>
      processPaymentCallback(
        {
          transactionId: "tx-1",
          reference: "TXN_1",
          status: "successful",
          amount: 40000, // wrong
          currency: "NGN",
          metadata: { studentId: "student-1" },
        },
        { ...baseOpts, rawBody: "goodbody", signature: "sig" },
        makeDeps()
      ),
    PaymentAmountMismatchError
  );
});

test("currency mismatch is rejected", async () => {
  await assert.rejects(
    () =>
      processPaymentCallback(
        {
          transactionId: "tx-1",
          reference: "TXN_1",
          status: "successful",
          amount: 50000,
          currency: "USD",
          metadata: { studentId: "student-1" },
        },
        { ...baseOpts, rawBody: "goodbody", signature: "sig" },
        makeDeps()
      ),
    /Currency mismatch/
  );
});

test("account mismatch (IDOR on payment) is rejected", async () => {
  await assert.rejects(
    () =>
      processPaymentCallback(
        {
          transactionId: "tx-1",
          reference: "TXN_1",
          status: "successful",
          amount: 50000,
          currency: "NGN",
          metadata: { studentId: "evil-student" }, // not the session student
        },
        { ...baseOpts, rawBody: "goodbody", signature: "sig" },
        makeDeps()
      ),
    PaymentAccountMismatchError
  );
});

test("duplicate provider transaction is not processed twice (idempotency)", async () => {
  const existing: PaymentRecord = {
    id: "existing",
    studentId: "student-1",
    amount: 50000,
    currency: "NGN",
    status: "SUCCESSFUL",
    provider: "paystack",
    transactionId: "tx-dup",
    reference: "TXN_old",
  };
  const deps = makeDeps({ findByTransactionId: async () => existing });
  let persistCalled = false;
  deps.persist = async () => {
    persistCalled = true;
    return existing;
  };
  const res = await processPaymentCallback(
    {
      transactionId: "tx-dup",
      reference: "TXN_new",
      status: "successful",
      amount: 50000,
      currency: "NGN",
      metadata: { studentId: "student-1" },
    },
    { ...baseOpts, rawBody: "goodbody", signature: "sig" },
    deps
  );
  assert.equal(res.duplicate, true);
  assert.equal(persistCalled, false);
  assert.equal(res.payment.id, "existing");
});

test("failed payment is not persisted as successful", async () => {
  const deps = makeDeps();
  let persistCalled = false;
  deps.persist = async () => {
    persistCalled = true;
    return {} as PaymentRecord;
  };
  const res = await processPaymentCallback(
    {
      transactionId: "tx-fail",
      reference: "TXN_f",
      status: "failed",
      amount: 50000,
      currency: "NGN",
      metadata: { studentId: "student-1" },
    },
    baseOpts,
    deps
  );
  assert.equal(res.status, "FAILED");
  assert.equal(persistCalled, false);
});

test("missing student identity in metadata is rejected", async () => {
  await assert.rejects(
    () =>
      processPaymentCallback(
        {
          transactionId: "tx-1",
          reference: "TXN_1",
          status: "successful",
          amount: 50000,
          currency: "NGN",
        },
        { ...baseOpts, rawBody: "goodbody", signature: "sig" },
        makeDeps()
      ),
    /Missing student identity/
  );
});

test("generateReference is unique and well-formed", () => {
  const a = generateReference();
  const b = generateReference();
  assert.notEqual(a, b);
  assert.match(a, /^TXN_/);
});

test("safeEqual is constant-time and accurate", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  assert.equal(safeEqual("abc", "abcd"), false);
});
