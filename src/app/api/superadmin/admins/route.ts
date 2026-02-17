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

    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        permissions: {
          select: { permission: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedAdmins = admins.map((admin) => ({
      ...admin,
      permissions: admin.permissions.map((p) => p.permission),
    }));

    return NextResponse.json({ admins: formattedAdmins }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { message: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}
