"use client";

import Link from "next/link";

export default function SafetyPage() {
  return (
    <div className="space-y-5">
      <div className="care-hero">
        <div className="care-hero-sheen" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-kicker mb-1">Care chamber</p>
          <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
            Soft{" "}
            <span className="display-italic text-[1.05em]">safety</span>
          </h1>
          <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
            Consent first. Report and Block live on vessel messages in scene rooms.
          </p>
        </div>
      </div>

      <section className="care-panel">
        <div className="care-panel-glow" aria-hidden />
        <div className="relative z-[1] space-y-3">
          <p className="section-kicker">Consent reminder</p>
          <p className="text-sm text-fg leading-relaxed">
            Every scene is opt-in. Soft no is a full stop. The Blessing of Continuation is
            sacred, consent-gated, and never automatic.
          </p>
          <p className="text-xs text-fg-muted leading-relaxed">
            If something feels wrong, leave the room, Block the vessel, or Report the message.
            Demo saves Report/Block locally on this browser.
          </p>
        </div>
      </section>

      <section className="care-panel">
        <div className="care-panel-glow" aria-hidden />
        <div className="relative z-[1] space-y-3">
          <p className="section-kicker">Report</p>
          <p className="text-sm text-fg-muted leading-relaxed">
            On another vessel&apos;s message in a scene room, use{" "}
            <strong className="text-fg">Report</strong>. Staging stores a local note
            only — no server queue yet. Toast says &quot;saved locally.&quot;
          </p>
        </div>
      </section>

      <section className="care-panel">
        <div className="care-panel-glow" aria-hidden />
        <div className="relative z-[1] space-y-3">
          <p className="section-kicker">Block</p>
          <p className="text-sm text-fg-muted leading-relaxed">
            <strong className="text-fg">Block</strong> hides that vessel&apos;s messages in this
            browser for the demo. Full cross-device block ships with real accounts.
          </p>
        </div>
      </section>

      <Link href="/rules" className="care-panel care-panel-link block">
        <div className="care-panel-glow" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-kicker mb-1">Community</p>
          <p className="font-display text-xl font-semibold text-fg">Rules · 21 locks</p>
          <p className="text-xs text-fg-muted mt-0.5">
            Age · one vessel · consent · in-app home
          </p>
        </div>
      </Link>

      <div className="flex flex-wrap gap-2">
        <Link href="/self" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Self
        </Link>
        <Link href="/inbox" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Whispers
        </Link>
        <Link href="/" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Realm
        </Link>
      </div>
    </div>
  );
}
