"use client";

import Link from "next/link";

export default function ShopPage() {
  return (
    <div className="space-y-5">
      <div className="shop-hero">
        <div className="shop-hero-sheen" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-kicker mb-1">Moonmarket · Coming soon</p>
          <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
            Stall{" "}
            <span className="display-italic text-[1.05em]">closed</span>
          </h1>
          <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
            Cosmetics and treats will gather here under soft lantern light. No
            checkout on this demo — bags and payments stay off staging.
          </p>
        </div>
      </div>

      <section className="moonmarket-stall">
        <div className="moonmarket-stall-glow" aria-hidden />
        <div className="relative z-[1] space-y-3 text-center">
          <span className="moonmarket-lantern" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 3h6M10 3v2h4V3M8 7h8l1 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V10l1-3Z"
                stroke="currentColor"
                strokeWidth="1.55"
                strokeLinejoin="round"
              />
              <path
                d="M12 10v5"
                stroke="currentColor"
                strokeWidth="1.55"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="section-kicker">Coming soon</p>
          <p className="font-display text-xl text-gold-soft leading-snug">
            Moonmarket closed
          </p>
          <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
            The stall waits dark for now. Browse cosmetics and treats later —
            nothing to buy here yet.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 justify-center">
        <Link href="/self" className="btn-gold text-sm py-2 px-4 !min-h-0 inline-flex">
          ← Self
        </Link>
        <Link href="/" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Realm
        </Link>
      </div>
    </div>
  );
}
