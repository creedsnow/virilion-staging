"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
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
    <div className="night-sky enter-sky -mx-4 min-h-[100dvh] px-5 py-10 flex flex-col items-center justify-center relative">
      <div className="relative z-[1] w-full max-w-[22rem] flex flex-col items-center">
        <div className="relative mb-6">
          <div
            className="absolute -inset-8 rounded-full blur-3xl opacity-80"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--aura) 60%, transparent), transparent 68%)",
            }}
            aria-hidden
          />
          <div className="relative rounded-[1.25rem] overflow-hidden border border-gold/20 shadow-[0_0_48px_rgba(123,94,167,0.4)]">
            <Image
              src="/virilion-logo.png"
              alt="Virilion"
              width={108}
              height={108}
              className="block"
              priority
            />
          </div>
        </div>

        <h1 className="display-title text-[1.85rem] mb-1.5 tracking-[0.22em]">
          Virilion
        </h1>
        <p className="display-italic text-[1.15rem] mb-9">Enter Virilion</p>

        <form onSubmit={enter} className="w-full space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email or screen name
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
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input enter-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="········"
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                className="text-[12px] font-display italic text-fg-muted hover:text-gold-soft"
                onClick={() => enter()}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button type="submit" className="btn-gold btn-enter w-full mt-2">
            Log in
          </button>
          <p className="text-center text-[11px] text-fg-muted -mt-0.5 leading-relaxed">
            Demo mode — no password needed
          </p>

          <div className="flex items-center gap-3 pt-4">
            <span className="h-px flex-1 bg-border/80" />
            <span className="text-[10px] tracking-[0.16em] uppercase text-fg-muted whitespace-nowrap">
              New to Virilion?
            </span>
            <span className="h-px flex-1 bg-border/80" />
          </div>

          <button
            type="button"
            className="btn-outline-gold btn-enter w-full"
            onClick={createAccount}
          >
            Create account
          </button>
        </form>

        <p className="mt-9 text-[11px] text-fg-muted/80 text-center max-w-xs leading-relaxed">
          In-app RP home. One vessel. Fields are cosmetic — this build is labeled Demo.
        </p>
      </div>
    </div>
  );
}
