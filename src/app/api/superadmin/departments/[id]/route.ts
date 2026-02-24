import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") return new NextResponse("Unauthorized", { status: 403 });

  try {
    const dept = await prisma.department.delete({
      where: { id: params.id },
    });

    await logAudit(
      "DELETE_DEPARTMENT",
      "Department",
      session.user.id,
      { name: dept.name },
      dept.id
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Failed to delete department", { status: 500 });
  }
}
