import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Simple in-memory rate limiter for signup attempts.
// NOTE: This is per-process only. For production use a shared store (Redis/Upstash).
declare global {
  // eslint-disable-next-line no-var
  var superadminSignupLimiter: Map<string, { count: number; first: number }> | undefined;
}

const signupLimiter = globalThis.superadminSignupLimiter ?? new Map<string, { count: number; first: number }>();
globalThis.superadminSignupLimiter = signupLimiter;

export async function POST(request: Request) {
  try {
    // Rate limiting by IP to prevent abuse of the one-time signup endpoint
    const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxAttempts = 5;
    const entry = signupLimiter.get(ip) ?? { count: 0, first: now };
    if (now - entry.first > windowMs) {
      entry.count = 0;
      entry.first = now;
    }
    entry.count += 1;
    signupLimiter.set(ip, entry);
    if (entry.count > maxAttempts) {
      return NextResponse.json({ message: 'Too many requests. Try again later.' }, { status: 429 });
    }

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

    // Clear limiter for this IP on success
    signupLimiter.delete(ip);

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
