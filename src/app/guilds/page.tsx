"use client";

import Link from "next/link";

export default function GuildsPage() {
  return (
    <div className="space-y-5">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Bonds · Stub</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Guilds
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
          Founding takes two vessels — master and co-master. Directory, ranks, and guild
          chat/voice ship later.
        </p>
      </div>

      <section className="stub-panel px-4 py-6 text-center space-y-2">
        <p className="section-kicker">Coming soon</p>
        <p className="font-display text-xl text-gold-soft">No guilds yet</p>
        <p className="text-xs text-fg-muted leading-relaxed max-w-sm mx-auto">
          Weave holds vessel bonds today. Guild founding is not a second vessel.
        </p>
      </section>

      <div className="flex flex-wrap gap-2 justify-center">
        <Link href="/weave" className="btn-gold text-sm py-2 px-4 !min-h-0 inline-flex">
          Open Weave
        </Link>
        <Link href="/self" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Self
        </Link>
      </div>
    </div>
  );
}
