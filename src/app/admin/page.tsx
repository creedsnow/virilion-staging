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
      <div>
        <p className="text-xs uppercase tracking-widest text-gold">Demo GM</p>
        <h1 className="text-2xl font-semibold text-fg">Pending vessels</h1>
        <p className="text-sm text-fg-muted mt-1">
          Crude localStorage approval path for Custom People/Style/Class.
        </p>
      </div>
      {pending.length === 0 ? (
        <div className="card text-sm text-fg-muted">No pending vessels in this browser.</div>
      ) : (
        <ul className="space-y-3">
          {pending.map((v) => (
            <li key={v.id} className="card flex items-start justify-between gap-3">
              <div className="text-sm">
                <p className="font-medium text-fg">{v.name}</p>
                <p className="text-fg-muted capitalize">
                  {v.people}
                  {v.peopleCustom ? ` (${v.peopleCustom})` : ""} · {v.style}
                  {v.styleCustom ? ` (${v.styleCustom})` : ""} · {v.classId}
                  {v.classCustom ? ` (${v.classCustom})` : ""}
                </p>
              </div>
              <button
                type="button"
                className="btn-gold text-xs py-2"
                onClick={() => approve(v.id)}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
