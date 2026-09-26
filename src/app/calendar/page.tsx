"use client";

import Link from "next/link";
import { COMING_UP } from "@/lib/events";

export default function CalendarPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="section-kicker mb-1">Realm · Stub</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Coming up
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
          Demo events from the Realm feed. Full calendar and RSVP ship later — this list is
          honest staging.
        </p>
      </div>

      <ul className="space-y-3">
        {COMING_UP.map((e) => (
          <li key={e.title}>
            <article
              className="card stone-panel rounded-2xl relative overflow-hidden"
              style={{ borderLeft: `3px solid ${e.accent}` }}
            >
              <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-semibold">
                ✦ {e.when}
              </p>
              <p className="font-display text-xl font-semibold text-fg mt-1.5 leading-snug">
                {e.title}
              </p>
              <p className="text-sm text-fg-muted mt-2">✦ {e.place}</p>
            </article>
          </li>
        ))}
      </ul>

      <p className="text-[10px] text-fg-muted/75 text-center tracking-wide">
        Demo cast · times are flavor
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        <Link href="/" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          ← Realm
        </Link>
        <Link href="/map" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Map
        </Link>
        <Link href="/scenes" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Scenes
        </Link>
      </div>
    </div>
  );
}
