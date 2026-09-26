"use client";

import Link from "next/link";
import { PEOPLES } from "@/lib/canon/peoples";
import { CLASSES } from "@/lib/canon/classes";
import { ORDER_HALLS } from "@/lib/canon/orderHalls";
import { MAP_REGIONS } from "@/lib/canon/mapRegions";

export default function CodexPage() {
  const playableClasses = CLASSES.filter((c) => c.id !== "custom");

  return (
    <div className="space-y-6">
      <div className="rite-hero">
        <p className="section-kicker mb-1">World book · Demo spine</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          The World{" "}
          <span className="display-italic text-[1.05em]">Codex</span>
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
          Everything known of Virilion — peoples, classes, places, rules. Unwritten pages
          stay honest: Record incomplete.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Codex sections">
        {[
          ["#peoples", "Peoples"],
          ["#classes", "Classes"],
          ["#places", "Places"],
          ["#rules", "Rules"],
          ["#chronicle", "Chronicle"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="chip">
            {label}
          </a>
        ))}
      </nav>

      <section id="peoples" className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="section-serif">Fourteen Peoples</h2>
          <p className="text-[10px] uppercase tracking-wide text-fg-muted">No Veilborn</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PEOPLES.map((p) => (
            <div key={p.id} className="people-tile people-tile-rich">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-medium text-fg font-display">{p.name}</p>
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 border border-border/40"
                  style={{ background: p.mapColor }}
                  aria-hidden
                />
              </div>
              <p className="text-[11px] text-fg-muted mt-0.5">
                {p.cultureName} · {p.homeland}
              </p>
              <p className="text-xs text-fg-muted/90 mt-1.5 leading-snug">
                {p.racialAbility}
                {p.roleNote ? ` · ${p.roleNote}` : ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="classes" className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="section-serif">Classes</h2>
          <p className="text-[10px] uppercase tracking-wide text-fg-muted">
            {playableClasses.length} · Order Halls
          </p>
        </div>
        <ul className="space-y-2">
          {playableClasses.map((c) => {
            const hall = ORDER_HALLS.find((h) => h.name === c.orderHall);
            return (
              <li key={c.id}>
                <div className="codex-class-row">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold text-fg">{c.name}</p>
                    <p className="text-xs text-fg-muted mt-0.5 leading-snug">{c.blurb}</p>
                    <p className="text-[11px] text-gold-soft mt-1.5">
                      ✦ {c.orderHall}
                      {hall?.mapPlace ? ` · ${hall.mapPlace}` : ""}
                    </p>
                  </div>
                  <Link
                    href="/map"
                    className="text-[10px] uppercase tracking-[0.12em] text-gold shrink-0 hover:text-gold-soft"
                  >
                    Map →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] text-fg-muted leading-relaxed">
          Blood Hideaway is affliction-tied (vampires) — not a creation class. Afflictions:
          Coming soon.
        </p>
      </section>

      <section id="places" className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="section-serif">Places</h2>
          <Link
            href="/map"
            className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gold hover:text-gold-soft"
          >
            Open Map →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MAP_REGIONS.map((r) => (
            <Link key={r.id} href="/map" className="people-tile hover:border-gold/40 transition">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-fg font-display">{r.label}</p>
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 mt-1 border border-border/40"
                  style={{ background: r.color }}
                  aria-hidden
                />
              </div>
              <p className="text-[11px] text-fg-muted mt-0.5 capitalize">{r.kind}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="rules" className="space-y-3">
        <h2 className="section-serif">Rules</h2>
        <Link href="/rules" className="codex-card">
          <span className="codex-icon" aria-hidden>
            ☾
          </span>
          <span className="min-w-0">
            <span className="font-display text-xl font-semibold text-fg block">
              Rules · 21 locks
            </span>
            <span className="text-sm text-fg-muted mt-0.5 block">
              Community product rules · 21 locks.
            </span>
          </span>
        </Link>
        <Link href="/safety" className="codex-card">
          <span className="codex-icon" aria-hidden>
            ✦
          </span>
          <span className="min-w-0">
            <span className="font-display text-xl font-semibold text-fg block">Safety</span>
            <span className="text-sm text-fg-muted mt-0.5 block">
              Report · Block · consent reminder
            </span>
          </span>
        </Link>
      </section>

      <section id="chronicle" className="stub-panel px-4 py-4">
        <p className="section-kicker mb-1">Chronicle</p>
        <p className="font-display text-base text-fg">Coming soon</p>
        <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
          Record incomplete. No invented chronicles — official updates will land here.
        </p>
      </section>
    </div>
  );
}
