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
    <div className="night-sky -mx-4 min-h-[100dvh] px-5 py-12 flex flex-col items-center justify-center relative">
      <div className="relative z-[1] w-full max-w-sm flex flex-col items-center">
        <DemoBadge className="mb-7" />

        <div className="relative mb-5">
          <div
            className="absolute -inset-6 rounded-full blur-2xl opacity-70"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--aura) 55%, transparent), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative rounded-[1.35rem] overflow-hidden border border-gold/25 shadow-[0_0_40px_rgba(123,94,167,0.35)]">
            <Image
              src="/virilion-logo.png"
              alt="Virilion"
              width={112}
              height={112}
              className="block"
              priority
            />
          </div>
        </div>

        <h1 className="display-title text-[1.65rem] mb-1">Virilion</h1>
        <p className="display-italic text-lg mb-8">Enter Virilion</p>

        <form onSubmit={enter} className="w-full space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email or screen name
            </label>
            <input
              id="email"
              className="input"
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
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="········"
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-1.5">
              <span className="text-[11px] text-fg-muted">Forgot password?</span>
            </div>
          </div>

          <button type="submit" className="btn-gold w-full mt-1">
            Log in
          </button>
          <p className="text-center text-[11px] text-fg-muted -mt-1">
            Demo mode — no password needed
          </p>

          <div className="flex items-center gap-3 pt-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] tracking-[0.14em] uppercase text-fg-muted">
              New to Virilion?
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            className="btn-outline-gold w-full"
            onClick={createAccount}
          >
            Create account
          </button>

          <button
            type="button"
            className="link-quiet text-xs w-full text-center pt-1"
            onClick={() => enter()}
          >
            Skip — enter as Traveler
          </button>
        </form>

        <p className="mt-8 text-[11px] text-fg-muted/85 text-center max-w-xs leading-relaxed">
          In-app RP home. One vessel. Fields are cosmetic — this build is labeled Demo.
        </p>
      </div>
    </div>
  );
}
