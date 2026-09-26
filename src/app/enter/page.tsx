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
    <div className="night-sky enter-sky -mx-4 min-h-[100dvh] px-5 py-12 flex flex-col items-center justify-center relative">
      <div className="relative z-[1] w-full max-w-[21.5rem] flex flex-col items-center">
        <div className="relative mb-7">
          <div
            className="absolute -inset-9 rounded-full blur-3xl opacity-75"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--aura) 58%, transparent), transparent 68%)",
            }}
            aria-hidden
          />
          <div className="relative rounded-[1.2rem] overflow-hidden border border-gold/25 shadow-[0_0_48px_rgba(123,94,167,0.38)]">
            <Image
              src="/virilion-logo.png"
              alt="Virilion"
              width={104}
              height={104}
              className="block"
              priority
            />
          </div>
        </div>

        <h1 className="display-title display-title-enter mb-1.5">Virilion</h1>
        <p className="display-italic text-[1.2rem] mb-2.5 text-gold-soft">
          Enter Virilion
        </p>
        <p className="text-[11px] tracking-[0.14em] uppercase text-fg-muted/90 text-center mb-9 leading-relaxed max-w-[17.5rem]">
          Adult queer mythic fantasy · one vessel · in-app home
        </p>

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
                className="text-[12px] font-display italic text-fg-muted hover:text-gold-soft underline underline-offset-2 decoration-border/80"
                onClick={() => enter()}
                title="Demo — no password recovery"
              >
                Skip · demo
              </button>
            </div>
          </div>

          <button type="submit" className="btn-gold btn-enter w-full mt-3">
            Log in
          </button>
          <p className="text-center text-[11px] text-gold/80 -mt-0.5 leading-relaxed tracking-wide">
            Demo — no password needed
          </p>

          <div className="flex items-center gap-3 pt-5">
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

        <p className="mt-10 text-[11px] text-fg-muted/80 text-center max-w-xs leading-relaxed">
          Adult portal · present as your Vessel. RP chat and voice live here.
        </p>
      </div>
    </div>
  );
}
