"use client";

import { useEffect, useState } from "react";
import {
  approvePendingVessel,
  getPendingVessels,
  getVessel,
  setVessel,
} from "@/lib/storage";
import type { Vessel } from "@/lib/types";

export default function AdminPage() {
  const [pending, setPending] = useState<Vessel[]>([]);

  function reload() {
    setPending(getPendingVessels());
  }

  useEffect(() => {
    reload();
  }, []);

  function approve(id: string) {
    const approved = approvePendingVessel(id);
    const current = getVessel();
    if (approved && current && current.id === id) {
      setVessel(approved);
    }
    reload();
  }

  return (
    <div className="space-y-4">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Demo GM</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Pending vessels
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
          Local approval path for Custom People / Style / Class. Staging only —
          no invented GM tools.
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="stub-panel text-center py-10 px-5">
          <p className="section-kicker mb-2">Queue clear</p>
          <p className="font-display text-xl text-gold-soft mb-2">No pending vessels</p>
          <p className="text-sm text-fg-muted leading-relaxed max-w-sm mx-auto">
            Custom rite submissions land here for demo approve. This browser has none waiting.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {pending.map((v) => (
            <li key={v.id} className="pending-card flex items-start justify-between gap-3">
              <div className="text-sm min-w-0">
                <p className="text-[10px] uppercase tracking-[0.14em] text-gold mb-1">
                  Awaiting approve
                </p>
                <p className="font-display text-lg font-semibold text-fg">{v.name}</p>
                <p className="text-fg-muted capitalize mt-1 leading-relaxed">
                  {v.people}
                  {v.peopleCustom ? ` (${v.peopleCustom})` : ""} · {v.style}
                  {v.styleCustom ? ` (${v.styleCustom})` : ""} · {v.classId}
                  {v.classCustom ? ` (${v.classCustom})` : ""}
                </p>
              </div>
              <button
                type="button"
                className="btn-gold text-xs py-2 shrink-0"
                onClick={() => approve(v.id)}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="stub-panel px-4 py-4">
        <p className="section-kicker mb-1">Coming soon</p>
        <p className="font-display text-base text-fg">Reports · place gates · live GM tools</p>
        <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
          Honest stubs only. No invented features in this staging shell.
        </p>
      </div>
    </div>
  );
}
