import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const createAdminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  permissions: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Only SUPERADMIN can create admins
    if (session?.user?.role !== "SUPERADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const validated = createAdminSchema.safeParse(body);

    if (!validated.success) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const { name, email, password, permissions } = validated.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        permissions: permissions || [],
        isActive: true,
      },
    });

    await logAudit(
      "CREATE_ADMIN",
      "User",
      session.user.id,
      { newAdminEmail: email, permissions },
      newUser.id,
      newUser.id
    );

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Create Admin Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPERADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(admins); // Return simple array as expected by my component
  } catch (error) {
    console.error("Fetch Admins Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
