import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCourseRegistration } from "../lib/course-registration.ts";

function course(over: Partial<any> = {}): any {
  return {
    id: "c1",
    code: "CSC101",
    creditUnits: 3,
    type: "COMPULSORY",
    prerequisites: [],
    active: true,
    ...over,
  };
}

const openConstraints = {
  registrationOpen: true,
  now: new Date("2025-09-15"),
  minCredits: 15,
  maxCredits: 24,
  requiredElectiveCredits: 3,
};

const student = {
  level: "100",
  programmeId: "prog-cs",
  departmentId: "dept-cs",
  passedCourseIds: [],
  currentlyRegisteredIds: [],
};

test("valid registration passes all rules", () => {
  const selected = [
    course({ id: "c1", code: "CSC101", creditUnits: 3, type: "COMPULSORY" }),
    course({ id: "c2", code: "CSC102", creditUnits: 3, type: "COMPULSORY" }),
    course({ id: "c3", code: "CSC103", creditUnits: 3, type: "COMPULSORY" }),
    course({ id: "c4", code: "CSC104", creditUnits: 3, type: "COMPULSORY" }),
    course({ id: "c5", code: "CSC105", creditUnits: 3, type: "ELECTIVE" }),
    course({ id: "c6", code: "CSC106", creditUnits: 3, type: "ELECTIVE" }),
  ];
  const res = validateCourseRegistration(selected, openConstraints, student);
  assert.equal(res.ok, true);
  assert.equal(res.errors.length, 0);
  assert.equal(res.totalCredits, 18);
});

test("closed registration is rejected", () => {
  const res = validateCourseRegistration(
    [course({ creditUnits: 18 })],
    { ...openConstraints, registrationOpen: false },
    student
  );
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /closed/i.test(e)));
});

test("exceeding max credit units is rejected", () => {
  const selected = Array.from({ length: 10 }, (_, i) =>
    course({ id: `c${i}`, code: `CSC${i}`, creditUnits: 3, type: "ELECTIVE" })
  );
  const res = validateCourseRegistration(selected, openConstraints, student);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /maximum/i.test(e)));
});

test("below minimum credit units is rejected", () => {
  const selected = [course({ id: "c1", creditUnits: 3, type: "COMPULSORY" })];
  const res = validateCourseRegistration(selected, openConstraints, student);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /minimum/i.test(e)));
});

test("insufficient elective credits is rejected", () => {
  const selected = Array.from({ length: 6 }, (_, i) =>
    course({ id: `c${i}`, code: `CSC${i}`, creditUnits: 3, type: "COMPULSORY" })
  );
  const res = validateCourseRegistration(selected, openConstraints, student);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /elective/i.test(e)));
});

test("level restriction enforced", () => {
  const selected = [
    course({ id: "c1", code: "CSC201", level: "200", creditUnits: 18, type: "COMPULSORY" }),
  ];
  const res = validateCourseRegistration(selected, openConstraints, student);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /level 200/i.test(e)));
});

test("programme restriction enforced", () => {
  const selected = [
    course({
      id: "c1",
      code: "ENG101",
      programmeId: "prog-eng",
      creditUnits: 18,
      type: "COMPULSORY",
    }),
  ];
  const res = validateCourseRegistration(selected, openConstraints, student);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /programme/i.test(e)));
});

test("prerequisites enforced", () => {
  const selected = [
    course({ id: "c1", code: "CSC201", prerequisites: ["cpre"], creditUnits: 18, type: "COMPULSORY" }),
  ];
  const res = validateCourseRegistration(selected, openConstraints, student);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /Prerequisite/i.test(e)));
});

test("duplicate course selection rejected", () => {
  const selected = [
    course({ id: "c1", code: "CSC101", creditUnits: 9, type: "COMPULSORY" }),
    course({ id: "c1", code: "CSC101", creditUnits: 9, type: "COMPULSORY" }),
  ];
  const res = validateCourseRegistration(selected, openConstraints, student);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /more than once/i.test(e)));
});

test("registration window date bounds enforced", () => {
  const selected = [course({ id: "c1", creditUnits: 18, type: "COMPULSORY" })];
  const res = validateCourseRegistration(selected, {
    ...openConstraints,
    windowStart: new Date("2025-10-01"),
    windowEnd: new Date("2025-11-01"),
  }, student);
  assert.equal(res.ok, false);
  assert.ok(res.errors.some((e) => /opens on/i.test(e)));
});
