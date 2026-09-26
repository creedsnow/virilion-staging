"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { SceneRoom } from "@/components/SceneRoom";
import { DEMO_SCENES, type SceneInfo } from "@/lib/scenes";
import { getVessel } from "@/lib/storage";
import type { Vessel } from "@/lib/types";

export default function ScenesPage() {
  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [active, setActive] = useState<SceneInfo | null>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    setVessel(getVessel());
    setBooted(true);
  }, []);

  if (!booted) {
    return <p className="text-sm text-fg-muted">Opening scenes…</p>;
  }

  if (!vessel) {
    return (
      <EmptyState
        title="No vessel yet"
        body="Complete the Rite of Making to join scenes as your Vessel."
        action={
          <Link href="/rite" className="btn-gold inline-flex">
            Begin the Rite
          </Link>
        }
      />
    );
  }

  if (active) {
    return (
      <SceneRoom scene={active} vessel={vessel} onBack={() => setActive(null)} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rite-hero">
        <p className="section-kicker mb-1">In-app RP</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Where the story is{" "}
          <span className="display-italic text-[1.05em]">happening</span>
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
          Discover live rooms → open text RP here. Join call opens in-app voice —
          never leaves Virilion. No Discord-as-home.
        </p>
      </div>

      <ul className="space-y-3">
        {DEMO_SCENES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="scene-card w-full text-left"
              onClick={() => setActive(s)}
            >
              <div className="scene-card-glow" aria-hidden />
              <div className="relative z-[1] flex justify-between gap-3 items-start">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
                    ✦ {s.place}
                  </p>
                  <h2 className="font-display text-xl font-semibold text-fg leading-tight">
                    {s.title}
                  </h2>
                  <p className="text-sm text-fg-muted mt-2 leading-relaxed">{s.vibe}</p>
                  <p className="text-[11px] text-fg-muted mt-2">
                    Text in-app · Voice via Join call
                  </p>
                </div>
                <span className="scene-seat shrink-0">{s.seats}</span>
              </div>
              <div className="relative z-[1] mt-3.5 flex gap-2">
                <span className="scene-step">Step inside</span>
                <span className="scene-call-hint">Join call · in-app</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
