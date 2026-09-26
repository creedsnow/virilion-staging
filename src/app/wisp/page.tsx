"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { WispPet } from "@/components/WispPet";
import type { WispLoop } from "@/lib/assets";

const CARE: { id: WispLoop; label: string; oneshot?: boolean }[] = [
  { id: "greet", label: "Greet" },
  { id: "pet", label: "Pet", oneshot: true },
  { id: "poke", label: "Poke", oneshot: true },
  { id: "notify", label: "Notify" },
];

export default function WispPage() {
  const [loop, setLoop] = useState<WispLoop>("idle");

  const onCare = useCallback((next: WispLoop) => {
    setLoop(next);
  }, []);

  const onSettled = useCallback((next: WispLoop) => {
    setLoop(next);
  }, []);

  return (
    <div className="space-y-5">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Companion</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Wisp
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
          Your quiet companion. Pet panel + notifications only — never on Map,
          Scenes, showcase, or roster.
        </p>
      </div>

      <section className="card stone-panel wisp-chamber rounded-2xl relative overflow-hidden">
        <div className="wisp-chamber-glow" aria-hidden />
        <div className="relative z-[1] flex flex-col items-center py-8 gap-4">
          <div className="wisp-orb wisp-orb--media" aria-hidden>
            <WispPet loop={loop} onLoopSettled={onSettled} size={96} />
          </div>
          <p className="font-display text-xl text-gold-soft">
            {loop === "idle"
              ? "A soft mote waits"
              : loop === "greet"
                ? "It brightens for you"
                : loop === "notify"
                  ? "A pulse of attention"
                  : loop === "pet"
                    ? "A gentle squeeze"
                    : "A playful bounce"}
          </p>
          <p className="text-xs text-fg-muted text-center max-w-xs leading-relaxed">
            Idle, greet, notify, pet, and poke loops from the Phase 1 pack.
            Reduced motion shows a still frame. Bond and treats ship later.
          </p>
        </div>
      </section>

      <section className="card stone-panel rounded-2xl space-y-3">
        <p className="section-kicker">Care</p>
        <div className="flex flex-wrap gap-2">
          {CARE.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              data-active={loop === c.id ? "true" : undefined}
              aria-pressed={loop === c.id}
              onClick={() => onCare(c.id)}
            >
              {c.label}
            </button>
          ))}
          <button type="button" className="chip opacity-70 cursor-not-allowed" disabled>
            Feed · Coming soon
          </button>
        </div>
        {loop !== "idle" ? (
          <button
            type="button"
            className="text-[11px] tracking-wide uppercase text-fg-muted hover:text-gold-soft"
            onClick={() => setLoop("idle")}
          >
            Return to idle
          </button>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/self" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          ← Self
        </Link>
        <Link href="/" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Realm
        </Link>
      </div>
    </div>
  );
}
