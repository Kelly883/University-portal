import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized, forbidden } from "@/lib/server-auth";
import { canAccessDocument } from "@/lib/documents";

// Returns document metadata only to an authorized caller (never a public URL).
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const doc = await prisma.document.findUnique({ where: { id: params.id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!canAccessDocument(ctx, doc as any)) return forbidden();

  return NextResponse.json({
    id: doc.id,
    type: doc.type,
    filename: doc.filename,
    mimeType: doc.mimeType,
    size: doc.size,
    ownerId: doc.ownerId,
    accessible: doc.accessible,
  });
}
