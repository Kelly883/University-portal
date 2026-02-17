import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { fullName, dateOfBirth, state, facultyId, departmentId, staffId, email, password } =
      await request.json();

    // Validation
    if (!fullName || !dateOfBirth || !state || !facultyId || !departmentId || !staffId || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if staff ID already exists
    const existingStaff = await prisma.user.findUnique({
      where: { staffId },
    });

    if (existingStaff) {
      return NextResponse.json(
        { message: 'Staff ID already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create staff user
    const staff = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        staffId,
        role: 'FACULTY',
      },
      select: {
        id: true,
        name: true,
        email: true,
        staffId: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'Staff registered successfully', staff },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering staff:', error);
    return NextResponse.json(
      { message: 'Failed to register staff' },
      { status: 500 }
    );
  }
}
