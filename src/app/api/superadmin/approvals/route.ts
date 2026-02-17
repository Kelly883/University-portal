import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const approvals = await prisma.approvalRequest.findMany({
      where,
      select: {
        id: true,
        type: true,
        status: true,
        data: true,
        rejectionReason: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ approvals }, { status: 200 });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      { message: 'Failed to fetch approvals' },
      { status: 500 }
    );
  }
}
