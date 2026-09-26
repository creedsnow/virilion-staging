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

  return (
    <div className="night-sky -mx-4 -mt-4 min-h-[calc(100dvh-3.5rem)] px-4 py-10 flex flex-col items-center">
      <DemoBadge className="mb-6" />
      <Image
        src="/virilion-logo.png"
        alt="Virilion"
        width={160}
        height={160}
        className="mb-4 drop-shadow-[0_0_24px_rgba(201,162,39,0.35)]"
        priority
      />
      <h1 className="text-3xl font-semibold tracking-wide text-gold-soft mb-1">
        Virilion
      </h1>
      <p className="text-sm text-fg-muted mb-8 text-center max-w-xs">
        Adult queer mythic fantasy. One vessel. The world between Discord scenes.
      </p>

      <form onSubmit={enter} className="card w-full max-w-sm space-y-4 shadow-xl">
        <p className="text-center text-xs text-gold tracking-wide uppercase">
          Demo mode — no password needed
        </p>
        <div>
          <label className="label" htmlFor="screen">
            Screen name (optional)
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
            Email (cosmetic)
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Not validated in demo"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password (cosmetic)
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ignored in demo"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn-gold w-full">
          Enter Virilion
        </button>
        <p className="text-[11px] text-center text-fg-muted leading-relaxed">
          Demo Enter only. Magic-link shaped auth later; Discord OAuth optional — not required. This staging build is clearly labeled{" "}
          <strong className="text-gold">Demo</strong> — fields do nothing; Enter opens the portal.
        </p>
      </form>
    </div>
  );
}
