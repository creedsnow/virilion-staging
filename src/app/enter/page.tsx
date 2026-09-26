"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { DemoBadge } from "@/components/DemoBadge";
import { getVessel, setPlayer } from "@/lib/storage";

export default function EnterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function enter(e?: FormEvent) {
    e?.preventDefault();
    setPlayer({
      screenName: name.trim() || "Traveler",
      enteredAt: new Date().toISOString(),
    });
    const vessel = getVessel();
    router.replace(vessel ? "/" : "/rite");
  }

  function createAccount() {
    setPlayer({
      screenName: name.trim() || "Traveler",
      enteredAt: new Date().toISOString(),
    });
    router.replace("/rite");
  }

  return (
    <div className="night-sky -mx-4 -mt-4 min-h-[calc(100dvh-3.5rem)] px-4 py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <DemoBadge className="mb-6" />

        <div className="relative mb-5">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(201,162,39,0.45), transparent 70%)",
            }}
            aria-hidden
          />
          <Image
            src="/virilion-logo.png"
            alt="Virilion"
            width={148}
            height={148}
            className="relative drop-shadow-[0_0_28px_rgba(201,162,39,0.4)]"
            priority
          />
        </div>

        <h1 className="text-3xl font-semibold tracking-[0.12em] text-gold-soft mb-1">
          VIRILION
        </h1>
        <p className="text-sm text-moon/90 mb-1 text-center max-w-xs leading-relaxed">
          Adult queer mythic fantasy. One vessel.
        </p>
        <p className="text-xs text-fg-muted mb-8 text-center max-w-xs leading-relaxed">
          In-app RP home — scenes, voice, and presence live here.
        </p>

        <form
          onSubmit={enter}
          className="stone-panel card w-full space-y-4 rounded-2xl px-5 py-6"
        >
          <p className="text-center text-[11px] text-gold tracking-[0.14em] uppercase">
            Demo mode — no password needed
          </p>

          <div>
            <label className="label" htmlFor="screen">
              Screen name
            </label>
            <input
              id="screen"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How you appear as Player"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Cosmetic — not validated"
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <label className="label mb-0" htmlFor="password">
                Password
              </label>
              <span className="text-[11px] text-fg-muted/80">Forgot password</span>
            </div>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Cosmetic — ignored in demo"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-gold w-full text-base tracking-wide">
            Enter Virilion
          </button>

          <div className="flex flex-col items-center gap-2 pt-1">
            <button
              type="button"
              className="text-sm text-gold-soft hover:text-gold transition"
              onClick={createAccount}
            >
              Create account → Rite of Making
            </button>
            <button
              type="button"
              className="link-quiet text-xs"
              onClick={() => enter()}
            >
              Skip demo login — enter as Traveler
            </button>
          </div>

          <p className="text-[11px] text-center text-fg-muted leading-relaxed pt-1 border-t border-border/60">
            Fields are cosmetic. No real auth yet — this staging build is labeled{" "}
            <strong className="text-gold">Demo</strong>. Enter opens the portal.
          </p>
        </form>

        <p className="mt-6 text-[11px] text-fg-muted/80 text-center max-w-xs leading-relaxed">
          Black stone · moonlight · antique gold. Sensual, dramatic — not cheap chrome.
        </p>
      </div>
    </div>
  );
}
