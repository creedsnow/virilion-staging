"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="space-y-5">
      <div className="page-header">
        <p className="section-kicker mb-1">Legal</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-fg-muted mt-2 leading-relaxed max-w-xl">
          Working draft · Sept 26, 2026. What we store, sessions, and your rights —
          counsel review before launch.
        </p>
      </div>
      <section className="card stone-panel space-y-3 text-sm text-fg-muted leading-relaxed">
        <p>
          Staging may keep preferences and demo character data in your browser and,
          when wired, account records in the database. Cookie notices follow if
          analytics are added. Full Privacy Policy replaces this stub before launch.
        </p>
        <Link href="/terms" className="text-gold hover:text-gold-soft inline-block">
          Terms of Service →
        </Link>
      </section>
    </div>
  );
}
