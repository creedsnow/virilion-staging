"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MOONMARKET_DIES,
  MOONMARKET_SKINS,
  moonmarketDie,
  moonmarketSkin,
} from "@/lib/assets";

export default function ShopPage() {
  return (
    <div className="space-y-5">
      <div className="shop-hero">
        <div className="shop-hero-sheen" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-kicker mb-1">Moonmarket · Coming soon</p>
          <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
            Stall{" "}
            <span className="display-italic text-[1.05em]">preview</span>
          </h1>
          <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
            Dice skins and shapes under soft lantern light. No checkout on this
            demo — bags and payments stay off staging.
          </p>
        </div>
      </div>

      <section className="space-y-3" aria-labelledby="shop-skins-heading">
        <div className="flex items-end justify-between gap-2">
          <h2 id="shop-skins-heading" className="section-serif">
            Dice skins
          </h2>
          <p className="text-[10px] uppercase tracking-wide text-fg-muted">
            {MOONMARKET_SKINS.length} · Batch A
          </p>
        </div>
        <div className="moonmarket-grid">
          {MOONMARKET_SKINS.map((skin) => (
            <article key={skin.id} className="moonmarket-card">
              <div className="moonmarket-card-frame">
                <Image
                  src={moonmarketSkin(skin.id)}
                  alt=""
                  width={800}
                  height={800}
                  className="moonmarket-card-img"
                  sizes="(max-width: 640px) 45vw, 200px"
                />
              </div>
              <div className="moonmarket-card-meta">
                <p className="moonmarket-card-title">{skin.label}</p>
                <p className="moonmarket-card-sub">{skin.blurb}</p>
                <span className="moonmarket-card-badge">Coming soon</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="shop-dies-heading">
        <div className="flex items-end justify-between gap-2">
          <h2 id="shop-dies-heading" className="section-serif">
            Die shapes
          </h2>
          <p className="text-[10px] uppercase tracking-wide text-fg-muted">
            Blank faces
          </p>
        </div>
        <div className="moonmarket-die-grid">
          {MOONMARKET_DIES.map((die) => (
            <article key={die.id} className="moonmarket-die-card">
              <div className="moonmarket-die-frame">
                <Image
                  src={moonmarketDie(die.id)}
                  alt=""
                  width={800}
                  height={800}
                  className="moonmarket-card-img"
                  sizes="(max-width: 640px) 30vw, 120px"
                />
              </div>
              <p className="moonmarket-die-label">{die.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="moonmarket-stall">
        <div className="moonmarket-stall-glow" aria-hidden />
        <div className="relative z-[1] space-y-2 text-center">
          <p className="section-kicker">No checkout</p>
          <p className="font-display text-lg text-gold-soft leading-snug">
            Bags stay dark on staging
          </p>
          <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
            Art preview only — nothing to buy here yet. Guild crests and later
            batches wait until Creed asks.
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
