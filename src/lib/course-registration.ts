// Server-side course registration rule enforcement (PRD §10). NEVER trust client validation.
// Pure, deterministic, fully unit-tested. The API layer passes authoritative data here.

export type CourseType = "COMPULSORY" | "ELECTIVE";

export interface CourseInfo {
  id: string;
  code: string;
  title?: string;
  creditUnits: number;
  level?: string; // e.g. "100", "200"
  departmentId?: string;
  programmeId?: string;
  prerequisites: string[]; // course ids that must be passed/selected
  type: CourseType;
  active?: boolean;
}

export interface RegistrationConstraints {
  registrationOpen: boolean;
  windowStart?: Date;
  windowEnd?: Date;
  now: Date;
  minCredits: number;
  maxCredits: number;
  // Number of elective credit units required this registration (0 = none required).
  requiredElectiveCredits: number;
}

export interface StudentContext {
  level: string;
  programmeId?: string;
  departmentId?: string;
  // Courses the student has already passed (prerequisites satisfied).
  passedCourseIds: string[];
  // Courses already registered for this session (for add/drop validation).
  currentlyRegisteredIds: string[];
}

export interface RegistrationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  totalCredits: number;
  electiveCredits: number;
}

export function validateCourseRegistration(
  selected: CourseInfo[],
  constraints: RegistrationConstraints,
  student: StudentContext
): RegistrationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Registration period must be open.
  if (!constraints.registrationOpen) {
    errors.push("Course registration is currently closed.");
  }
  if (constraints.windowStart && constraints.windowEnd) {
    if (constraints.now < constraints.windowStart) {
      errors.push(
        `Registration opens on ${constraints.windowStart.toISOString().slice(0, 10)}.`
      );
    }
    if (constraints.now > constraints.windowEnd) {
      errors.push(
        `Registration closed on ${constraints.windowEnd.toISOString().slice(0, 10)}.`
      );
    }
  }

  // 2. De-duplicate selections and reject unknown/inactive courses.
  const seen = new Set<string>();
  let totalCredits = 0;
  let electiveCredits = 0;
  for (const c of selected) {
    if (seen.has(c.id)) {
      errors.push(`Course ${c.code} is selected more than once.`);
      continue;
    }
    seen.add(c.id);
    if (c.active === false) {
      errors.push(`Course ${c.code} is not available for registration.`);
    }
    const credits = Number(c.creditUnits);
    if (!Number.isFinite(credits) || credits <= 0) {
      errors.push(`Course ${c.code} has an invalid credit unit value.`);
      continue;
    }
    totalCredits += credits;
    if (c.type === "ELECTIVE") electiveCredits += credits;
  }

  // 3. Max / min credit units.
  if (totalCredits > constraints.maxCredits) {
    errors.push(
      `Total credit units (${totalCredits}) exceeds the maximum allowed (${constraints.maxCredits}).`
    );
  }
  if (totalCredits < constraints.minCredits) {
    errors.push(
      `Total credit units (${totalCredits}) is below the minimum required (${constraints.minCredits}).`
    );
  }

  // 4. Required elective credits.
  if (electiveCredits < constraints.requiredElectiveCredits) {
    errors.push(
      `You must register at least ${constraints.requiredElectiveCredits} elective credit unit(s) (selected ${electiveCredits}).`
    );
  }

  // 5. Level restrictions.
  for (const c of selected) {
    if (c.level && c.level !== student.level) {
      errors.push(`Course ${c.code} is restricted to level ${c.level} students.`);
    }
  }

  // 6. Programme / department restrictions.
  for (const c of selected) {
    if (c.programmeId && student.programmeId && c.programmeId !== student.programmeId) {
      errors.push(`Course ${c.code} is not offered to your programme.`);
    }
    if (c.departmentId && student.departmentId && c.departmentId !== student.departmentId) {
      errors.push(`Course ${c.code} is not offered to your department.`);
    }
  }

  // 7. Prerequisites (must be already passed OR selected in this batch).
  const satisfied = new Set<string>();
  student.passedCourseIds.forEach((id) => satisfied.add(id));
  seen.forEach((id) => satisfied.add(id));
  for (const c of selected) {
    for (const prereq of c.prerequisites) {
      if (!satisfied.has(prereq)) {
        errors.push(`Prerequisite for ${c.code} is not satisfied (missing ${prereq}).`);
      }
    }
  }

  // 8. Prevent re-registering for an already-registered course (unless drop flow).
  for (const c of selected) {
    if (student.currentlyRegisteredIds.includes(c.id)) {
      warnings.push(`Course ${c.code} is already registered.`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    totalCredits,
    electiveCredits,
  };
}
