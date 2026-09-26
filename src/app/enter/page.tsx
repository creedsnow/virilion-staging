"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { clearSession, getPlayer, getVessel, setPlayer, setVessel } from "@/lib/storage";
import { Fireflies } from "@/components/Fireflies";
import {
  fetchAuthStatus,
  loginWithPassword,
  logoutSession,
  registerAccount,
  type AuthStatus,
} from "@/lib/auth-client";

type ThresholdKind = "rite" | "realm";
type FormMode = "login" | "register";

export default function EnterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mode, setMode] = useState<FormMode>("login");
  const [alreadyIn, setAlreadyIn] = useState(false);
  const [threshold, setThreshold] = useState<ThresholdKind | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const accountsWired = authStatus?.accountsWired === true;

  useEffect(() => {
    setAlreadyIn(!!getPlayer());
    let cancelled = false;
    fetchAuthStatus().then((status) => {
      if (cancelled) return;
      setAuthStatus(status);
      if (status.user) {
        setAlreadyIn(true);
        setEmail(status.user.email);
        setName(status.user.email.split("@")[0] || "Traveler");
        if (status.vessel) {
          setVessel(status.vessel);
          setPlayer({
            screenName: status.vessel.name || status.user.email.split("@")[0] || "Traveler",
            enteredAt: new Date().toISOString(),
          });
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!threshold) return;
    const dest = threshold === "realm" ? "/" : "/rite";
    const t = window.setTimeout(() => {
      router.replace(dest);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [threshold, router]);

  function sealAndCross(kind: ThresholdKind, screenName?: string) {
    setPlayer({
      screenName: (screenName || name.trim() || email.trim() || "Traveler").slice(0, 64),
      enteredAt: new Date().toISOString(),
    });
    try {
      sessionStorage.setItem(
        "virilion_threshold",
        kind === "rite" ? "enter-rite" : "enter-realm",
      );
    } catch {
      /* ignore */
    }
    setThreshold(kind);
  }

  /** Demo path — localStorage only; labeled Demo; never fakes a real account. */
  function continueAsDemo(e?: FormEvent) {
    e?.preventDefault();
    setFormError("");
    const vessel = getVessel();
    sealAndCross(vessel ? "realm" : "rite");
  }

  async function onLogin(e?: FormEvent) {
    e?.preventDefault();
    setFormError("");

    if (!accountsWired) {
      setFormError(
        authStatus?.message || "Accounts wiring — needs database",
      );
      return;
    }

    const em = email.trim();
    if (!em || !password) {
      setFormError("Email and passphrase required to log in.");
      return;
    }

    setBusy(true);
    try {
      const result = await loginWithPassword(em, password);
      if (result?.error) {
        setFormError("Those credentials were not recognized.");
        return;
      }
      const status = await fetchAuthStatus();
      setAuthStatus(status);
      if (!status.user) {
        setFormError("Signed in, but session could not be read.");
        return;
      }
      if (status.vessel) {
        setVessel(status.vessel);
        sealAndCross("realm", status.vessel.name);
      } else {
        sealAndCross("rite", status.user.email.split("@")[0]);
      }
    } catch {
      setFormError("Could not reach the gate. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onCreateAccount(e?: FormEvent) {
    e?.preventDefault();
    setFormError("");

    if (!accountsWired) {
      setFormError(
        authStatus?.message || "Accounts wiring — needs database",
      );
      return;
    }

    if (mode !== "register") {
      setMode("register");
      setFormError("");
      return;
    }

    const em = email.trim();
    if (!em || !password || !confirm) {
      setFormError("Email, passphrase, and confirm are required.");
      return;
    }
    if (password !== confirm) {
      setFormError("Passphrase and confirm do not match.");
      return;
    }

    setBusy(true);
    try {
      const reg = await registerAccount({
        email: em,
        password,
        confirm,
      });
      if (!reg.ok) {
        setFormError(reg.error);
        return;
      }
      const result = await loginWithPassword(em, password);
      if (result?.error) {
        setFormError("Account created — log in with your passphrase.");
        setMode("login");
        return;
      }
      const status = await fetchAuthStatus();
      setAuthStatus(status);
      sealAndCross("rite", em.split("@")[0]);
    } catch {
      setFormError("Could not create account. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await logoutSession();
    clearSession();
    setAlreadyIn(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setMode("login");
    setFormError("");
    setThreshold(null);
    setAuthStatus((s) =>
      s
        ? { ...s, user: null, vessel: null }
        : s,
    );
  }

  if (threshold) {
    const toRite = threshold === "rite";
    return (
      <div className="night-sky enter-sky -mx-4 min-h-[100dvh] relative">
        <Fireflies />
        <div className="enter-shell threshold-handoff items-center text-center !justify-center">
          <div className="enter-logo-wrap mb-7">
            <div className="enter-logo-aura threshold-aura" aria-hidden />
            <Image
              src="/virilion-logo.png"
              alt="Virilion"
              width={118}
              height={118}
              className="enter-logo"
              priority
            />
          </div>
          <p className="section-kicker mb-2">
            {toRite ? "The threshold opens" : "The lamps remember you"}
          </p>
          <h1 className="font-display text-[1.85rem] font-semibold text-[color:var(--title)] leading-tight">
            {toRite ? "Begin the Rite of Making" : "Return to the Realm"}
          </h1>
          <p className="display-italic text-[1.05rem] text-fg-muted mt-3 leading-relaxed max-w-[17.5rem] mx-auto">
            {toRite
              ? "One character. Role first. Cross when you are ready."
              : "Your character waits under Virelios lamps."}
          </p>
          <div className="threshold-progress mt-8" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <button
            type="button"
            className="btn-gold btn-enter w-full mt-8"
            onClick={() => router.replace(toRite ? "/rite" : "/")}
          >
            {toRite ? "Step through" : "Enter the Realm"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="night-sky enter-sky -mx-4 min-h-[100dvh] relative">
      <Fireflies />
      <div className="enter-shell">
        <div className="enter-brand">
          <div className="enter-logo-wrap">
            <div className="enter-logo-aura" aria-hidden />
            <Image
              src="/virilion-logo.png"
              alt="Virilion"
              width={118}
              height={118}
              className="enter-logo"
              priority
            />
          </div>
          <h1 className="display-title display-title-enter">Virilion</h1>
          <p className="display-italic display-italic-enter">Enter Virilion</p>
        </div>

        {alreadyIn ? (
          <div className="w-full space-y-3 mt-6 mb-1 text-center">
            <p className="text-sm text-fg-muted leading-relaxed">
              {authStatus?.user
                ? "You have a signed-in session in this browser."
                : "You still have a saved demo session in this browser."}
            </p>
            <button type="button" className="btn-ghost w-full" onClick={() => void logout()}>
              Log out · start over
            </button>
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (mode === "register") void onCreateAccount(e);
            else void onLogin(e);
          }}
          className="enter-form"
        >
          <div className="enter-fields">
            <div>
              <label className="enter-label" htmlFor="email">
                Who seeks entry
              </label>
              <input
                id="email"
                className="input enter-input"
                value={email || name}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setName(e.target.value);
                  setFormError("");
                }}
                placeholder="you@virilion"
                autoComplete="username"
                inputMode="email"
              />
            </div>

            <div>
              <label className="enter-label" htmlFor="password">
                Passphrase
              </label>
              <input
                id="password"
                type="password"
                className="input enter-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormError("");
                }}
                placeholder="••••••••"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
            </div>

            {mode === "register" ? (
              <div>
                <label className="enter-label" htmlFor="confirm">
                  Confirm passphrase
                </label>
                <input
                  id="confirm"
                  type="password"
                  className="input enter-input"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setFormError("");
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            ) : (
              <div className="enter-forgot">
                <button
                  type="button"
                  onClick={() =>
                    setFormError(
                      accountsWired
                        ? "Password reset is not wired yet — ask a steward, or Continue as Demo."
                        : "Accounts wiring — needs database",
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {formError ? (
            <p
              className="text-sm text-center mt-3 leading-relaxed"
              style={{ color: "color-mix(in srgb, var(--gold-soft) 70%, #c45)" }}
              role="alert"
            >
              {formError}
            </p>
          ) : null}

          {mode === "login" ? (
            <>
              <button
                type="submit"
                className="btn-gold btn-enter w-full mt-5"
                disabled={busy}
              >
                {busy ? "Opening…" : "Log in"}
              </button>
              <button
                type="button"
                className="enter-demo-note enter-demo-btn"
                onClick={() => continueAsDemo()}
                disabled={busy}
              >
                Continue as Demo — local only, no password
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="btn-gold btn-enter w-full mt-5"
              disabled={busy}
            >
              {busy ? "Sealing…" : "Create account"}
            </button>
          )}

          <div className="enter-divider" aria-hidden>
            <span />
            <span>New to Virilion?</span>
            <span />
          </div>

          {mode === "login" ? (
            <button
              type="button"
              className="enter-create"
              disabled={busy}
              onClick={() => {
                setFormError("");
                if (!accountsWired) {
                  setFormError(
                    authStatus?.message || "Accounts wiring — needs database",
                  );
                  return;
                }
                setMode("register");
              }}
            >
              Create account
            </button>
          ) : (
            <button
              type="button"
              className="enter-create"
              disabled={busy}
              onClick={() => {
                setMode("login");
                setConfirm("");
                setFormError("");
              }}
            >
              Back to log in
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
