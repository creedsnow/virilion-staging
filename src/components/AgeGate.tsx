"use client";

import { setAgeOk } from "@/lib/storage";

export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] night-sky flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center shadow-2xl">
        <p className="demo-badge mb-4">Adult portal</p>
        <h1 className="text-2xl font-semibold text-gold-soft mb-3">18+ only</h1>
        <p className="text-sm text-fg-muted leading-relaxed mb-6">
          Virilion is an adult queer mythic fantasy RP world. Characters are adult
          male gay / male-attracted vessels. Players may be any identity. You must
          be 18 or older to continue.
        </p>
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
        <p className="text-xs text-fg-muted mt-4">
          Leaving without confirming closes the gate. No underage content.
        </p>
      </div>
    </div>
  );
}
