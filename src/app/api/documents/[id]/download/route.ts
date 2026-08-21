import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { join } from "path";
import prisma from "@/lib/prisma";
import { getServerAuth, unauthorized, forbidden } from "@/lib/server-auth";
import { canAccessDocument } from "@/lib/documents";
import { logAudit } from "@/lib/audit";

// Secure download. Files live outside the public web root (DOCUMENT_STORE_DIR) and are
// only ever released after an authorization check. No predictable public URL exists.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await getServerAuth();
  if (!ctx) return unauthorized();

  const doc = await prisma.document.findUnique({ where: { id: params.id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!canAccessDocument(ctx, doc as any)) return forbidden();

  const storeDir = process.env.DOCUMENT_STORE_DIR || "";
  if (!storeDir) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }
  const filePath = join(storeDir, doc.storageKey);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  await logAudit("DOCUMENT_DOWNLOAD", "Document", ctx.userId!, { filename: doc.filename }, doc.id, doc.ownerId);

  const stream = createReadStream(filePath);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  const body = Buffer.concat(chunks);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${doc.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
