"use client";

import type { CSSProperties } from "react";

/**
 * Soft drifting fireflies for Enter / age gate — Claude Design parity.
 * Decorative only; prefers-reduced-motion = static soft dots (see globals.css).
 */
type Mote = {
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
  driftX: string;
  driftY: string;
};

const MOTES: Mote[] = [
  { left: "8%", top: "12%", size: "3px", delay: "0s", duration: "11s", driftX: "12px", driftY: "-22px" },
  { left: "18%", top: "28%", size: "2px", delay: "1.2s", duration: "13s", driftX: "-10px", driftY: "-18px" },
  { left: "26%", top: "8%", size: "4px", delay: "0.4s", duration: "10s", driftX: "14px", driftY: "-26px" },
  { left: "34%", top: "42%", size: "2px", delay: "2.1s", duration: "14s", driftX: "-8px", driftY: "-16px" },
  { left: "42%", top: "16%", size: "3px", delay: "0.8s", duration: "12s", driftX: "10px", driftY: "-24px" },
  { left: "48%", top: "58%", size: "2px", delay: "3s", duration: "15s", driftX: "-12px", driftY: "-14px" },
  { left: "55%", top: "22%", size: "5px", delay: "0.2s", duration: "9s", driftX: "16px", driftY: "-28px" },
  { left: "62%", top: "38%", size: "2px", delay: "1.7s", duration: "13s", driftX: "-9px", driftY: "-20px" },
  { left: "70%", top: "10%", size: "3px", delay: "2.4s", duration: "11s", driftX: "11px", driftY: "-22px" },
  { left: "78%", top: "48%", size: "2px", delay: "0.6s", duration: "14s", driftX: "-14px", driftY: "-18px" },
  { left: "86%", top: "18%", size: "4px", delay: "1.1s", duration: "10s", driftX: "13px", driftY: "-25px" },
  { left: "92%", top: "62%", size: "2px", delay: "2.8s", duration: "12s", driftX: "-7px", driftY: "-15px" },
  { left: "12%", top: "68%", size: "3px", delay: "1.5s", duration: "13s", driftX: "9px", driftY: "-19px" },
  { left: "22%", top: "82%", size: "2px", delay: "0.9s", duration: "11s", driftX: "-11px", driftY: "-12px" },
  { left: "38%", top: "74%", size: "3px", delay: "2.2s", duration: "15s", driftX: "8px", driftY: "-21px" },
  { left: "52%", top: "86%", size: "2px", delay: "1.8s", duration: "12s", driftX: "-10px", driftY: "-10px" },
  { left: "66%", top: "72%", size: "4px", delay: "0.3s", duration: "10s", driftX: "15px", driftY: "-23px" },
  { left: "82%", top: "80%", size: "2px", delay: "2.6s", duration: "14s", driftX: "-8px", driftY: "-14px" },
  { left: "4%", top: "48%", size: "2px", delay: "1.4s", duration: "13s", driftX: "7px", driftY: "-17px" },
  { left: "30%", top: "54%", size: "3px", delay: "0.7s", duration: "11s", driftX: "-13px", driftY: "-20px" },
  { left: "58%", top: "6%", size: "2px", delay: "3.2s", duration: "12s", driftX: "10px", driftY: "-27px" },
  { left: "74%", top: "32%", size: "3px", delay: "1.9s", duration: "10s", driftX: "-12px", driftY: "-19px" },
  { left: "88%", top: "42%", size: "2px", delay: "0.5s", duration: "15s", driftX: "9px", driftY: "-16px" },
  { left: "15%", top: "38%", size: "2px", delay: "2.9s", duration: "11s", driftX: "-6px", driftY: "-18px" },
];

export function Fireflies({ density = "full" }: { density?: "full" | "soft" }) {
  const motes = density === "soft" ? MOTES.filter((_, i) => i % 2 === 0) : MOTES;

  return (
    <div className="firefly-field" aria-hidden>
      {motes.map((m, i) => (
        <span
          key={i}
          className="firefly"
          style={
            {
              "--firefly-left": m.left,
              "--firefly-top": m.top,
              "--firefly-size": m.size,
              "--firefly-delay": m.delay,
              "--firefly-duration": m.duration,
              "--firefly-drift-x": m.driftX,
              "--firefly-drift-y": m.driftY,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
