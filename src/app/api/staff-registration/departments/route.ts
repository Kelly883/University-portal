import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const facultyId = searchParams.get('facultyId');

    if (!facultyId) {
      return NextResponse.json(
        { message: 'Faculty ID is required' },
        { status: 400 }
      );
    }

    const departments = await prisma.department.findMany({
      where: { facultyId },
      select: {
        id: true,
        name: true,
        acronym: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ departments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { message: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}
