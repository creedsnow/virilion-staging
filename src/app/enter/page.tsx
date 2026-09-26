"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { clearSession, getPlayer, getVessel, setPlayer } from "@/lib/storage";

export default function EnterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alreadyIn, setAlreadyIn] = useState(false);

  useEffect(() => {
    setAlreadyIn(!!getPlayer());
  }, []);

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

  function logout() {
    clearSession();
    setAlreadyIn(false);
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="night-sky enter-sky -mx-4 min-h-[100dvh] px-5 py-12 flex flex-col items-center justify-center relative">
      <div className="relative z-[1] w-full max-w-[20.5rem] flex flex-col items-center">
        <div className="relative mb-6">
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

        <h1 className="display-title display-title-enter mb-1">Virilion</h1>
        <p className="display-italic text-[1.15rem] mb-2 text-gold-soft">
          Enter Virilion
        </p>
        <p className="text-[11px] tracking-[0.14em] uppercase text-fg-muted/85 text-center mb-8 leading-relaxed max-w-[17rem]">
          Adult queer mythic fantasy · one vessel · in-app home
        </p>

        {alreadyIn ? (
          <div className="w-full space-y-3 mb-5 text-center">
            <p className="text-sm text-fg-muted leading-relaxed">
              You still have a saved demo session in this browser.
            </p>
            <button type="button" className="btn-ghost w-full" onClick={logout}>
              Log out · start over
            </button>
          </div>
        ) : null}

        <form onSubmit={enter} className="enter-form w-full">
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
                placeholder="Screen name or email"
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
                placeholder="Optional in demo"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="btn-gold btn-enter w-full">
            Enter Virilion
          </button>
          <p className="enter-demo-note">Demo — no password needed</p>

          <button
            type="button"
            className="enter-secondary"
            onClick={createAccount}
          >
            New here? Begin the Rite
          </button>
        </form>

        <p className="mt-9 text-[11px] text-fg-muted/75 text-center max-w-xs leading-relaxed">
          Adult portal · present as your Vessel. RP chat and voice live here.
        </p>
      </div>
    </div>
  );
}
