"use client";

import Image from "next/image";
import { setAgeOk } from "@/lib/storage";

export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] night-sky flex items-center justify-center p-5">
      <div className="relative z-[1] stone-panel card max-w-md w-full text-center rounded-2xl px-6 py-8 space-y-5">
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-full blur-xl opacity-60"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--aura) 50%, transparent), transparent 70%)",
              }}
              aria-hidden
            />
            <Image
              src="/virilion-logo.png"
              alt=""
              width={68}
              height={68}
              className="relative rounded-xl"
              priority
            />
          </div>
        </div>

        <div>
          <p className="demo-badge mb-3">Adult portal · 18+</p>
          <h1 className="font-display text-3xl font-semibold text-gold-soft tracking-wide">
            Enter with consent
          </h1>
        </div>

        <div className="text-left space-y-3 text-sm text-fg-muted leading-relaxed">
          <p>
            Virilion is an adult queer mythic fantasy RP world — magic, brotherhood,
            lineage, drama, and beautiful men with problems.
          </p>
          <ul className="space-y-2 text-[13px]">
            <li className="flex gap-2">
              <span className="text-gold shrink-0">✦</span>
              <span>
                <strong className="text-fg">Players</strong> may be any identity.{" "}
                <strong className="text-fg">Vessels</strong> are adult male gay /
                male-attracted characters.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-gold shrink-0">✦</span>
              <span>
                Characters must be clearly adult. No underage content, no loopholes.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-gold shrink-0">✦</span>
              <span>
                Consent before escalation. In-character mess is fine; out-of-character
                disrespect is not.
              </span>
            </li>
          </ul>
          <p className="text-xs text-fg-muted/90 border-t border-border/70 pt-3">
            Full community rules live in the Codex. This gate asks only that you are an
            adult and will honor consent.
          </p>
        </div>

        <button
          type="button"
          className="btn-gold w-full"
          onClick={() => {
            setAgeOk();
            onConfirm();
          }}
        >
          I am 18 or older — Enter
        </button>

        <p className="text-xs text-fg-muted">
          Leaving without confirming keeps the gate closed.
        </p>
      </div>
    </div>
  );
}
