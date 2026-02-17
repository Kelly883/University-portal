import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany({
      select: {
        id: true,
        name: true,
        acronym: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ faculties }, { status: 200 });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return NextResponse.json(
      { message: 'Failed to fetch faculties' },
      { status: 500 }
    );
  }
}
