import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const updateAdminSchema = z.object({
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    // Only SUPERADMIN can update admins
    if (session?.user?.role !== "SUPERADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const validated = updateAdminSchema.safeParse(body);

    if (!validated.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { permissions, isActive } = validated.data;

    // Check if admin exists and is actually an ADMIN
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser || targetUser.role !== "ADMIN") {
      return new NextResponse("Admin not found or invalid role", { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        permissions: permissions || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    await logAudit(
      "UPDATE_ADMIN",
      "User",
      session.user.id,
      { 
        updatedFields: { permissions, isActive },
        adminEmail: updatedUser.email
      },
      updatedUser.id,
      updatedUser.id
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update Admin Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPERADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { id } = params;
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser || targetUser.role !== "ADMIN") {
      return new NextResponse("Admin not found or invalid role", { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    await logAudit(
      "DELETE_ADMIN",
      "User",
      session.user.id,
      { adminEmail: targetUser.email },
      id,
      id
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
