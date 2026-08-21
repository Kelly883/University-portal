// Server-side payment verification, idempotency and security (PRD §11, §29, §40).
// NEVER trust frontend redirects. Always verify server-side. Never expose secret keys.
// Core logic is dependency-injected so it can be unit-tested without a live provider/DB.

export type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  transactionId: string; // provider reference (must be unique)
  reference: string; // our internal reference
}

export interface VerificationDeps {
  // Returns true if the webhook/provider signature is cryptographically valid.
  verifySignature: (rawBody: string, signature: string, secret: string) => boolean;
  // Returns an existing payment if the provider transaction id was already processed.
  findByTransactionId: (transactionId: string) => Promise<PaymentRecord | null>;
  // Persists a verified payment (idempotent: caller guarantees uniqueness).
  persist: (record: Omit<PaymentRecord, "id">) => Promise<PaymentRecord>;
}

export interface ProviderCallback {
  transactionId: string;
  reference: string;
  status: string; // provider status string, e.g. "successful" | "failed"
  amount: number;
  currency: string;
  // The student id must be present in signed metadata, never taken from the URL/query.
  metadata?: { studentId?: string };
  studentId?: string; // fallback only when metadata signing is not used
}

export interface VerifyOptions {
  expectedAmount: number;
  expectedCurrency: string;
  expectedStudentId: string;
  provider: string;
  secret: string;
  rawBody?: string;
  signature?: string;
}

export class DuplicatePaymentError extends Error {}
export class PaymentVerificationError extends Error {}
export class PaymentSignatureError extends Error {}
export class PaymentAmountMismatchError extends Error {}
export class PaymentAccountMismatchError extends Error {}

function normalizeProviderStatus(status: string): PaymentStatus | null {
  const s = status.toLowerCase();
  if (s === "successful" || s === "success" || s === "paid" || s === "completed" || s === "complete")
    return "SUCCESSFUL";
  if (s === "failed" || s === "failure") return "FAILED";
  if (s === "cancelled" || s === "canceled") return "CANCELLED";
  if (s === "refunded" || s === "reversed") return "REFUNDED";
  return null;
}

/**
 * Idempotent, server-side payment processing.
 * 1. Rejects if the provider signature is invalid (webhook tampering / CSRF).
 * 2. Rejects if the amount or currency does not match the invoice.
 * 3. Rejects if the account (student) does not match the signed metadata.
 * 4. Prevents duplicate processing by checking the unique provider transaction id.
 */
export async function processPaymentCallback(
  callback: ProviderCallback,
  opts: VerifyOptions,
  deps: VerificationDeps
): Promise<{ status: PaymentStatus; payment: PaymentRecord; duplicate: boolean }> {
  // 1. Signature verification (required when raw body + signature are provided).
  if (opts.rawBody && opts.signature) {
    const valid = deps.verifySignature(opts.rawBody, opts.signature, opts.secret);
    if (!valid) {
      throw new PaymentSignatureError("Invalid payment provider signature");
    }
  }

  const resolvedStatus = normalizeProviderStatus(callback.status);
  if (!resolvedStatus) {
    throw new PaymentVerificationError(`Unknown provider status: ${callback.status}`);
  }

  if (resolvedStatus !== "SUCCESSFUL") {
    return { status: resolvedStatus, payment: {} as PaymentRecord, duplicate: false };
  }

  // The student id must come from signed provider metadata, not from request params.
  const studentId = callback.metadata?.studentId ?? callback.studentId;
  if (!studentId) {
    throw new PaymentVerificationError("Missing student identity in signed metadata");
  }

  // 2. Amount + currency validation against authoritative invoice.
  if (round2(callback.amount) !== round2(opts.expectedAmount)) {
    throw new PaymentAmountMismatchError(
      `Amount mismatch: got ${callback.amount}, expected ${opts.expectedAmount}`
    );
  }
  if (callback.currency.toUpperCase() !== opts.expectedCurrency.toUpperCase()) {
    throw new PaymentVerificationError(
      `Currency mismatch: got ${callback.currency}, expected ${opts.expectedCurrency}`
    );
  }

  // 3. Account/ownership validation.
  if (studentId !== opts.expectedStudentId) {
    throw new PaymentAccountMismatchError("Payment account does not match session student");
  }

  // 4. Idempotency: never process the same provider transaction twice.
  const existing = await deps.findByTransactionId(callback.transactionId);
  if (existing) {
    if (existing.status === "SUCCESSFUL") {
      return { status: "SUCCESSFUL", payment: existing, duplicate: true };
    }
    // A previously failed/cancelled transaction re-reported as success: update it.
  }

  const record = await deps.persist({
    studentId: opts.expectedStudentId,
    amount: opts.expectedAmount,
    currency: opts.expectedCurrency.toUpperCase(),
    status: "SUCCESSFUL",
    provider: opts.provider,
    transactionId: callback.transactionId,
    reference: callback.reference,
  });

  return { status: "SUCCESSFUL", payment: record, duplicate: false };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Generate a unique, unpredictable internal payment reference.
 */
export function generateReference(prefix = "TXN"): string {
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

/**
 * Constant-time string comparison to avoid timing attacks on secret comparison.
 */
export function safeEqual(a: string, b: string): boolean {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (ab.length !== bb.length) return false;
  let result = 0;
  for (let i = 0; i < ab.length; i++) {
    result |= ab[i] ^ bb[i];
  }
  return result === 0;
}
