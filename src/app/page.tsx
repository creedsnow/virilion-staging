"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import {
  getPlayer,
  getPresence,
  getVessel,
  setPresence as persistPresence,
  type PresenceMode,
} from "@/lib/storage";
import type { DemoPlayer, Vessel } from "@/lib/types";
import { PEOPLES } from "@/lib/canon/peoples";
import { CLASSES } from "@/lib/canon/classes";
import { STYLES } from "@/lib/canon/styles";
import { DEMO_SCENES } from "@/lib/scenes";
import { COMING_UP } from "@/lib/events";

const WALKING = [
  {
    name: "Thorne",
    status: "in scene",
    presence: "scene" as const,
    hue: "#5a3d78",
    pip: "#c9a227",
    blurb: "Rival · lantern walk",
    sceneId: "virelios-lantern",
  },
  {
    name: "Ilyan",
    status: "open",
    presence: "open" as const,
    hue: "#3d5a80",
    pip: "#6b9fd4",
    blurb: "Looking for adventure",
  },
  {
    name: "Ryven",
    status: "open",
    presence: "open" as const,
    hue: "#6b3d4a",
    pip: "#6b8f71",
    blurb: "Open to bonds",
  },
  {
    name: "Auren",
    status: "open",
    presence: "open" as const,
    hue: "#3d6b58",
    pip: "#a78bfa",
    blurb: "Social · market lamps",
  },
  {
    name: "Halvard",
    status: "unseen",
    presence: "unseen" as const,
    hue: "#6b5a3d",
    pip: "#9a9488",
    blurb: "Unseen for now",
  },
  {
    name: "Brogar",
    status: "open",
    presence: "open" as const,
    hue: "#4a3d6b",
    pip: "#c9784a",
    blurb: "Looking for party",
  },
  {
    name: "Sen",
    status: "in scene",
    presence: "scene" as const,
    hue: "#3d5a58",
    pip: "#8b6bb8",
    blurb: "Moonshift watch",
    sceneId: "velkrath-moon",
  },
];


type Preview = {
  name: string;
  status: string;
  presence: PresenceMode;
  hue: string;
  pip: string;
  blurb: string;
  sceneId?: string;
} | null;

function presenceLabel(p: PresenceMode) {
  if (p === "scene") return "In scene";
  if (p === "unseen") return "Unseen";
  return "Open";
}

function presencePip(p: PresenceMode) {
  if (p === "scene") return "#c9a227";
  if (p === "unseen") return "#9a9488";
  return "#6b8f71";
}

export default function RealmPage() {
  const [vessel, setV] = useState<Vessel | null>(null);
  const [player, setP] = useState<DemoPlayer | null>(null);
  const [presence, setPresence] = useState<PresenceMode>("open");
  const [preview, setPreview] = useState<Preview>(null);

  useEffect(() => {
    setV(getVessel());
    setP(getPlayer());
    setPresence(getPresence());
  }, []);

  function changePresence(next: PresenceMode) {
    setPresence(next);
    persistPresence(next);
  }

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
    <div className="space-y-6 -mt-0.5">
      <div className="realm-hero-glow page-header">
        <p className="section-kicker mb-2">World feed</p>
        <h1 className="display-hero">
          The lamps of Virelios are lit, {firstName}.
        </h1>
      </div>

      {/* 1. Who am I — Vessel */}
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
            <span
              className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full border border-bg-card"
              style={{
                background: presencePip(presence),
                boxShadow: `0 0 8px ${presencePip(presence)}`,
              }}
              title={presenceLabel(presence)}
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
            <div className="mt-2.5 flex flex-wrap gap-2 items-center">
              <span className="pill-jewel">✦ Virelios · The Gilded Coil</span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-fg-muted">
                {presenceLabel(presence)}
              </span>
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
              onClick={() => changePresence(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Actionable asks + where to go */}
      <section className="realm-asks space-y-2">
        <Link href="/weave" className="realm-ask-row">
          <span className="min-w-0">
            <span className="section-kicker block mb-0.5">Asking for you</span>
            <span className="font-display text-lg text-fg leading-tight block">
              Two vessels wait on the Weave
            </span>
          </span>
          <span className="text-gold shrink-0 text-sm tracking-wide">Open →</span>
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/map" className="realm-ask-chip">
            <span className="section-kicker block mb-0.5">Where</span>
            <span className="font-display text-base text-fg">Map · Enter places</span>
          </Link>
          <Link href="/scenes" className="realm-ask-chip">
            <span className="section-kicker block mb-0.5">Scenes</span>
            <span className="font-display text-base text-fg">Live rooms</span>
          </Link>
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
          {/* Self presence in strip */}
          <button
            type="button"
            className="walk-card walk-card-tap"
            onClick={() =>
              setPreview({
                name: vessel.name,
                status: presenceLabel(presence).toLowerCase(),
                presence,
                hue: "#5a3d78",
                pip: presencePip(presence),
                blurb: "You · " + peopleLabel,
              })
            }
          >
            <div
              className="walk-avatar"
              style={{
                background:
                  "linear-gradient(160deg, color-mix(in srgb, var(--aura) 45%, #1a1028), #0e0c14 78%)",
              }}
            >
              <span
                className="walk-pip"
                style={{
                  background: presencePip(presence),
                  boxShadow: `0 0 8px ${presencePip(presence)}`,
                }}
              />
              <span className="walk-initial font-display" aria-hidden>
                {initial}
              </span>
              <span className="walk-name">You</span>
            </div>
            <p className="text-[11px] text-fg-muted mt-1.5 text-center leading-snug capitalize px-0.5">
              {presenceLabel(presence)}
            </p>
          </button>
          {WALKING.map((w) => (
            <button
              key={w.name}
              type="button"
              className="walk-card walk-card-tap"
              onClick={() => setPreview(w)}
            >
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
            </button>
          ))}
        </div>
        <p className="text-[10px] text-fg-muted/70 tracking-wide">
          Demo cast · tap a face for preview
        </p>
      </section>

      {/* Coming up */}
      <section className="space-y-3 feed-panel">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="section-serif text-fg">Coming up</h2>
          <Link
            href="/calendar"
            className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gold hover:text-gold-soft"
          >
            Calendar →
          </Link>
        </div>
        <div className="h-scroll">
          {COMING_UP.map((e) => (
            <Link
              key={e.title}
              href="/calendar"
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
            </Link>
          ))}
        </div>
      </section>

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

      {preview ? (
        <div
          className="vessel-preview-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={`${preview.name} preview`}
          onClick={() => setPreview(null)}
        >
          <div
            className="vessel-preview-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3.5 items-start">
              <div
                className="h-16 w-16 shrink-0 rounded-xl flex items-center justify-center font-display text-2xl font-semibold text-gold-soft border border-gold/25 relative"
                style={{
                  background: `linear-gradient(145deg, ${preview.hue}, #121018 75%)`,
                }}
                aria-hidden
              >
                {preview.name.charAt(0)}
                <span
                  className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-bg-card"
                  style={{ background: preview.pip }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="section-kicker mb-0.5">Vessel preview · demo</p>
                <h3 className="font-display text-xl font-semibold text-fg leading-tight">
                  {preview.name}
                </h3>
                <p className="text-sm text-fg-muted mt-1">{preview.blurb}</p>
                <p className="text-[10px] uppercase tracking-[0.12em] text-gold mt-2">
                  {presenceLabel(preview.presence)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {"sceneId" in preview && preview.sceneId ? (
                <Link
                  href="/scenes"
                  className="btn-gold text-sm py-2 px-4 !min-h-0"
                  onClick={() => setPreview(null)}
                >
                  Open scenes
                </Link>
              ) : null}
              <Link
                href="/weave"
                className="btn-ghost text-sm py-2 px-4 !min-h-0"
                onClick={() => setPreview(null)}
              >
                Weave
              </Link>
              <button
                type="button"
                className="btn-ghost text-sm py-2 px-4 !min-h-0"
                onClick={() => setPreview(null)}
              >
                Close
              </button>
            </div>
            {!("sceneId" in preview) || !preview.sceneId ? (
              <p className="text-[10px] text-fg-muted mt-3">
                Full showcase ships next cycle · demo cast only
              </p>
            ) : (
              <p className="text-[10px] text-fg-muted mt-3">
                Linked scene:{" "}
                {DEMO_SCENES.find((s) => s.id === preview.sceneId)?.title || "room"}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
