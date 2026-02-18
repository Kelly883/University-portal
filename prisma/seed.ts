import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Superadmin
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@titan.edu' },
    update: {},
    create: {
      email: 'superadmin@titan.edu',
      name: 'Superadmin',
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@titan.edu' },
    update: {},
    create: {
      email: 'admin@titan.edu',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Create Faculty
  const faculty = await prisma.user.upsert({
    where: { email: 'faculty@titan.edu' },
    update: {},
    create: {
      email: 'faculty@titan.edu',
      name: 'Dr. Faculty',
      password: hashedPassword,
      role: Role.FACULTY,
    },
  });

  // Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@titan.edu' },
    update: {},
    create: {
      email: 'student@titan.edu',
      name: 'John Student',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  });

  // Create Course
  const course = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      name: 'Introduction to Computer Science',
      code: 'CS101',
      facultyId: faculty.id,
      students: {
        connect: { id: student.id },
      },
    },
  });

  console.log({ superadmin, admin, faculty, student, course });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
