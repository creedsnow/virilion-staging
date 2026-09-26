import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { isAccountsWired } from "@/lib/accounts";
import { getDb, schema } from "@/lib/db";
import type { Vessel } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireUser() {
  if (!isAccountsWired()) {
    return { error: NextResponse.json({ error: "Accounts unwired" }, { status: 503 }) };
  }
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { userId: session.user.id };
}

export async function GET() {
  const gate = await requireUser();
  if ("error" in gate && gate.error) return gate.error;
  const { userId } = gate as { userId: string };

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.vessels)
      .where(eq(schema.vessels.userId, userId))
      .limit(1);
    const row = rows[0];
    return NextResponse.json({ vessel: row ? (row.rite as Vessel) : null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const gate = await requireUser();
  if ("error" in gate && gate.error) return gate.error;
  const { userId } = gate as { userId: string };

  let vessel: Vessel;
  try {
    const body = (await req.json()) as { vessel?: Vessel };
    if (!body.vessel?.id || !body.vessel?.name) {
      return NextResponse.json({ error: "Invalid vessel" }, { status: 400 });
    }
    vessel = body.vessel;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const db = getDb();
    const existing = await db
      .select()
      .from(schema.vessels)
      .where(eq(schema.vessels.userId, userId))
      .limit(1);

    const now = new Date();
    if (existing[0]) {
      // One vessel per user — update in place (keep DB id).
      const id = existing[0].id;
      const next: Vessel = { ...vessel, id };
      await db
        .update(schema.vessels)
        .set({
          rite: next,
          status: next.status,
          updatedAt: now,
        })
        .where(eq(schema.vessels.id, id));
      return NextResponse.json({ vessel: next });
    }

    await db.insert(schema.vessels).values({
      id: vessel.id,
      userId,
      rite: vessel,
      status: vessel.status,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ vessel });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
