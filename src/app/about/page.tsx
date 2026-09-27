"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <div className="page-header">
        <p className="section-kicker mb-1">About</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          How to play
        </h1>
        <p className="text-sm text-fg-muted mt-2 leading-relaxed max-w-xl">
          Virilion is an adult queer mythic fantasy RP site — desktop and mobile.
          One Character per player. Walk halls, forge bonds, read the Codex.
        </p>
      </div>
      <section className="card stone-panel space-y-3">
        <ol className="text-sm text-fg-muted leading-relaxed space-y-2 list-decimal pl-5">
          <li>Confirm you are 18+.</li>
          <li>
            <Link href="/join" className="text-gold hover:text-gold-soft">
              Begin the Rite of Making
            </Link>{" "}
            — People, Class, Style, Role, Stats, Name, Seal.
          </li>
          <li>Sign in and land on your Home dashboard.</li>
          <li>Open Scenes, the Map, or Bonds — play under moonlight.</li>
        </ol>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href="/join" className="btn-gold text-sm py-2 px-4 !min-h-0">
            Begin the Rite
          </Link>
          <Link href="/rules" className="btn-ghost text-sm py-2 px-3 !min-h-0">
            Community rules
          </Link>
          <Link href="/codex" className="btn-ghost text-sm py-2 px-3 !min-h-0">
            Codex
          </Link>
        </div>
      </section>
    </div>
  );
}
