import { test } from "node:test";
import assert from "node:assert/strict";
import { announcementVisibleTo } from "../lib/announcements.ts";

const student = { id: "s1", role: "STUDENT", departmentId: "d1", programmeId: "p1", facultyId: "f1" };
const lecturer = { id: "l1", role: "FACULTY", departmentId: "d1", programmeId: "p1", facultyId: "f1" };
const admin = { id: "a1", role: "SUPERADMIN", departmentId: null, programmeId: null, facultyId: null };

test("GENERAL announcements are visible to everyone", () => {
  assert.equal(announcementVisibleTo({ audience: "GENERAL" }, student), true);
  assert.equal(announcementVisibleTo({ audience: "GENERAL" }, null), true);
});

test("STUDENT-scoped announcement only visible to the targeted student", () => {
  const a = { audience: "STUDENT", targetUserId: "s1" };
  assert.equal(announcementVisibleTo(a, student), true);
  assert.equal(announcementVisibleTo(a, lecturer), false);
  assert.equal(announcementVisibleTo({ audience: "STUDENT", targetUserId: "s2" }, student), false);
});

test("DEPARTMENT-scoped announcement visible only to matching department", () => {
  const a = { audience: "DEPARTMENT", departmentId: "d1" };
  assert.equal(announcementVisibleTo(a, student), true);
  assert.equal(announcementVisibleTo({ audience: "DEPARTMENT", departmentId: "d99" }, student), false);
});

test("PROGRAMME-scoped announcement visible only to matching programme", () => {
  const a = { audience: "PROGRAMME", programmeId: "p1" };
  assert.equal(announcementVisibleTo(a, student), true);
  assert.equal(announcementVisibleTo({ audience: "PROGRAMME", programmeId: "p99" }, student), false);
});

test("FACULTY-scoped announcement visible to staff or matching faculty", () => {
  const a = { audience: "FACULTY", facultyId: "f1" };
  assert.equal(announcementVisibleTo(a, lecturer), true);
  assert.equal(announcementVisibleTo(a, admin), true);
  assert.equal(announcementVisibleTo({ audience: "FACULTY", facultyId: "f99" }, student), false);
});

test("unauthenticated viewer sees nothing but GENERAL", () => {
  assert.equal(announcementVisibleTo({ audience: "STUDENT", targetUserId: "s1" }, null), false);
  assert.equal(announcementVisibleTo({ audience: "GENERAL" }, null), true);
});
