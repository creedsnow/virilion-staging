"use client";

import Link from "next/link";
import { PEOPLES } from "@/lib/canon/peoples";

const SECTIONS = [
  { href: "/map", title: "World & places", blurb: "One vast world — map color regions." },
  { href: "/codex#peoples", title: "Fourteen Peoples", blurb: "Canon peoples, gates, and customs." },
  { href: "/scenes", title: "Scenes & halls", blurb: "Live rooms stay in-app." },
  { href: "/weave", title: "The Weave", blurb: "Bonds asking for you tonight." },
];

export default function CodexPage() {
  return (
    <div className="space-y-5">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Lore · Demo stub</p>
        <h1 className="font-display text-3xl font-semibold text-fg">The World Codex</h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
          Everything known of Virilion — peoples, classes, places, chronicle. Full art
          codex ships later; this staging build keeps the spine honest.
        </p>
      </div>

      <ul className="space-y-3">
        {SECTIONS.map((s) => (
          <li key={s.title}>
            <Link
              href={s.href}
              className="card block hover:border-gold/40 transition stone-panel rounded-2xl"
            >
              <p className="font-display text-xl font-semibold text-fg">{s.title}</p>
              <p className="text-sm text-fg-muted mt-1">{s.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section id="peoples" className="space-y-3">
        <h2 className="section-serif">Fourteen Peoples</h2>
        <div className="grid grid-cols-2 gap-2">
          {PEOPLES.map((p) => (
            <div key={p.id} className="card py-3 px-3.5 rounded-xl">
              <p className="text-sm font-medium text-fg">{p.name}</p>
              <p className="text-[11px] text-fg-muted mt-0.5 line-clamp-2">
                {p.cultureName} · {p.homeland}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
