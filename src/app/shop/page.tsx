"use client";

import Link from "next/link";

export default function ShopPage() {
  return (
    <div className="space-y-5">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Moonmarket · Stub</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Shop
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
          Cosmetics and treats will gather here. No checkout in this demo.
        </p>
      </div>

      <section className="stub-panel px-4 py-6 text-center space-y-2">
        <p className="section-kicker">Coming soon</p>
        <p className="font-display text-xl text-gold-soft">Moonmarket closed</p>
        <p className="text-xs text-fg-muted leading-relaxed max-w-sm mx-auto">
          Browse later — payments and bags stay off staging.
        </p>
      </section>

      <div className="flex flex-wrap gap-2 justify-center">
        <Link href="/self" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          ← Self
        </Link>
      </div>
    </div>
  );
}
