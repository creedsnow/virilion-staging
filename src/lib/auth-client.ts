"use client";

import { signIn, signOut } from "next-auth/react";
import type { Vessel } from "@/lib/types";

export type AuthStatus = {
  accountsWired: boolean;
  message: string | null;
  user: { id: string; email: string } | null;
  vessel: Vessel | null;
};

export async function fetchAuthStatus(): Promise<AuthStatus> {
  try {
    const res = await fetch("/api/auth/status", { cache: "no-store" });
    if (!res.ok) {
      return {
        accountsWired: false,
        message: "Accounts wiring — needs database",
        user: null,
        vessel: null,
      };
    }
    return (await res.json()) as AuthStatus;
  } catch {
    return {
      accountsWired: false,
      message: "Accounts wiring — needs database",
      user: null,
      vessel: null,
    };
  }
}

export async function registerAccount(input: {
  email: string;
  password: string;
  confirm: string;
}): Promise<{ ok: true } | { ok: false; error: string; code?: string }> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json()) as { error?: string; code?: string; ok?: boolean };
    if (!res.ok) {
      return {
        ok: false,
        error: data.error || "Could not create account",
        code: data.code,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error creating account" };
  }
}

export async function loginWithPassword(email: string, password: string) {
  return signIn("credentials", {
    email,
    password,
    redirect: false,
  });
}

export async function logoutSession() {
  try {
    await signOut({ redirect: false });
  } catch {
    /* ignore — demo path may have no session */
  }
}

export async function saveVesselToServer(vessel: Vessel): Promise<boolean> {
  try {
    const res = await fetch("/api/vessel", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vessel }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
