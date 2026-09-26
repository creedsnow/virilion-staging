"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { SceneRoom } from "@/components/SceneRoom";
import { DEMO_SCENES, type SceneInfo } from "@/lib/scenes";
import { getVessel } from "@/lib/storage";
import type { Vessel } from "@/lib/types";

export default function ScenesPage() {
  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [active, setActive] = useState<SceneInfo | null>(null);

  useEffect(() => {
    setVessel(getVessel());
  }, []);

  if (!vessel) {
    return (
      <EmptyState
        title="No vessel yet"
        body="Complete the Rite of Making to join scenes as your Vessel."
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
      <div>
        <p className="section-kicker mb-1">In-app RP</p>
        <h1 className="text-2xl font-semibold text-fg">Scenes</h1>
        <p className="text-sm text-fg-muted mt-1 leading-relaxed">
          Discover live rooms → open text RP here. Join call opens in-app voice —
          never leaves Virilion.
        </p>
      </div>
      <ul className="space-y-3">
        {DEMO_SCENES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="card w-full text-left hover:border-gold/50 transition stone-panel rounded-2xl min-h-[5.5rem]"
              onClick={() => setActive(s)}
            >
              <div className="flex justify-between gap-3 items-start">
                <div className="min-w-0">
                  <h2 className="font-medium text-fg">{s.title}</h2>
                  <p className="text-xs text-gold/90 mt-0.5 tracking-wide">{s.place}</p>
                  <p className="text-sm text-fg-muted mt-2 leading-relaxed">{s.vibe}</p>
                </div>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-ok border border-ok/40 rounded-full px-2 py-0.5">
                  {s.seats}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
