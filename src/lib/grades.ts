// GPA / CGPA calculation (PRD §12). Pure, deterministic, fully unit-tested.
// Grade points follow the standard 5-point (Nigerian) scale, configurable via a map.

export interface GradeRecord {
  courseCode: string;
  creditUnits: number;
  grade: string; // e.g. "A", "B", "C", "D", "E", "F", "ABS", "WD"
}

// Standard 5-point grading scale. Easily mapped to other scales.
export const DEFAULT_GRADE_POINTS: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
  ABS: 0, // Absent
  WD: 0, // Withdrawn
  EX: 0, // Exempt (counted as earned but 0 points) - configurable
};

// Grades that should NOT count toward attempted credit (non-completion).
const NON_GRADED: Set<string> = new Set(["WD", "EX"]);

export function gradePoint(grade: string, scale: Record<string, number> = DEFAULT_GRADE_POINTS): number {
  const g = grade.trim().toUpperCase();
  if (!(g in scale)) {
    throw new Error(`Unknown grade: ${grade}`);
  }
  return scale[g];
}

export interface GpaResult {
  gpa: number;
  totalGradePoints: number;
  totalCreditUnits: number;
  totalEarnedPoints: number;
}

/**
 * Calculate GPA for a single set of grades (e.g. one semester).
 * Weighted average of grade points.
 */
export function calculateGpa(grades: GradeRecord[], scale: Record<string, number> = DEFAULT_GRADE_POINTS): GpaResult {
  if (!grades || grades.length === 0) {
    return { gpa: 0, totalGradePoints: 0, totalCreditUnits: 0, totalEarnedPoints: 0 };
  }

  let totalGradePoints = 0;
  let totalCreditUnits = 0;
  let totalEarnedPoints = 0;

  for (const g of grades) {
    const credits = Number(g.creditUnits);
    if (!Number.isFinite(credits) || credits < 0) {
      throw new Error(`Invalid credit units for ${g.courseCode}: ${g.creditUnits}`);
    }
    // Skip non-graded records (withdrawn/exempt) from attempted credits.
    if (NON_GRADED.has(g.grade.trim().toUpperCase())) {
      continue;
    }
    const points = gradePoint(g.grade, scale);
    totalGradePoints += credits * points;
    totalCreditUnits += credits;
    totalEarnedPoints += points;
  }

  const gpa = totalCreditUnits === 0 ? 0 : totalGradePoints / totalCreditUnits;
  return {
    gpa: roundTo(gpa, 2),
    totalGradePoints,
    totalCreditUnits,
    totalEarnedPoints,
  };
}

/**
 * Calculate Cumulative GPA across multiple semesters/terms.
 * Each entry is a semester's worth of grades.
 */
export function calculateCgpa(semesters: GradeRecord[][], scale: Record<string, number> = DEFAULT_GRADE_POINTS): GpaResult {
  const allGrades: GradeRecord[] = [];
  for (const sem of semesters) allGrades.push(...sem);
  return calculateGpa(allGrades, scale);
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Academic standing based on CGPA (example institutional policy).
 */
export function academicStanding(cgpa: number): "Excellent" | "Good" | "Satisfactory" | "Probation" | "Poor" {
  if (cgpa >= 4.5) return "Excellent";
  if (cgpa >= 3.5) return "Good";
  if (cgpa >= 2.5) return "Satisfactory";
  if (cgpa >= 1.5) return "Probation";
  return "Poor";
}

export function classify(gpa: number): string {
  return academicStanding(gpa);
}
