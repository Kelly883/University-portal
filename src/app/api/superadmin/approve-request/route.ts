import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { message: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Update approval request
    const updated = await prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        approvedById: session.user.id as string,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Request approved successfully', request: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error approving request:', error);
    return NextResponse.json(
      { message: 'Failed to approve request' },
      { status: 500 }
    );
  }
}
