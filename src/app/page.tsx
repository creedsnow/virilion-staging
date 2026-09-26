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
  { name: "Thorne", status: "in scene", hue: "#5a3d78" },
  { name: "Ilyan", status: "looking for adventure", hue: "#3d5a80" },
  { name: "Ryven", status: "open", hue: "#6b3d4a" },
  { name: "Auren", status: "social", hue: "#3d6b58" },
  { name: "Halvard", status: "questing", hue: "#6b5a3d" },
];

const COMING_UP = [
  {
    when: "Tonight · 8 PM",
    title: "Lamps of the Coil — open tavern night",
    place: "Virelios · The Gilded Coil",
    accent: "#6b8f71",
  },
  {
    when: "Tomorrow · dusk",
    title: "Border watch at Velkrath Wood",
    place: "Velkrath · lycan welcome",
    accent: "#7a5ea8",
  },
  {
    when: "Coming soon",
    title: "Marriage rites open to any two vessels",
    place: "Eligibility locked · venues later",
    accent: "#b08a2a",
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
    <div className="space-y-6 -mt-1">
      <div>
        <h1 className="display-hero">
          The lamps of Virelios are lit, {firstName}.
        </h1>
        <p className="text-sm text-fg-muted mt-2 leading-relaxed">
          Eight of your bonds walk the world tonight. Two are asking for you.
          <span className="text-fg-muted/70"> (Demo stubs.)</span>
        </p>
      </div>

      {/* YOUR VESSEL */}
      <section className="card stone-panel rounded-2xl space-y-3 relative overflow-hidden">
        <p className="section-kicker">Your vessel</p>
        <div className="flex gap-3 items-start">
          <div
            className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-xl flex items-center justify-center text-2xl font-display font-semibold text-gold-soft border border-gold/30"
            style={{
              background:
                "linear-gradient(145deg, color-mix(in srgb, var(--aura) 35%, #1a1028), #121018)",
            }}
            aria-hidden
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-2xl font-semibold text-fg leading-tight">
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
            <p className="text-xs text-fg-muted mt-1 capitalize">
              {vessel.role}
              {vessel.canCarry ? " · Open to Blessing" : ""} · Player{" "}
              {player?.screenName || "Traveler"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="pill-jewel">✦ Virelios · The Gilded Coil</span>
        </div>

        {vessel.bio ? (
          <p className="text-sm text-fg-muted leading-relaxed border-t border-border/60 pt-3">
            {vessel.bio}
          </p>
        ) : null}

        <div className="seg-control" role="group" aria-label="Presence">
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
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="section-serif">Walking now</h2>
          <Link
            href="/weave"
            className="text-[10px] font-semibold tracking-[0.14em] uppercase text-fg-muted hover:text-gold"
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
                  background: `linear-gradient(160deg, ${w.hue}, #0e0c14 75%)`,
                }}
              >
                <span>{w.name}</span>
              </div>
              <p className="text-[11px] text-fg-muted mt-1.5 text-center leading-snug capitalize">
                {w.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming up */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="section-serif">Coming up</h2>
          <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-fg-muted">
            Calendar · soon
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
                {e.when}
              </p>
              <p className="font-display text-lg font-semibold text-fg mt-1 leading-snug">
                {e.title}
              </p>
              <p className="text-xs text-fg-muted mt-1.5">{e.place}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Where next — calm, honest */}
      <section className="space-y-3">
        <h2 className="section-serif">Where next</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/scenes"
            className="card hover:border-gold/40 transition min-h-[4.75rem] flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-fg">Scenes</p>
            <p className="text-xs text-fg-muted mt-1">In-app rooms + voice</p>
          </Link>
          <Link
            href="/map"
            className="card hover:border-gold/40 transition min-h-[4.75rem] flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-fg">Map</p>
            <p className="text-xs text-fg-muted mt-1">One world, color regions</p>
          </Link>
          <Link
            href="/dice"
            className="card hover:border-gold/40 transition min-h-[4.75rem] flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-fg">d20</p>
            <p className="text-xs text-fg-muted mt-1">Premium dice ritual</p>
          </Link>
          <Link
            href="/self"
            className="card hover:border-gold/40 transition min-h-[4.75rem] flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-fg">Self</p>
            <p className="text-xs text-fg-muted mt-1">Vessel · Player</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
