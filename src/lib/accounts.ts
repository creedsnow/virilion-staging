/**
 * Real accounts require both Neon and Auth.js secrets.
 * Without them the Enter Create-account path stays honest and Demo continues.
 */
export function isAccountsWired(): boolean {
  return Boolean(
    process.env.DATABASE_URL?.trim() && process.env.AUTH_SECRET?.trim(),
  );
}

export const ACCOUNTS_WIRING_MESSAGE =
  "Accounts wiring — needs database";
