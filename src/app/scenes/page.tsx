"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { SceneRoom } from "@/components/SceneRoom";
import { DEMO_SCENES, type SceneInfo } from "@/lib/scenes";
import { getVessel } from "@/lib/storage";
import type { Vessel } from "@/lib/types";

function LampSeal() {
  return (
    <span className="scene-lamp-seal" aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 3h6M10 3v2h4V3M8 7h8l1 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V10l1-3Z"
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinejoin="round"
        />
        <path
          d="M12 10v5"
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function ScenesInner() {
  const search = useSearchParams();
  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [active, setActive] = useState<SceneInfo | null>(null);
  const [openVoice, setOpenVoice] = useState(false);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    setVessel(getVessel());
    setBooted(true);
  }, []);

  useEffect(() => {
    if (!booted || !vessel) return;
    const openId = search.get("open");
    if (!openId) return;
    const match = DEMO_SCENES.find((s) => s.id === openId);
    if (match) {
      setOpenVoice(false);
      setActive(match);
    }
  }, [booted, vessel, search]);

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
      <SceneRoom
        scene={active}
        vessel={vessel}
        onBack={() => {
          setActive(null);
          setOpenVoice(false);
        }}
        autoJoinVoice={openVoice}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="scenes-hero">
        <div className="scenes-hero-sheen" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-kicker mb-1">In-app RP · Chambers</p>
          <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
            Where the story is{" "}
            <span className="display-italic text-[1.05em]">happening</span>
          </h1>
          <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
            Step inside a room as your Vessel. Join call lives inside the chamber —
            same place, voice when you want it.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {DEMO_SCENES.map((s) => (
          <li key={s.id}>
            <article className="scene-card">
              <div className="scene-card-accent" aria-hidden />
              <div className="scene-card-glow" aria-hidden />
              <div className="relative z-[1] flex gap-3 items-start">
                <LampSeal />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3 items-start">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-gold font-semibold mb-1">
                        ✦ {s.place}
                      </p>
                      <h2 className="font-display text-xl font-semibold text-fg leading-tight">
                        {s.title}
                      </h2>
                      <p className="text-sm text-fg-muted mt-2 leading-relaxed">
                        {s.vibe}
                      </p>
                    </div>
                    <span className="scene-seat shrink-0">{s.seats}</span>
                  </div>
                  <div className="mt-3.5 flex gap-2">
                    <button
                      type="button"
                      className="scene-step"
                      onClick={() => {
                        setOpenVoice(false);
                        setActive(s);
                      }}
                    >
                      Step inside
                    </button>
                    <button
                      type="button"
                      className="scene-call-hint"
                      onClick={() => {
                        setOpenVoice(true);
                        setActive(s);
                      }}
                    >
                      Voice inside
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ScenesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-fg-muted">Opening scenes…</p>}>
      <ScenesInner />
    </Suspense>
  );
}
