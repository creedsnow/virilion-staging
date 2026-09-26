"use client";

import Link from "next/link";
import { SERVER_RULES } from "@/lib/canon/serverRules";

export default function RulesPage() {
  return (
    <div className="space-y-5">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Community · 21 locks</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Virilion{" "}
          <span className="display-italic text-[1.05em]">Rules</span>
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
          Product rules for the in-app home. Present as your Character. Consent before
          escalation. Adult characters only.
        </p>
      </div>

      <ol className="space-y-3">
        {SERVER_RULES.map((r) => (
          <li key={r.id} className="card stone-panel rounded-2xl space-y-2">
            <p className="section-kicker">Rule {r.id}</p>
            <h2 className="font-display text-lg font-semibold text-fg leading-snug">
              {r.title}
            </h2>
            <p className="text-sm text-fg-muted whitespace-pre-line leading-relaxed">
              {r.body}
            </p>
          </li>
        ))}
      </ol>

      <p className="text-xs text-fg-muted text-center leading-relaxed">
        Full canon text lives with Launch Planner.{" "}
        <Link href="/self" className="text-gold hover:text-gold-soft">
          ← Self
        </Link>
      </p>
    </div>
  );
}
