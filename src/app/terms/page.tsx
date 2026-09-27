"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="space-y-5">
      <div className="page-header">
        <p className="section-kicker mb-1">Legal</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-fg-muted mt-2 leading-relaxed max-w-xl">
          Working draft · Sept 26, 2026. Operator details and counsel review still
          needed before launch.
        </p>
      </div>
      <section className="card stone-panel space-y-3 text-sm text-fg-muted leading-relaxed">
        <p>
          By using Virilion you agree to community rules, age requirements (18+),
          and respectful play. Accounts may be suspended for harm. Full
          counsel-reviewed Terms replace this stub before public launch.
        </p>
        <Link href="/privacy" className="text-gold hover:text-gold-soft inline-block">
          Privacy Policy →
        </Link>
      </section>
    </div>
  );
}
