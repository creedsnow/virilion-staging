"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { getPlayer, getVessel } from "@/lib/storage";
import type { DemoPlayer, Vessel } from "@/lib/types";
import { PEOPLES } from "@/lib/canon/peoples";
import { CLASSES } from "@/lib/canon/classes";
import { STYLES } from "@/lib/canon/styles";

export default function RealmPage() {
  const [vessel, setV] = useState<Vessel | null>(null);
  const [player, setP] = useState<DemoPlayer | null>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <p className="section-kicker">Realm</p>
        <h1 className="text-2xl font-semibold text-fg mt-1">
          Welcome, {vessel.name}
        </h1>
        <p className="text-sm text-fg-muted mt-1">
          Calm presence — not a firehose.
        </p>
      </div>

      {/* Who am I? */}
      <section className="card space-y-2 stone-panel rounded-2xl">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="section-kicker mb-1">Who am I?</p>
            <h2 className="font-medium text-gold-soft text-lg">{vessel.name}</h2>
          </div>
          {vessel.status === "pending_gm" ? (
            <span className="text-[10px] uppercase tracking-wide text-gold border border-gold/40 rounded-full px-2 py-0.5">
              Pending GM
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wide text-ok border border-ok/40 rounded-full px-2 py-0.5">
              Embodied
            </span>
          )}
        </div>
        <p className="text-sm text-fg">
          {peopleLabel} · {styleLabel} · {classLabel} ·{" "}
          <span className="capitalize">{vessel.role}</span>
        </p>
        <p className="text-xs text-fg-muted">
          Player: {player?.screenName || "Traveler"}
          {vessel.canCarry ? " · Open to Blessing" : ""}
        </p>
        {vessel.bio ? (
          <p className="text-sm text-fg-muted leading-relaxed pt-1 border-t border-border/60">
            {vessel.bio}
          </p>
        ) : null}
      </section>

      {/* What's happening? */}
      <section className="card space-y-3">
        <h2 className="section-kicker">What&apos;s happening?</h2>
        <ul className="space-y-3 text-sm text-fg-muted">
          <li className="flex gap-2">
            <span className="text-gold shrink-0 mt-0.5">◆</span>
            <span>
              Lanterns warm along Virelios Market — two vessels open for stroll RP.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold shrink-0 mt-0.5">◆</span>
            <span>Velkrath Wood: moon high. Lycan welcome without passport.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-fg-muted/50 shrink-0 mt-0.5">◇</span>
            <span className="text-fg-muted/80">
              Marriage rites: <em>Coming soon</em> (any two vessels, different players).
            </span>
          </li>
        </ul>
      </section>

      {/* Where can I go? */}
      <section className="space-y-3">
        <h2 className="section-kicker">Where can I go?</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/map"
            className="card hover:border-gold/40 transition min-h-[5.5rem] flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-fg">Map</p>
            <p className="text-xs text-fg-muted mt-1">One world, color regions</p>
          </Link>
          <Link
            href="/scenes"
            className="card hover:border-gold/40 transition min-h-[5.5rem] flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-fg">Scenes</p>
            <p className="text-xs text-fg-muted mt-1">In-app RP rooms + voice</p>
          </Link>
          <Link
            href="/weave"
            className="card hover:border-gold/40 transition min-h-[5.5rem] flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-fg">Weave</p>
            <p className="text-xs text-fg-muted mt-1">Bonds & constellation</p>
          </Link>
          <Link
            href="/dice"
            className="card hover:border-gold/40 transition min-h-[5.5rem] flex flex-col justify-center"
          >
            <p className="text-sm font-medium text-fg">d20</p>
            <p className="text-xs text-fg-muted mt-1">Premium dice ritual</p>
          </Link>
        </div>
      </section>

      {/* What next? */}
      <section className="card space-y-3">
        <h2 className="section-kicker">What next?</h2>
        <div className="flex flex-col gap-2">
          <Link href="/scenes" className="btn-gold text-center text-sm">
            Join a scene
          </Link>
          <Link href="/self" className="btn-ghost text-center text-sm">
            Review Self · Vessel | Player
          </Link>
        </div>
      </section>
    </div>
  );
}
