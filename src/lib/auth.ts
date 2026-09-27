import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "@auth/core/jwt";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { isAccountsWired } from "@/lib/accounts";
import { getDb, schema } from "@/lib/db";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: Date | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

type AppJWT = JWT & { id?: string; email?: string };

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Credentials requires JWT — do not use database sessions here.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!isAccountsWired()) return null;
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const db = getDb();
        const rows = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .limit(1);
        const user = rows[0];
        if (!user) return null;

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as AppJWT;
      if (user) {
        t.id = user.id;
        t.email = user.email ?? undefined;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as AppJWT;
      if (t.id) {
        session.user.id = String(t.id);
        if (t.email) session.user.email = t.email;
      }
      return session;
    },
  },
  // Avoid Auth.js throwing at import/build when AUTH_SECRET is absent.
  secret: process.env.AUTH_SECRET || "build-placeholder-not-for-prod",
  trustHost: true,
});
