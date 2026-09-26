"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PEOPLES } from "@/lib/canon/peoples";
import { CLASSES } from "@/lib/canon/classes";
import { STYLES } from "@/lib/canon/styles";
import { useTheme } from "@/components/ThemeProvider";
import {
  clearSession,
  getPlayer,
  getVessel,
  wipeVesselForDemo,
} from "@/lib/storage";
import type { DemoPlayer, Vessel } from "@/lib/types";

function roleLabel(role: string) {
  if (role === "top") return "Top";
  if (role === "bottom") return "Bottom";
  if (role === "verse") return "Verse";
  return role;
}

export default function SelfPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<"vessel" | "player">("vessel");
  const [vessel, setV] = useState<Vessel | null>(null);
  const [player, setP] = useState<DemoPlayer | null>(null);

  useEffect(() => {
    setV(getVessel());
    setP(getPlayer());
  }, []);

  function logout() {
    clearSession();
    router.replace("/enter");
  }

  const peopleLabel = vessel
    ? vessel.people === "custom"
      ? vessel.peopleCustom || "Custom"
      : PEOPLES.find((p) => p.id === vessel.people)?.name || vessel.people
    : "";
  const styleLabel = vessel
    ? vessel.style === "custom"
      ? vessel.styleCustom || "Custom"
      : STYLES.find((s) => s.id === vessel.style)?.name || vessel.style
    : "";
  const classLabel = vessel
    ? vessel.classId === "custom"
      ? vessel.classCustom || "Custom"
      : CLASSES.find((c) => c.id === vessel.classId)?.name || vessel.classId
    : "";
  const initial = vessel?.name.trim().charAt(0).toUpperCase() || "V";

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
              <section className="card stone-panel self-vessel-card rounded-2xl space-y-4 relative overflow-hidden">
                <span className="vessel-watermark" aria-hidden>
                  V
                </span>
                <div className="flex gap-4 items-start relative z-[1]">
                  <div
                    className="self-portrait"
                    style={{
                      background:
                        "linear-gradient(145deg, color-mix(in srgb, var(--aura) 48%, #1a1028), #121018 75%)",
                    }}
                    aria-hidden
                  >
                    <span className="relative z-[1] font-display text-[2.1rem] font-semibold text-gold-soft">
                      {initial}
                    </span>
                    <span className="self-portrait-sheen" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="section-kicker mb-1">Your vessel</p>
                    <h2 className="font-display text-[1.65rem] font-semibold text-gold-soft leading-tight">
                      {vessel.name}
                    </h2>
                    <p className="text-sm text-fg-muted mt-1 leading-snug">
                      {peopleLabel} · {styleLabel} · {classLabel} · {roleLabel(vessel.role)}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <span className="pill-jewel">✦ Virelios · The Gilded Coil</span>
                      {vessel.status === "pending_gm" ? (
                        <span className="text-[10px] uppercase tracking-wide text-gold border border-gold/40 rounded-full px-2 py-0.5">
                          Pending GM
                        </span>
                      ) : (
                        <span className="pill-ok">✦ Embodied</span>
                      )}
                    </div>
                  </div>
                </div>

                {vessel.bio ? (
                  <p className="text-sm text-fg-muted leading-relaxed border-t border-border/55 pt-3 relative z-[1]">
                    {vessel.bio}
                  </p>
                ) : (
                  <p className="text-sm text-fg-muted/80 italic border-t border-border/55 pt-3 relative z-[1]">
                    No public bio yet — calm presence first.
                  </p>
                )}

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
                    <p className="label mb-0.5">Status</p>
                    <p className="text-sm text-fg font-medium capitalize">
                      {vessel.status.replace("_", " ")}
                    </p>
                  </div>
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
                    <span>Wisp companion: pet panel later — not on Map, Scenes, or showcase.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold shrink-0">✦</span>
                    <span>Marriage: Coming soon — any two vessels, eligibility locked.</span>
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
              Demo Enter only. Real auth (magic-link shaped) ships later. RP chat and voice stay
              in-app — this app is the home.
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

          <Link href="/admin" className="card stone-panel block rounded-2xl hover:border-gold/40 transition">
            <p className="section-kicker mb-1">GM tools</p>
            <p className="text-sm font-medium text-fg font-display text-lg">Demo admin</p>
            <p className="text-xs text-fg-muted mt-0.5">Approve pending custom vessels</p>
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
