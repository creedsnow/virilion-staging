"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PEOPLES } from "@/lib/canon/peoples";
import { CLASSES } from "@/lib/canon/classes";
import { STYLES } from "@/lib/canon/styles";
import { ORDER_HALLS } from "@/lib/canon/orderHalls";
import { useTheme } from "@/components/ThemeProvider";
import {
  clearSession,
  getPlayer,
  getVessel,
  wipeVesselForDemo,
} from "@/lib/storage";
import type { DemoPlayer, PresenceMode, Vessel } from "@/lib/types";
import { usePresence } from "@/hooks/usePresence";

function roleLabel(role: string) {
  if (role === "top") return "Top";
  if (role === "bottom") return "Bottom";
  if (role === "verse") return "Verse";
  return role;
}

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

export default function SelfPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<"vessel" | "player">("vessel");
  const [vessel, setV] = useState<Vessel | null>(null);
  const [player, setP] = useState<DemoPlayer | null>(null);
  const [presence, changePresence] = usePresence();

  useEffect(() => {
    setV(getVessel());
    setP(getPlayer());
  }, []);

  function logout() {
    clearSession();
    router.replace("/enter");
  }

  const peopleMeta =
    vessel && vessel.people !== "custom"
      ? PEOPLES.find((p) => p.id === vessel.people)
      : undefined;
  const peopleLabel = vessel
    ? vessel.people === "custom"
      ? vessel.peopleCustom || "Custom"
      : peopleMeta?.name || vessel.people
    : "";
  const styleLabel = vessel
    ? vessel.style === "custom"
      ? vessel.styleCustom || "Custom"
      : STYLES.find((s) => s.id === vessel.style)?.name || vessel.style
    : "";
  const classMeta =
    vessel && vessel.classId !== "custom"
      ? CLASSES.find((c) => c.id === vessel.classId)
      : undefined;
  const classLabel = vessel
    ? vessel.classId === "custom"
      ? vessel.classCustom || "Custom"
      : classMeta?.name || vessel.classId
    : "";
  const hall =
    classMeta?.orderHall && classMeta.orderHall !== "—"
      ? ORDER_HALLS.find((h) => h.name === classMeta.orderHall) || {
          name: classMeta.orderHall,
          mapPlace: "",
          id: "",
        }
      : null;
  const initial = vessel?.name.trim().charAt(0).toUpperCase() || "V";
  const homeland = peopleMeta?.homeland;

  return (
    <div className="space-y-5">
      <div className="self-hero">
        <p className="section-kicker mb-1">Identity</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">Self</h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
          Public face is your Vessel. Player holds account look and settings. One vessel only.
        </p>
      </div>

      <div className="seg-control self-tabs" role="tablist" aria-label="Self panels">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "vessel"}
          data-active={tab === "vessel"}
          onClick={() => setTab("vessel")}
        >
          Vessel
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "player"}
          data-active={tab === "player"}
          onClick={() => setTab("player")}
        >
          Player
        </button>
      </div>

      {tab === "vessel" && (
        <div className="space-y-3">
          {vessel ? (
            <>
              <section className="card stone-panel self-vessel-card self-showcase rounded-2xl relative overflow-hidden">
                <span className="vessel-watermark" aria-hidden>
                  V
                </span>

                {/* Portrait stage */}
                <div className="self-showcase-stage relative z-[1]">
                  <div
                    className="self-portrait-lg"
                    style={{
                      background:
                        "linear-gradient(155deg, color-mix(in srgb, var(--aura) 52%, #1a1028), #0e0c14 78%)",
                    }}
                    aria-hidden
                  >
                    <span className="relative z-[1] font-display text-[3.4rem] font-semibold text-gold-soft leading-none">
                      {initial}
                    </span>
                    <span className="self-portrait-sheen" />
                    <span
                      className="self-presence-pip"
                      style={{
                        background: presencePip(presence),
                        boxShadow: `0 0 10px ${presencePip(presence)}`,
                      }}
                      title={presenceLabel(presence)}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="section-kicker mb-1">Your vessel</p>
                    <h2 className="font-display text-[1.85rem] font-semibold text-gold-soft leading-tight">
                      {vessel.name}
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-fg-muted mt-2">
                      {presenceLabel(presence)}
                      {vessel.status === "pending_gm" ? " · Pending GM" : " · Embodied"}
                    </p>
                  </div>
                </div>

                {/* People · Style · Class · Role */}
                <div className="self-meta-chips relative z-[1]">
                  <span className="self-meta-chip">{peopleLabel}</span>
                  <span className="self-meta-dot" aria-hidden>
                    ·
                  </span>
                  <span className="self-meta-chip">{styleLabel}</span>
                  <span className="self-meta-dot" aria-hidden>
                    ·
                  </span>
                  <span className="self-meta-chip">{classLabel}</span>
                  <span className="self-meta-dot" aria-hidden>
                    ·
                  </span>
                  <span className="self-meta-chip">{roleLabel(vessel.role)}</span>
                </div>

                {/* Order Hall */}
                {hall ? (
                  <Link
                    href="/map"
                    className="self-hall-chip relative z-[1]"
                    title={hall.mapPlace || hall.name}
                  >
                    <span className="text-gold" aria-hidden>
                      ✦
                    </span>
                    <span>
                      Order Hall · <strong className="text-fg font-medium">{hall.name}</strong>
                    </span>
                    <span className="text-fg-muted text-[10px] ml-auto shrink-0">Map →</span>
                  </Link>
                ) : vessel.classId === "custom" ? (
                  <p className="text-xs text-fg-muted relative z-[1]">
                    Custom class · Order Hall after GM approve
                  </p>
                ) : null}

                {/* Blessing / open-to */}
                <div className="self-stat-row relative z-[1]">
                  <div>
                    <p className="label mb-0.5">Role</p>
                    <p className="text-sm text-fg font-medium">{roleLabel(vessel.role)}</p>
                  </div>
                  <div>
                    <p className="label mb-0.5">Blessing</p>
                    <p className="text-sm text-fg font-medium">
                      {vessel.canCarry ? "Open to carry" : "Not carrying"}
                    </p>
                  </div>
                  <div>
                    <p className="label mb-0.5">Open to</p>
                    <p className="text-sm text-fg font-medium">
                      {presenceLabel(presence)}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {vessel.bio ? (
                  <p className="text-sm text-fg-muted leading-relaxed border-t border-border/55 pt-3 relative z-[1]">
                    {vessel.bio}
                  </p>
                ) : (
                  <p className="text-sm text-fg-muted/80 italic border-t border-border/55 pt-3 relative z-[1]">
                    No public bio yet — calm presence first.
                  </p>
                )}

                {/* Presence control */}
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

                {/* Compact access notes */}
                <div className="self-access relative z-[1]">
                  <p className="label mb-1.5">Where he may go</p>
                  <ul className="space-y-1 text-xs text-fg-muted leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-gold shrink-0">✦</span>
                      <span>Virelios · open hub (all Peoples)</span>
                    </li>
                    {homeland ? (
                      <li className="flex gap-2">
                        <span className="text-gold shrink-0">✦</span>
                        <span>Homeland · {homeland}</span>
                      </li>
                    ) : null}
                    {hall?.mapPlace ? (
                      <li className="flex gap-2">
                        <span className="text-gold shrink-0">✦</span>
                        <span>Hall · {hall.mapPlace}</span>
                      </li>
                    ) : null}
                    <li className="flex gap-2">
                      <span className="text-gold shrink-0">✦</span>
                      <span>Border Pass · class / People gates on Map</span>
                    </li>
                  </ul>
                </div>

                {vessel.status === "pending_gm" ? (
                  <div className="relative z-[1] border-t border-gold/30 pt-3 space-y-2">
                    <p className="text-sm text-gold-soft font-medium">Next step · GM approve</p>
                    <p className="text-xs text-fg-muted leading-relaxed">
                      Custom selection is waiting. Open demo Admin to Approve (embodies the vessel)
                      or Reject / clear (demo stub — re-Rite after).
                    </p>
                    <Link href="/admin" className="btn-gold text-xs py-2 px-3 inline-flex !min-h-0">
                      Open /admin
                    </Link>
                  </div>
                ) : null}
              </section>

              <section className="card stone-panel rounded-2xl space-y-2.5">
                <p className="section-kicker">World & tools</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/inbox" className="realm-ask-chip">
                    <span className="section-kicker block mb-0.5">Whispers</span>
                    <span className="font-display text-base text-fg">Inbox</span>
                  </Link>
                  <Link href="/safety" className="realm-ask-chip">
                    <span className="section-kicker block mb-0.5">Care</span>
                    <span className="font-display text-base text-fg">Safety</span>
                  </Link>
                  <Link href="/calendar" className="realm-ask-chip">
                    <span className="section-kicker block mb-0.5">When</span>
                    <span className="font-display text-base text-fg">Coming up</span>
                  </Link>
                  <Link href="/codex" className="realm-ask-chip">
                    <span className="section-kicker block mb-0.5">Lore</span>
                    <span className="font-display text-base text-fg">Codex</span>
                  </Link>
                  <Link href="/guilds" className="realm-ask-chip">
                    <span className="section-kicker block mb-0.5">Founding</span>
                    <span className="font-display text-base text-fg">Guilds</span>
                  </Link>
                  <Link href="/shop" className="realm-ask-chip">
                    <span className="section-kicker block mb-0.5">Moonmarket</span>
                    <span className="font-display text-base text-fg">Shop</span>
                  </Link>
                </div>
              </section>

              <section className="card stone-panel rounded-2xl space-y-2.5">
                <p className="section-kicker">Locks</p>
                <ul className="space-y-2 text-sm text-fg-muted leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-gold shrink-0">✦</span>
                    <span>One vessel. No second slot, no switcher, no paid CTA.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold shrink-0">✦</span>
                    <span>Marriage: Coming soon — any two vessels.</span>
                  </li>
                </ul>
              </section>
            </>
          ) : (
            <div className="card stone-panel rounded-2xl space-y-3">
              <p className="section-kicker">No vessel yet</p>
              <p className="text-sm text-fg-muted leading-relaxed">
                Finish the Rite of Making to embody your one Vessel.
              </p>
              <Link href="/rite" className="btn-gold inline-flex justify-center">
                Begin the Rite
              </Link>
            </div>
          )}
        </div>
      )}

      {tab === "player" && (
        <div className="space-y-3">
          <section className="card stone-panel rounded-2xl space-y-2.5">
            <p className="section-kicker">Account</p>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-fg">
                {player?.screenName || "Traveler"}
              </h2>
              <span className="demo-badge shrink-0">Demo account</span>
            </div>
            <p className="text-xs text-fg-muted leading-relaxed">
              Demo Enter only. Real auth ships later. Chat and voice stay here.
            </p>
          </section>

          <section className="card stone-panel rounded-2xl space-y-3">
            <p className="section-kicker">Look</p>
            <p className="text-sm text-fg-muted leading-relaxed -mt-1">
              Moonlight is the default. Parchment is the warm cream option from the design demo.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="chip"
                data-active={theme === "dark"}
                onClick={() => setTheme("dark")}
              >
                ✦ Moonlight
              </button>
              <button
                type="button"
                className="chip"
                data-active={theme === "light"}
                onClick={() => setTheme("light")}
              >
                ✦ Parchment
              </button>
            </div>
          </section>

          <Link href="/safety" className="card stone-panel block rounded-2xl hover:border-gold/40 transition">
            <p className="section-kicker mb-1">Care</p>
            <p className="text-sm font-medium text-fg font-display text-lg">Safety & Rules</p>
            <p className="text-xs text-fg-muted mt-0.5">
              Report · Block · consent · 21 locks
            </p>
          </Link>

          <Link href="/rules" className="card stone-panel block rounded-2xl hover:border-gold/40 transition">
            <p className="section-kicker mb-1">Community</p>
            <p className="text-sm font-medium text-fg font-display text-lg">Rules · 21 locks</p>
            <p className="text-xs text-fg-muted mt-0.5">
              Product rules · 21 locks
            </p>
          </Link>

          <Link href="/admin" className="card stone-panel block rounded-2xl hover:border-gold/40 transition">
            <p className="section-kicker mb-1">GM tools</p>
            <p className="text-sm font-medium text-fg font-display text-lg">Demo admin</p>
            <p className="text-xs text-fg-muted mt-0.5">Approve or Reject / clear pending vessels</p>
          </Link>

          <div className="pt-1 space-y-2">
            <button type="button" className="btn-ghost w-full" onClick={logout}>
              Log out → Enter
            </button>
            <button
              type="button"
              className="btn-ghost w-full text-danger border-danger/40"
              onClick={() => {
                if (
                  confirm(
                    "Wipe this demo vessel? You can forge again. One-vessel lock still applies while a vessel exists."
                  )
                ) {
                  wipeVesselForDemo();
                  setV(null);
                  router.replace("/rite");
                }
              }}
            >
              Demo: wipe vessel & re-Rite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
