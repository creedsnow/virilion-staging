"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { getPlayer, getVessel } from "@/lib/storage";
import type { DemoPlayer, Vessel } from "@/lib/types";
import { PEOPLES } from "@/lib/canon/peoples";
import { CLASSES } from "@/lib/canon/classes";
import { STYLES } from "@/lib/canon/styles";

const WALKING = [
  { name: "Thorne", status: "in scene", hue: "#5a3d78", pip: "#c9a227" },
  { name: "Ilyan", status: "looking for adventure", hue: "#3d5a80", pip: "#6b9fd4" },
  { name: "Ryven", status: "open", hue: "#6b3d4a", pip: "#6b8f71" },
  { name: "Auren", status: "social", hue: "#3d6b58", pip: "#a78bfa" },
  { name: "Halvard", status: "questing", hue: "#6b5a3d", pip: "#e4a574" },
  { name: "Brogar", status: "looking for party", hue: "#4a3d6b", pip: "#c9784a" },
  { name: "Sen", status: "in scene", hue: "#3d5a58", pip: "#8b6bb8" },
];

const COMING_UP = [
  {
    when: "Tonight · 8 PM",
    title: "Lamps of the Coil — open tavern night",
    place: "Virelios · The Gilded Coil",
    accent: "#c9784a",
  },
  {
    when: "Tonight · 9:30 PM",
    title: "Moonrise Duel — fourth bout",
    place: "Cassanova · arena night",
    accent: "#b84a5a",
  },
  {
    when: "Tomorrow · 7 PM",
    title: "Ashfall watch — session circle",
    place: "Velkrath Wood · border lamps",
    accent: "#5a8fc4",
  },
  {
    when: "Tomorrow · 10 PM",
    title: "Night hunt under the black canopy",
    place: "Velkrath Wood",
    accent: "#8b6bb8",
  },
];

type Presence = "open" | "scene" | "unseen";

export default function RealmPage() {
  const [vessel, setV] = useState<Vessel | null>(null);
  const [player, setP] = useState<DemoPlayer | null>(null);
  const [presence, setPresence] = useState<Presence>("open");

  useEffect(() => {
    setV(getVessel());
    setP(getPlayer());
  }, []);

  if (!vessel) {
    return (
      <EmptyState
        title="The Realm awaits"
        body="Finish the Rite of Making to embody your one Vessel, then return here for calm presence."
        action={
          <Link href="/rite" className="btn-gold">
            Begin Rite
          </Link>
        }
      />
    );
  }

  const firstName = vessel.name.split(/\s+/)[0] || vessel.name;
  const peopleLabel =
    vessel.people === "custom"
      ? vessel.peopleCustom || "Custom"
      : PEOPLES.find((p) => p.id === vessel.people)?.name || vessel.people;
  const styleLabel =
    vessel.style === "custom"
      ? vessel.styleCustom || "Custom"
      : STYLES.find((s) => s.id === vessel.style)?.name || vessel.style;
  const classLabel =
    vessel.classId === "custom"
      ? vessel.classCustom || "Custom"
      : CLASSES.find((c) => c.id === vessel.classId)?.name || vessel.classId;
  const initial = vessel.name.trim().charAt(0).toUpperCase() || "V";

  return (
    <div className="space-y-7 -mt-0.5">
      <div className="realm-hero-glow page-header">
        <p className="section-kicker mb-2">World feed</p>
        <h1 className="display-hero">
          The lamps of Virelios are lit, {firstName}.
        </h1>
        <p className="text-sm text-fg-muted mt-2.5 leading-relaxed max-w-md">
          Eight of your bonds walk the world tonight. Two are asking for you.
        </p>
      </div>

      {/* YOUR VESSEL */}
      <section className="card vessel-card vessel-card-glow rounded-2xl space-y-3.5 relative overflow-hidden">
        <span className="vessel-watermark" aria-hidden>
          V
        </span>
        <div className="flex gap-3.5 items-start relative z-[1]">
          <div
            className="h-[5.25rem] w-[5.25rem] shrink-0 rounded-[0.95rem] flex items-center justify-center text-[1.85rem] font-display font-semibold text-gold-soft border border-gold/25 relative overflow-hidden shadow-[0_0_24px_rgba(123,94,167,0.28)]"
            style={{
              background:
                "linear-gradient(145deg, color-mix(in srgb, var(--aura) 42%, #1a1028), #121018 72%)",
            }}
            aria-hidden
          >
            <span className="relative z-[1]">{initial}</span>
            <span
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, rgba(232,200,120,0.35), transparent 55%)",
              }}
            />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="section-kicker mb-1">Your vessel</p>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-[1.55rem] font-semibold text-fg leading-tight">
                {vessel.name}
              </h2>
              {vessel.status === "pending_gm" ? (
                <span className="text-[10px] uppercase tracking-wide text-gold border border-gold/40 rounded-full px-2 py-0.5 shrink-0">
                  Pending GM
                </span>
              ) : null}
            </div>
            <p className="text-sm text-fg-muted mt-0.5">
              {peopleLabel} · {classLabel} · {styleLabel}
            </p>
            <div className="mt-2.5">
              <span className="pill-jewel">✦ Virelios · The Gilded Coil</span>
            </div>
          </div>
        </div>

        {vessel.status === "pending_gm" ? (
          <div className="relative z-[1] border-t border-gold/30 pt-3 space-y-2">
            <p className="text-sm text-gold-soft font-medium">Awaiting GM approval</p>
            <p className="text-xs text-fg-muted leading-relaxed">
              Custom People / Style / Class needs a demo approve. Check status on Self, then open Admin.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/self" className="btn-ghost text-xs py-1.5 px-3 !min-h-0">
                Self status
              </Link>
              <Link href="/admin" className="btn-gold text-xs py-1.5 px-3 !min-h-0">
                Open /admin
              </Link>
            </div>
          </div>
        ) : null}

        {vessel.bio ? (
          <p className="text-sm text-fg-muted leading-relaxed border-t border-border/55 pt-3 relative z-[1]">
            {vessel.bio}
          </p>
        ) : null}

        <div className="seg-control relative z-[1]" role="group" aria-label="Presence">
          {(
            [
              ["open", "Open"],
              ["scene", "In scene"],
              ["unseen", "Unseen"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              data-active={presence === id}
              onClick={() => setPresence(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Walking now */}
      <section className="space-y-3 feed-panel">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="section-serif text-fg">Walking now</h2>
          <Link
            href="/weave"
            className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gold hover:text-gold-soft"
          >
            The Weave →
          </Link>
        </div>
        <div className="h-scroll">
          {WALKING.map((w) => (
            <div key={w.name} className="walk-card">
              <div
                className="walk-avatar"
                style={{
                  background: `linear-gradient(160deg, ${w.hue}, #0e0c14 78%)`,
                }}
              >
                <span
                  className="walk-pip"
                  style={{ background: w.pip, boxShadow: `0 0 8px ${w.pip}` }}
                />
                <span className="walk-initial font-display" aria-hidden>
                  {w.name.charAt(0)}
                </span>
                <span className="walk-name">{w.name}</span>
              </div>
              <p className="text-[11px] text-fg-muted mt-1.5 text-center leading-snug capitalize px-0.5">
                {w.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming up */}
      <section className="space-y-3 feed-panel">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="section-serif text-fg">Coming up</h2>
          <span
            className="text-[10px] font-semibold tracking-[0.14em] uppercase text-fg-muted/80"
            title="Calendar ships later"
          >
            Coming soon
          </span>
        </div>
        <div className="h-scroll">
          {COMING_UP.map((e) => (
            <article
              key={e.title}
              className="event-card"
              style={{ ["--accent" as string]: e.accent }}
            >
              <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-semibold">
                ✦ {e.when}
              </p>
              <p className="font-display text-[1.05rem] font-semibold text-fg mt-1.5 leading-snug">
                {e.title}
              </p>
              <p className="text-xs text-fg-muted mt-2">✦ {e.place}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Codex stub */}
      <Link href="/codex" className="codex-card group">
        <span className="codex-icon" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 4.5h9.5A2.5 2.5 0 0 1 18 7v13.5H8.5A2.5 2.5 0 0 0 6 22.5V4.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M6 4.5A2.5 2.5 0 0 0 3.5 7v13A2.5 2.5 0 0 1 6 17.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M9.5 9h6M9.5 12.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="section-kicker block">The World Codex</span>
          <span className="font-display text-lg text-fg leading-tight block mt-0.5">
            Everything known of Virilion
          </span>
        </span>
        <span className="text-fg-muted group-hover:text-gold text-lg transition" aria-hidden>
          ›
        </span>
      </Link>

      <p className="text-[11px] text-fg-muted/75 text-center pt-1">
        Player {player?.screenName || "Traveler"} · in-app home
      </p>
    </div>
  );
}
