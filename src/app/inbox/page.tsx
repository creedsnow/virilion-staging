"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getVessel } from "@/lib/storage";
import type { Vessel } from "@/lib/types";

type Thread = {
  id: string;
  vesselName: string;
  people: string;
  preview: string;
  when: string;
  unread: boolean;
  hue: string;
};

const DEMO_THREADS: Thread[] = [
  {
    id: "thorne",
    vesselName: "Thorne",
    people: "Cassens · Rival",
    preview: "The lantern walk still has one seat if you want it.",
    when: "Tonight",
    unread: true,
    hue: "#5a3d78",
  },
];

const DEMO_MESSAGES = [
  {
    from: "thorne" as const,
    text: "The lantern walk still has one seat if you want it.",
    when: "8:12 PM",
  },
  {
    from: "self" as const,
    text: "I might. Meet by the Coil lamps?",
    when: "8:14 PM",
  },
  {
    from: "thorne" as const,
    text: "Yes. Soft voices by the Coil lamps.",
    when: "8:15 PM",
  },
];

export default function InboxPage() {
  const [vessel, setV] = useState<Vessel | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setV(getVessel());
  }, []);

  const open = DEMO_THREADS.find((t) => t.id === openId) || null;

  if (open) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          className="text-[10px] uppercase tracking-[0.14em] text-gold hover:text-gold-soft"
          onClick={() => setOpenId(null)}
        >
          ← Whispers
        </button>
        <div className="flex gap-3 items-center">
          <div
            className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-display text-xl font-semibold text-gold-soft border border-gold/25"
            style={{
              background: `linear-gradient(145deg, ${open.hue}, #121018 75%)`,
            }}
            aria-hidden
          >
            {open.vesselName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="section-kicker mb-0.5">Whisper thread · demo</p>
            <h1 className="font-display text-2xl font-semibold text-fg leading-tight">
              {open.vesselName}
            </h1>
            <p className="text-xs text-fg-muted">{open.people}</p>
          </div>
        </div>

        <div className="whisper-thread space-y-3">
          {DEMO_MESSAGES.map((m, i) => {
            const mine = m.from === "self";
            return (
              <div
                key={i}
                className={`whisper-bubble ${mine ? "whisper-mine" : "whisper-theirs"}`}
              >
                <p className="text-sm leading-relaxed">{m.text}</p>
                <p className="text-[10px] text-fg-muted mt-1.5 tracking-wide">
                  {mine ? vessel?.name || "You" : open.vesselName} · {m.when}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-fg-muted text-center leading-relaxed">
          Demo whispers · this browser only. Real multi-device chat ships later.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/safety" className="btn-ghost text-xs py-2 px-3 !min-h-0">
            Safety
          </Link>
          <Link href="/self" className="btn-ghost text-xs py-2 px-3 !min-h-0">
            Self
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="section-kicker mb-1">Private · Vessel-first</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Whispers
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
          Soft words between vessels. Threads show faces first — never Player accounts.
        </p>
      </div>

      {DEMO_THREADS.length === 0 ? (
        <div className="card stone-panel rounded-2xl space-y-2 text-center py-8">
          <p className="font-display text-xl text-gold-soft">The night is quiet</p>
          <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
            No whispers yet. When another vessel reaches for you, their face will rest here.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {DEMO_THREADS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className="whisper-row"
                onClick={() => setOpenId(t.id)}
              >
                <div
                  className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-display text-lg font-semibold text-gold-soft border border-gold/20"
                  style={{
                    background: `linear-gradient(145deg, ${t.hue}, #121018 75%)`,
                  }}
                  aria-hidden
                >
                  {t.vesselName.charAt(0)}
                </div>
                <span className="min-w-0 flex-1 text-left">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-lg font-semibold text-fg truncate">
                      {t.vesselName}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-fg-muted shrink-0">
                      {t.when}
                    </span>
                  </span>
                  <span className="text-[11px] text-fg-muted block mt-0.5">{t.people}</span>
                  <span className="text-sm text-fg-muted/90 block mt-1 line-clamp-1">
                    {t.preview}
                  </span>
                </span>
                {t.unread ? (
                  <span className="whisper-unread" aria-label="Unread" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[10px] text-fg-muted/75 text-center tracking-wide">
        Demo cast · one sample thread
      </p>

      <section className="card stone-panel rounded-2xl space-y-2">
        <p className="section-kicker">World & tools</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/safety" className="chip">
            Safety
          </Link>
          <Link href="/self" className="chip">
            Self
          </Link>
          <Link href="/weave" className="chip">
            Weave
          </Link>
        </div>
      </section>
    </div>
  );
}
