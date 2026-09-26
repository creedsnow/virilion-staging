"use client";

import Link from "next/link";

export default function GuildsPage() {
  return (
    <div className="space-y-5">
      <div className="guild-hero">
        <div className="guild-hero-sheen" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-kicker mb-1">Guild hall · Coming soon</p>
          <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
            Empty{" "}
            <span className="display-italic text-[1.05em]">hall</span>
          </h1>
          <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
            Founding takes two vessels — master and co-master. Directory, ranks,
            and guild chat ship later. No invented guilds on staging.
          </p>
        </div>
      </div>

      <section className="guild-chamber">
        <div className="guild-chamber-accent" aria-hidden />
        <div className="guild-chamber-glow" aria-hidden />
        <div className="relative z-[1] space-y-3 text-center sm:text-left">
          <p className="section-kicker">Coming soon</p>
          <p className="font-display text-xl text-gold-soft leading-snug">
            The lamps are out · no guilds yet
          </p>
          <p className="text-sm text-fg-muted leading-relaxed max-w-md mx-auto sm:mx-0">
            Weave holds living vessel bonds today. Guild founding is not a second
            vessel — it waits for two who agree to hold the hall together.
          </p>
          <ul className="text-xs text-fg-muted/90 leading-relaxed space-y-1.5 max-w-sm mx-auto sm:mx-0 list-none pl-0">
            <li>
              <span className="text-gold/80">✦</span> Master + co-master to found
            </li>
            <li>
              <span className="text-gold/80">✦</span> Directory · ranks · chat later
            </li>
            <li>
              <span className="text-gold/80">✦</span> Honest empty hall until then
            </li>
          </ul>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 justify-center">
        <Link href="/weave" className="btn-gold text-sm py-2 px-4 !min-h-0 inline-flex">
          Open Weave
        </Link>
        <Link href="/self" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Self
        </Link>
        <Link href="/" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Realm
        </Link>
      </div>
    </div>
  );
}
