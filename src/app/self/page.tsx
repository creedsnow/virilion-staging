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

  return (
    <div className="space-y-4">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Identity</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Self</h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
          Public face = Vessel. Player = account settings. One vessel only.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="chip"
          data-active={tab === "vessel"}
          onClick={() => setTab("vessel")}
        >
          Vessel
        </button>
        <button
          type="button"
          className="chip"
          data-active={tab === "player"}
          onClick={() => setTab("player")}
        >
          Player
        </button>
      </div>

      {tab === "vessel" && (
        <div className="card stone-panel rounded-2xl space-y-3">
          {vessel ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-gold-soft">{vessel.name}</h2>
              <p className="text-sm text-fg capitalize">
                {peopleLabel} ·{" "}
                {vessel.style === "custom"
                  ? vessel.styleCustom
                  : STYLES.find((s) => s.id === vessel.style)?.name}{" "}
                ·{" "}
                {vessel.classId === "custom"
                  ? vessel.classCustom
                  : CLASSES.find((c) => c.id === vessel.classId)?.name}{" "}
                · {vessel.role}
              </p>
              <p className="text-xs text-fg-muted">
                Status: {vessel.status}
                {vessel.canCarry ? " · Open to Blessing" : ""}
              </p>
              {vessel.bio ? (
                <p className="text-sm text-fg-muted">{vessel.bio}</p>
              ) : null}
              <p className="text-xs text-fg-muted border-t border-border pt-3">
                No second vessel slot. No switcher. No paid CTA.
              </p>
              <p className="text-xs text-fg-muted">
                Wisp companion: pet panel later — not on Map/Scenes/showcase.
              </p>
              <p className="text-xs text-fg-muted">Marriage: Coming soon.</p>
            </>
          ) : (
            <p className="text-sm text-fg-muted">
              No vessel. <Link href="/rite" className="text-gold">Begin the Rite</Link>.
            </p>
          )}
        </div>
      )}

      {tab === "player" && (
        <div className="space-y-3">
          <div className="card space-y-2">
            <h2 className="font-medium text-fg">
              {player?.screenName || "Traveler"}{" "}
              <span className="demo-badge ml-2">Demo account</span>
            </h2>
            <p className="text-xs text-fg-muted">
              Demo Enter only. Real auth (magic-link shaped) ships later. RP chat and voice
              stay in-app.
            </p>
          </div>
          <div className="card space-y-2">
            <p className="label">Look</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="chip"
                data-active={theme === "dark"}
                onClick={() => setTheme("dark")}
              >
                Moonlight
              </button>
              <button
                type="button"
                className="chip"
                data-active={theme === "light"}
                onClick={() => setTheme("light")}
              >
                Parchment
              </button>
            </div>
            <p className="text-[11px] text-fg-muted">
              Dark is the app default — lamp & moonlight rich. Parchment is the magical cream option from the design demo.
            </p>
          </div>
          <Link href="/admin" className="card block hover:border-gold/40">
            <p className="text-sm font-medium text-fg">GM demo admin</p>
            <p className="text-xs text-fg-muted">Approve pending custom vessels</p>
          </Link>
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
      )}
    </div>
  );
}
