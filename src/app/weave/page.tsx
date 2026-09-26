"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { getVessel } from "@/lib/storage";

interface Bond {
  id: string;
  name: string;
  kind: string;
  status: "asked" | "open" | "accepted";
}

const SEED: Bond[] = [
  { id: "1", name: "Ashen (demo)", kind: "Rival", status: "open" },
  { id: "2", name: "Mirell (demo)", kind: "Travel companion", status: "asked" },
];

export default function WeavePage() {
  const [ready, setReady] = useState(false);
  const [bonds, setBonds] = useState<Bond[]>(SEED);
  const [hasVessel, setHasVessel] = useState(false);

  useEffect(() => {
    setHasVessel(!!getVessel());
    const raw = localStorage.getItem("virilion_weave");
    if (raw) {
      try {
        setBonds(JSON.parse(raw) as Bond[]);
      } catch {
        /* keep seed */
      }
    }
    setReady(true);
  }, []);

  function persist(next: Bond[]) {
    setBonds(next);
    localStorage.setItem("virilion_weave", JSON.stringify(next));
  }

  function accept(id: string) {
    persist(
      bonds.map((b) => (b.id === id ? { ...b, status: "accepted" as const } : b))
    );
  }

  function ask() {
    const name = prompt("Vessel name to ask a bond with?");
    if (!name?.trim()) return;
    const kind = prompt("Bond kind? (friend, rival, mentor…)", "Friend") || "Friend";
    persist([
      ...bonds,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        kind,
        status: "asked",
      },
    ]);
  }

  if (!ready) return null;
  if (!hasVessel) {
    return (
      <EmptyState
        title="Weave"
        body="Embody a Vessel first, then ask and accept character-to-character bonds."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-kicker mb-1">Bonds</p>
            <h1 className="font-display text-3xl font-semibold text-fg">Weave</h1>
          <p className="text-sm text-fg-muted mt-1">
            Connections constellation — vessel to vessel. Marriage: Coming soon.
          </p>
        </div>
        <button type="button" className="btn-gold text-sm py-2" onClick={ask}>
          Ask bond
        </button>
      </div>
      <ul className="space-y-2">
        {bonds.map((b) => (
          <li key={b.id} className="card flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-fg">{b.name}</p>
              <p className="text-xs text-fg-muted">
                {b.kind} · {b.status}
              </p>
            </div>
            {b.status === "open" || b.status === "asked" ? (
              <button
                type="button"
                className="btn-ghost text-xs py-1.5"
                onClick={() => accept(b.id)}
              >
                Accept
              </button>
            ) : (
              <span className="text-xs text-ok">Linked</span>
            )}
          </li>
        ))}
      </ul>
      <p className="text-xs text-fg-muted">
        Guild founding (master + co-master): Coming soon. Wisp is not shown on Weave.
      </p>
    </div>
  );
}
