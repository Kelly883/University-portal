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

    const { adminId, permissions } = await request.json();

    if (!adminId || !Array.isArray(permissions)) {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 400 }
      );
    }

    // Verify the admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 404 }
      );
    }

    // Delete existing permissions
    await prisma.adminPermission.deleteMany({
      where: { adminId },
    });

    // Create new permissions
    if (permissions.length > 0) {
      await prisma.adminPermission.createMany({
        data: permissions.map((permission: string) => ({
          adminId,
          permission,
          grantedBy: session.user.id as string,
        })),
      });
    }

    return NextResponse.json(
      { message: 'Permissions updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating permissions:', error);
    return NextResponse.json(
      { message: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}
