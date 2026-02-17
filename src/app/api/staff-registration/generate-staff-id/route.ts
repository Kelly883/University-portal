import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { facultyAcronym, departmentAcronym, dateOfBirth } = await request.json();

    if (!facultyAcronym || !departmentAcronym || !dateOfBirth) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse date of birth
    const dob = new Date(dateOfBirth);
    const year = dob.getFullYear().toString().slice(-2);
    const month = String(dob.getMonth() + 1).padStart(2, '0');
    const day = String(dob.getDate()).padStart(2, '0');

    // Get the current count of staff created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const staffCountToday = await prisma.user.count({
      where: {
        role: 'FACULTY',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const incrementalNumber = String(staffCountToday + 1).padStart(2, '0');

    // Generate staff ID
    const staffId = `${facultyAcronym}-${departmentAcronym}-${year}${month}${day}-${incrementalNumber}`;

    return NextResponse.json(
      { staffId, message: 'Staff ID generated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating staff ID:', error);
    return NextResponse.json(
      { message: 'Failed to generate staff ID' },
      { status: 500 }
    );
  }
}
