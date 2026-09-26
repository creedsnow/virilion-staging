import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { ACCOUNTS_WIRING_MESSAGE, isAccountsWired } from "@/lib/accounts";
import { getDb, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  email?: string;
  password?: string;
  confirm?: string;
};

export async function POST(req: Request) {
  if (!isAccountsWired()) {
    return NextResponse.json(
      { error: ACCOUNTS_WIRING_MESSAGE, code: "accounts_unwired" },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirm = typeof body.confirm === "string" ? body.confirm : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Passphrase must be at least 8 characters." },
      { status: 400 },
    );
  }
  if (password !== confirm) {
    return NextResponse.json(
      { error: "Passphrase and confirm do not match." },
      { status: 400 },
    );
  }

  try {
    const db = getDb();
    const existing = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    if (existing[0]) {
      return NextResponse.json(
        { error: "An account with that email already seeks entry." },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 12);
    const id = randomUUID();
    await db.insert(schema.users).values({
      id,
      email,
      passwordHash,
    });

    return NextResponse.json({ ok: true, userId: id, email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json(
      { error: `Could not create account: ${message}`, code: "db_error" },
      { status: 500 },
    );
  }
}
