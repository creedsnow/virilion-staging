"use client";

import Link from "next/link";

export default function NotifsPage() {
  return (
    <div className="space-y-5">
      <div className="page-header">
        <p className="section-kicker mb-1">Community</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Notifications
        </h1>
        <p className="text-sm text-fg-muted mt-2 leading-relaxed max-w-xl">
          Alerts for whispers, asks, and events will land here. Thin stub for Phase A.
        </p>
      </div>
      <section className="card stone-panel space-y-3">
        <p className="text-sm text-fg-muted leading-relaxed">
          No unread demo notifications yet. Check Whispers and Calendar for living asks.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/whispers" className="btn-gold text-sm py-2 px-4 !min-h-0">
            Whispers
          </Link>
          <Link href="/events" className="btn-ghost text-sm py-2 px-3 !min-h-0">
            Events
          </Link>
          <Link href="/dash" className="btn-ghost text-sm py-2 px-3 !min-h-0">
            Home
          </Link>
        </div>
      </section>
    </div>
  );
}
