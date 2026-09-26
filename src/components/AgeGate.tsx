"use client";

import Image from "next/image";
import { setAgeOk } from "@/lib/storage";

export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] night-sky flex items-center justify-center p-5">
      <div className="stone-panel card max-w-md w-full text-center shadow-2xl rounded-2xl px-6 py-8 space-y-5">
        <div className="flex justify-center">
          <Image
            src="/virilion-logo.png"
            alt=""
            width={72}
            height={72}
            className="opacity-95 drop-shadow-[0_0_16px_rgba(201,162,39,0.35)]"
            priority
          />
        </div>

        <div>
          <p className="demo-badge mb-3">Adult portal · 18+</p>
          <h1 className="text-2xl font-semibold text-gold-soft tracking-wide">
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
                <strong className="text-fg">Players</strong> may be any identity.
                <strong className="text-fg"> Vessels</strong> are adult male gay /
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
