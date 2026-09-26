"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { clearSession, getPlayer, getVessel, setPlayer } from "@/lib/storage";
import { Fireflies } from "@/components/Fireflies";

type ThresholdKind = "rite" | "realm";

export default function EnterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alreadyIn, setAlreadyIn] = useState(false);
  const [threshold, setThreshold] = useState<ThresholdKind | null>(null);

  useEffect(() => {
    setAlreadyIn(!!getPlayer());
  }, []);

  useEffect(() => {
    if (!threshold) return;
    const dest = threshold === "realm" ? "/" : "/rite";
    const t = window.setTimeout(() => {
      router.replace(dest);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [threshold, router]);

  function sealAndCross(kind: ThresholdKind) {
    setPlayer({
      screenName: name.trim() || "Traveler",
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

  function enter(e?: FormEvent) {
    e?.preventDefault();
    const vessel = getVessel();
    sealAndCross(vessel ? "realm" : "rite");
  }

  function createAccount() {
    sealAndCross("rite");
  }

  function logout() {
    clearSession();
    setAlreadyIn(false);
    setName("");
    setEmail("");
    setPassword("");
    setThreshold(null);
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
              ? "One vessel. Role first. Cross when you are ready."
              : "Your vessel waits under Virelios lamps."}
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
              You still have a saved demo session in this browser.
            </p>
            <button type="button" className="btn-ghost w-full" onClick={logout}>
              Log out · start over
            </button>
          </div>
        ) : null}

        <form onSubmit={enter} className="enter-form">
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
                }}
                placeholder="you@virilion"
                autoComplete="username"
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="enter-forgot">
              <button type="button" onClick={() => enter()}>
                Forgot password?
              </button>
            </div>
          </div>

          <button type="submit" className="btn-gold btn-enter w-full mt-5">
            Log in
          </button>
          <p className="enter-demo-note">Demo mode — no password needed</p>

          <div className="enter-divider" aria-hidden>
            <span />
            <span>New to Virilion?</span>
            <span />
          </div>

          <button type="button" className="enter-create" onClick={createAccount}>
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
