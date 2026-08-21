import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateGpa,
  calculateCgpa,
  gradePoint,
  academicStanding,
  roundTo,
} from "../lib/grades.ts";

test("gradePoint maps correctly", () => {
  assert.equal(gradePoint("A"), 5);
  assert.equal(gradePoint("a"), 5);
  assert.equal(gradePoint("F"), 0);
  assert.throws(() => gradePoint("Z"), /Unknown grade/);
});

test("single semester GPA calculation", () => {
  const grades = [
    { courseCode: "CSC101", creditUnits: 3, grade: "A" }, // 15
    { courseCode: "CSC102", creditUnits: 2, grade: "B" }, // 8
    { courseCode: "CSC103", creditUnits: 4, grade: "C" }, // 12
  ];
  // total points = 35, credits = 9 -> 3.888..
  const res = calculateGpa(grades);
  assert.equal(res.totalCreditUnits, 9);
  assert.equal(res.totalGradePoints, 35);
  assert.equal(res.gpa, 3.89);
});

test("empty grades yields zero GPA", () => {
  const res = calculateGpa([]);
  assert.equal(res.gpa, 0);
  assert.equal(res.totalCreditUnits, 0);
});

test("failed grades contribute zero points but count as attempted credits", () => {
  const grades = [
    { courseCode: "CSC101", creditUnits: 3, grade: "A" }, // 15
    { courseCode: "CSC104", creditUnits: 3, grade: "F" }, // 0
  ];
  // 15 / 6 = 2.5
  const res = calculateGpa(grades);
  assert.equal(res.totalCreditUnits, 6);
  assert.equal(res.gpa, 2.5);
});

test("withdrawn grades do not count toward attempted credits", () => {
  const grades = [
    { courseCode: "CSC101", creditUnits: 3, grade: "A" }, // 15
    { courseCode: "CSC105", creditUnits: 3, grade: "WD" }, // skipped
  ];
  // 15 / 3 = 5.0
  const res = calculateGpa(grades);
  assert.equal(res.totalCreditUnits, 3);
  assert.equal(res.gpa, 5.0);
});

test("CGPA aggregates across semesters", () => {
  const sem1 = [
    { courseCode: "CSC101", creditUnits: 3, grade: "A" }, // 15 / 3
  ];
  const sem2 = [
    { courseCode: "CSC201", creditUnits: 3, grade: "B" }, // 12 / 3
  ];
  const res = calculateCgpa([sem1, sem2]);
  // total points 27 / credits 6 = 4.5
  assert.equal(res.totalCreditUnits, 6);
  assert.equal(res.gpa, 4.5);
});

test("academic standing classification", () => {
  assert.equal(academicStanding(4.7), "Excellent");
  assert.equal(academicStanding(3.6), "Good");
  assert.equal(academicStanding(2.6), "Satisfactory");
  assert.equal(academicStanding(1.6), "Probation");
  assert.equal(academicStanding(0.5), "Poor");
});

test("roundTo rounds correctly", () => {
  assert.equal(roundTo(2.8888, 2), 2.89);
  assert.equal(roundTo(2.884, 2), 2.88);
});
