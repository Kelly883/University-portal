import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hasPermission,
  hasRole,
  canAccessStudentRecord,
  canAccessCourse,
  isRestrictedToFinanceOnly,
  effectivePermissions,
} from "../lib/rbac.ts";

test("student has only student-level permissions", () => {
  const ctx = { userId: "u1", role: "STUDENT" };
  assert.equal(hasPermission(ctx, "results.view"), true);
  assert.equal(hasPermission(ctx, "students.view"), false);
  assert.equal(hasPermission(ctx, "fees.manage"), false);
});

test("super admin implicitly has every permission", () => {
  const ctx = { userId: "sa", role: "SUPER_ADMIN" };
  assert.equal(hasPermission(ctx, "students.delete"), true);
  assert.equal(hasPermission(ctx, "audit_logs.view"), true);
  assert.equal(effectivePermissions(ctx).size > 0, true);
});

test("finance officer cannot access unrelated academic admin", () => {
  const ctx = { userId: "f1", role: "FINANCE_OFFICER" };
  assert.equal(hasPermission(ctx, "payments.verify"), true);
  assert.equal(hasPermission(ctx, "results.approve"), false);
  assert.equal(hasPermission(ctx, "courses.manage"), false);
  assert.equal(isRestrictedToFinanceOnly(ctx), true);
});

test("lecturer cannot access finance permissions", () => {
  const ctx = { userId: "l1", role: "LECTURER" };
  assert.equal(hasPermission(ctx, "results.enter"), true);
  assert.equal(hasPermission(ctx, "fees.manage"), false);
});

test("explicitly granted permission overrides role default", () => {
  const ctx = { userId: "s1", role: "STUDENT", permissions: ["students.view"] };
  assert.equal(hasPermission(ctx, "students.view"), true);
});

test("object-level: student can access own record but not others", () => {
  const student = { userId: "s1", role: "STUDENT" };
  assert.equal(canAccessStudentRecord(student, "s1"), true); // own
  assert.equal(canAccessStudentRecord(student, "s2"), false); // other -> blocked (IDOR)
});

test("object-level: privileged staff can access any student record", () => {
  const staff = { userId: "a1", role: "REGISTRAR" };
  assert.equal(canAccessStudentRecord(staff, "s2"), true);
});

test("lecturer can access only assigned course", () => {
  const lecturer = { userId: "l1", role: "LECTURER" };
  assert.equal(canAccessCourse(lecturer, { lecturerId: "l1", departmentId: "d1" }), true);
  assert.equal(canAccessCourse(lecturer, { lecturerId: "l2", departmentId: "d1" }), false);
});

test("unauthenticated context has no permissions", () => {
  assert.equal(hasPermission(null, "students.view"), false);
  assert.equal(hasRole(null, "STUDENT"), false);
});
