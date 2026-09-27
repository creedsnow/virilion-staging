"use client";

import Link from "next/link";

export default function CampaignsPage() {
  return (
    <div className="space-y-5">
      <div className="guild-hero">
        <div className="guild-hero-sheen" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-kicker mb-1">Campaigns · Coming soon</p>
          <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
            Awaiting{" "}
            <span className="display-italic text-[1.05em]">GM locks</span>
          </h1>
          <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
            Campaign boards, casting, and session circles ship later. No invented
            campaigns on staging — ask a GM when the lamps open.
          </p>
        </div>
      </div>

      <section className="guild-chamber">
        <div className="guild-chamber-accent" aria-hidden />
        <div className="guild-chamber-glow" aria-hidden />
        <div className="relative z-[1] space-y-3 text-center sm:text-left">
          <p className="section-kicker">Coming soon</p>
          <p className="font-display text-xl text-gold-soft leading-snug">
            The table is empty · no campaigns yet
          </p>
          <p className="text-sm text-fg-muted leading-relaxed max-w-md mx-auto sm:mx-0">
            Play Scenes and Events for live rooms tonight. Campaign casting
            waits on GM tools — honest empty board until then.
          </p>
          <ul className="text-xs text-fg-muted/90 leading-relaxed space-y-1.5 max-w-sm mx-auto sm:mx-0 list-none pl-0">
            <li>
              <span className="text-gold/80">✦</span> Browse · casting · in play later
            </li>
            <li>
              <span className="text-gold/80">✦</span> GM locks open the board
            </li>
            <li>
              <span className="text-gold/80">✦</span> No fake campaign data here
            </li>
          </ul>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 justify-center">
        <Link href="/scenes" className="btn-gold text-sm py-2 px-4 !min-h-0 inline-flex">
          Open Scenes
        </Link>
        <Link href="/events" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Calendar
        </Link>
        <Link href="/dash" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Realm
        </Link>
      </div>
    </div>
  );
}
