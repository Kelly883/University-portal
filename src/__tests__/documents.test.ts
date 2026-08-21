import { test } from "node:test";
import assert from "node:assert/strict";
import { canAccessDocument } from "../lib/documents.ts";

const doc = {
  id: "doc-1",
  ownerId: "owner-1",
  ownerType: "STUDENT" as const,
  type: "RESULT",
  filename: "result.pdf",
  storageKey: "2025/result.pdf",
  accessible: true,
};

test("owner can access their own document", () => {
  const ctx = { userId: "owner-1", role: "STUDENT" as const };
  assert.equal(canAccessDocument(ctx, doc), true);
});

test("another student cannot access", () => {
  const ctx = { userId: "other-student", role: "STUDENT" as const };
  assert.equal(canAccessDocument(ctx, doc), false);
});

test("inaccessible (revoked) document is denied even to owner", () => {
  const ctx = { userId: "owner-1", role: "STUDENT" as const };
  assert.equal(canAccessDocument(ctx, { ...doc, accessible: false }), false);
});

test("staff with documents.view can access", () => {
  const ctx = { userId: "staff-1", role: "REGISTRAR" as const, permissions: ["documents.view"] as string[] };
  assert.equal(canAccessDocument(ctx, doc), true);
});

test("unauthenticated is denied", () => {
  assert.equal(canAccessDocument(null, doc), false);
});
