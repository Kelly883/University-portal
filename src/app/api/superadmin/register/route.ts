import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Check if a superadmin already exists
    const existingSuperadmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' },
    });

    if (existingSuperadmin) {
      return NextResponse.json(
        { message: 'Superadmin already exists. This page is no longer available.' },
        { status: 403 }
      );
    }

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create superadmin
    const superadmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SUPERADMIN',
      },
    });

    return NextResponse.json(
      {
        message: 'Superadmin account created successfully',
        user: {
          id: superadmin.id,
          name: superadmin.name,
          email: superadmin.email,
          role: superadmin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating superadmin:', error);
    return NextResponse.json(
      { message: 'Failed to create superadmin account' },
      { status: 500 }
    );
  }
}
