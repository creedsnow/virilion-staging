"use client";

import Link from "next/link";
import { PEOPLES } from "@/lib/canon/peoples";

const SECTIONS = [
  {
    href: "/rules",
    title: "Rules · 21 locks",
    blurb: "Community product rules — in-app.",
    glyph: "☾",
  },
  {
    href: "/map",
    title: "World & places",
    blurb: "One vast world — map colour regions.",
    glyph: "◈",
  },
  {
    href: "/codex#peoples",
    title: "Fourteen Peoples",
    blurb: "Canon peoples, gates, and customs.",
    glyph: "◇",
  },
  {
    href: "/scenes",
    title: "Scenes & halls",
    blurb: "Live rooms stay in-app.",
    glyph: "✦",
  },
  {
    href: "/weave",
    title: "The Weave",
    blurb: "Bonds asking for you tonight.",
    glyph: "❧",
  },
];

export default function CodexPage() {
  return (
    <div className="space-y-5">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Lore · Demo stub</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          The World{" "}
          <span className="display-italic text-[1.05em]">Codex</span>
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
          Everything known of Virilion — peoples, classes, places, chronicle. Full art
          codex ships later; this staging build keeps the spine honest.
        </p>
      </div>

      <ul className="space-y-3">
        {SECTIONS.map((s) => (
          <li key={s.title}>
            <Link href={s.href} className="codex-card">
              <span className="codex-icon" aria-hidden>
                {s.glyph}
              </span>
              <span className="min-w-0">
                <span className="font-display text-xl font-semibold text-fg block">
                  {s.title}
                </span>
                <span className="text-sm text-fg-muted mt-0.5 block">{s.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section id="peoples" className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="section-serif">Fourteen Peoples</h2>
          <p className="text-[10px] uppercase tracking-wide text-fg-muted">
            No Veilborn
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PEOPLES.map((p) => (
            <div key={p.id} className="people-tile">
              <p className="text-sm font-medium text-fg font-display">{p.name}</p>
              <p className="text-[11px] text-fg-muted mt-0.5 line-clamp-2">
                {p.cultureName} · {p.homeland}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="stub-panel px-4 py-4">
        <p className="section-kicker mb-1">Coming soon</p>
        <p className="font-display text-base text-fg">Classes · places art · chronicle</p>
        <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
          Spine only for now. Canon locks stay; no invented lore pages.
        </p>
      </div>
    </div>
  );
}
