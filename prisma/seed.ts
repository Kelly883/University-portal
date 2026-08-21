import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // --- Users (legacy Role enum) ---
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@titan.edu' },
    update: {},
    create: { email: 'superadmin@titan.edu', name: 'Superadmin', password: hashedPassword, role: Role.SUPERADMIN },
  });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@titan.edu' },
    update: {},
    create: { email: 'admin@titan.edu', name: 'Admin User', password: hashedPassword, role: Role.ADMIN },
  });
  const faculty = await prisma.user.upsert({
    where: { email: 'faculty@titan.edu' },
    update: {},
    create: { email: 'faculty@titan.edu', name: 'Dr. Faculty', password: hashedPassword, role: Role.FACULTY },
  });
  const student = await prisma.user.upsert({
    where: { email: 'student@titan.edu' },
    update: {},
    create: {
      email: 'student@titan.edu',
      name: 'John Student',
      password: hashedPassword,
      role: Role.STUDENT,
      matricNo: 'CSC/2025/001',
      level: '100',
    },
  });

  // --- Academic foundation (PRD-aligned models) ---
  const facultyModel = await prisma.faculty.upsert({
    where: { acronym: 'FOC' },
    update: {},
    create: { name: 'Faculty of Computing', acronym: 'FOC' },
  });
  const department = await prisma.department.upsert({
    where: { facultyId_acronym: { acronym: 'CSC', facultyId: facultyModel.id } },
    update: {},
    create: { name: 'Computer Science', acronym: 'CSC', facultyId: facultyModel.id },
  });
  const programme = await prisma.programme.upsert({
    where: { code: 'CSC' },
    update: {},
    create: {
      name: 'Computer Science',
      code: 'CSC',
      facultyId: facultyModel.id,
      departmentId: department.id,
      degreeType: 'BSc',
      duration: '4 years',
      studyLevel: 'Undergraduate',
      entryRequirements: 'Five O/Level credits including Mathematics and English.',
      description: 'A rigorous computing programme.',
      tuitionInfo: 'Tuition is NGN 50000 per session.',
    },
  });

  // Link the student to the academic structure.
  await prisma.user.update({
    where: { id: student.id },
    data: { facultyId: facultyModel.id, departmentId: department.id, programmeId: programme.id, level: '100' },
  });

  const session = await prisma.academicSession.upsert({
    where: { name: '2025/2026' },
    update: { isCurrent: true },
    create: {
      name: '2025/2026',
      isCurrent: true,
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-07-31'),
    },
  });
  const now = Date.now();
  const semester = await prisma.semester.upsert({
    where: { sessionId_name: { sessionId: session.id, name: 'First' } },
    update: { isCurrent: true },
    create: {
      name: 'First',
      sessionId: session.id,
      startDate: new Date('2025-09-15'),
      endDate: new Date('2025-12-15'),
      registrationStart: new Date(now - 10 * 86400000),
      registrationEnd: new Date(now + 30 * 86400000),
      isCurrent: true,
    },
  });

  // --- Courses (level 100 for the student; one level-200 to exercise the level restriction) ---
  const cs101 = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: { name: 'Introduction to Computer Science', code: 'CS101', facultyId: faculty.id, level: '100', credits: 3, type: 'COMPULSORY', semesterId: semester.id, sessionId: session.id },
  });
  await prisma.course.upsert({
    where: { code: 'CS102' },
    update: {},
    create: { name: 'Programming I', code: 'CS102', facultyId: faculty.id, level: '100', credits: 3, type: 'COMPULSORY', semesterId: semester.id, sessionId: session.id },
  });
  await prisma.course.upsert({
    where: { code: 'CS103' },
    update: {},
    create: { name: 'Discrete Mathematics', code: 'CS103', facultyId: faculty.id, level: '100', credits: 3, type: 'COMPULSORY', semesterId: semester.id, sessionId: session.id },
  });
  await prisma.course.upsert({
    where: { code: 'CS104' },
    update: {},
    create: { name: 'Digital Logic', code: 'CS104', facultyId: faculty.id, level: '100', credits: 3, type: 'COMPULSORY', semesterId: semester.id, sessionId: session.id },
  });
  await prisma.course.upsert({
    where: { code: 'CS105' },
    update: {},
    create: { name: 'Introduction to AI', code: 'CS105', facultyId: faculty.id, level: '100', credits: 3, type: 'ELECTIVE', semesterId: semester.id, sessionId: session.id },
  });
  await prisma.course.upsert({
    where: { code: 'CS106' },
    update: {},
    create: { name: 'Web Development', code: 'CS106', facultyId: faculty.id, level: '100', credits: 3, type: 'ELECTIVE', semesterId: semester.id, sessionId: session.id },
  });
  await prisma.course.upsert({
    where: { code: 'CS201' },
    update: {},
    create: { name: 'Data Structures', code: 'CS201', facultyId: faculty.id, level: '200', credits: 3, type: 'COMPULSORY', prerequisites: [cs101.id], semesterId: semester.id, sessionId: session.id },
  });

  // --- A sample invoice for the student ---
  await prisma.invoice.upsert({
    where: { id: 'inv-student-1' },
    update: {},
    create: {
      id: 'inv-student-1',
      studentId: student.id,
      sessionId: session.id,
      semesterId: semester.id,
      amount: 50000,
      currency: 'NGN',
      description: 'School Fees 2025/2026 (First Semester)',
      status: 'UNPAID',
    },
  });

  console.log({ superadmin, admin, faculty, student, facultyModel, department, programme, session, semester, cs101 });
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
