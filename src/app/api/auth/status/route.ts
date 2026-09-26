import { NextResponse } from "next/server";
import { ACCOUNTS_WIRING_MESSAGE, isAccountsWired } from "@/lib/accounts";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";
import type { Vessel } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const wired = isAccountsWired();
  let sessionUser: { id: string; email: string } | null = null;
  let vessel: Vessel | null = null;

  if (wired) {
    try {
      const session = await auth();
      if (session?.user?.id) {
        sessionUser = {
          id: session.user.id,
          email: session.user.email,
        };
        if (hasDatabaseUrl()) {
          const db = getDb();
          const rows = await db
            .select()
            .from(schema.vessels)
            .where(eq(schema.vessels.userId, session.user.id))
            .limit(1);
          const row = rows[0];
          if (row?.rite) vessel = row.rite as Vessel;
        }
      }
    } catch {
      /* missing secret / DB — treat as unwired session */
    }
  }

  return NextResponse.json({
    accountsWired: wired,
    message: wired ? null : ACCOUNTS_WIRING_MESSAGE,
    user: sessionUser,
    vessel,
  });
}
