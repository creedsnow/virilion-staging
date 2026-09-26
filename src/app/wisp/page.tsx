"use client";

import Link from "next/link";

export default function WispPage() {
  return (
    <div className="space-y-5">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Companion</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Wisp
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
          Your quiet companion. Pet panel only — never on Map, Scenes, showcase, or roster.
        </p>
      </div>

      <section className="card stone-panel wisp-chamber rounded-2xl relative overflow-hidden">
        <div className="wisp-chamber-glow" aria-hidden />
        <div className="relative z-[1] flex flex-col items-center py-8 gap-4">
          <div className="wisp-orb" aria-hidden>
            <span className="wisp-orb-core" />
            <span className="wisp-orb-trail" />
          </div>
          <p className="font-display text-xl text-gold-soft">A soft mote waits</p>
          <p className="text-xs text-fg-muted text-center max-w-xs leading-relaxed">
            Bond, treats, and look variants ship later. For now: presence only.
          </p>
        </div>
      </section>

      <section className="card stone-panel rounded-2xl space-y-3">
        <p className="section-kicker">Care</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="chip opacity-70 cursor-not-allowed" disabled>
            Pet · Coming soon
          </button>
          <button type="button" className="chip opacity-70 cursor-not-allowed" disabled>
            Feed · Coming soon
          </button>
          <button type="button" className="chip opacity-70 cursor-not-allowed" disabled>
            Poke · Coming soon
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/self" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          ← Self
        </Link>
        <Link href="/" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Realm
        </Link>
      </div>
    </div>
  );
}
