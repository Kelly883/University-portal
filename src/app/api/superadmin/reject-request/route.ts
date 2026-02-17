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

    const { requestId, reason } = await request.json();

    if (!requestId || !reason) {
      return NextResponse.json(
        { message: 'Request ID and rejection reason are required' },
        { status: 400 }
      );
    }

    // Update approval request
    const updated = await prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        approvedById: session.user.id as string,
        rejectionReason: reason,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Request rejected successfully', request: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error rejecting request:', error);
    return NextResponse.json(
      { message: 'Failed to reject request' },
      { status: 500 }
    );
  }
}
