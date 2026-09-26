"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { EmptyState } from "@/components/EmptyState";
import { getVessel } from "@/lib/storage";

interface Bond {
  id: string;
  name: string;
  kind: string;
  status: "asked" | "open" | "accepted";
  hue?: string;
}

const SEED: Bond[] = [
  { id: "1", name: "Ashen (demo)", kind: "Rival", status: "open", hue: "#5a3d78" },
  { id: "2", name: "Mirell (demo)", kind: "Travel companion", status: "asked", hue: "#3d5a80" },
  { id: "3", name: "Thorne (demo)", kind: "Friend", status: "accepted", hue: "#6b3d4a" },
];

const HUES = ["#5a3d78", "#3d5a80", "#6b3d4a", "#3d6b58", "#6b5a3d", "#4a3d6b"];

function statusLabel(s: Bond["status"]) {
  if (s === "open") return "Asking for you";
  if (s === "asked") return "Waiting";
  return "Linked";
}

function BondRow({
  bond,
  onAccept,
  onDecline,
}: {
  bond: Bond;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const initial = bond.name.trim().charAt(0).toUpperCase() || "·";
  const hue = bond.hue || HUES[0];
  const incoming = bond.status === "open";
  return (
    <li className="bond-card" data-status={bond.status}>
      <div
        className="bond-avatar"
        style={{
          background: `radial-gradient(circle at 30% 22%, rgba(232, 200, 120, 0.22), transparent 55%), linear-gradient(145deg, color-mix(in srgb, ${hue} 62%, #1a1028), #0e0c14 80%)`,
        }}
        aria-hidden
      >
        <span className="relative z-[1]">{initial}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-lg font-semibold text-fg leading-tight truncate">
            {bond.name}
          </p>
          <span className="bond-status shrink-0" data-kind={bond.status}>
            {bond.status === "accepted" ? "✦ " : ""}
            {statusLabel(bond.status)}
          </span>
        </div>
        <p className="text-xs text-fg-muted mt-1">{bond.kind}</p>
      </div>
      {incoming ? (
        <div className="bond-actions">
          <button
            type="button"
            className="btn-gold text-[10px] py-1.5 px-3.5 min-h-0 shrink-0 tracking-[0.12em]"
            onClick={() => onAccept(bond.id)}
          >
            Accept
          </button>
          <button
            type="button"
            className="bond-decline"
            onClick={() => onDecline(bond.id)}
          >
            Decline
          </button>
        </div>
      ) : null}
    </li>
  );
}

export default function WeavePage() {
  const [ready, setReady] = useState(false);
  const [bonds, setBonds] = useState<Bond[]>(SEED);
  const [hasVessel, setHasVessel] = useState(false);
  const [asking, setAsking] = useState(false);
  const [askName, setAskName] = useState("");
  const [askKind, setAskKind] = useState("Friend");

  useEffect(() => {
    setHasVessel(!!getVessel());
    const raw = localStorage.getItem("virilion_weave");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Bond[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBonds(parsed);
        } else {
          localStorage.setItem("virilion_weave", JSON.stringify(SEED));
          setBonds(SEED);
        }
      } catch {
        localStorage.setItem("virilion_weave", JSON.stringify(SEED));
        setBonds(SEED);
      }
    } else {
      // Seed demo asks so Realm → Weave deep-link stays actionable after refresh
      localStorage.setItem("virilion_weave", JSON.stringify(SEED));
      setBonds(SEED);
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

  function decline(id: string) {
    // Honest demo: declining removes the incoming ask from your constellation
    persist(bonds.filter((b) => b.id !== id));
  }

  function submitAsk(e: FormEvent) {
    e.preventDefault();
    const name = askName.trim();
    if (!name) return;
    const hue = HUES[bonds.length % HUES.length];
    persist([
      ...bonds,
      {
        id: crypto.randomUUID(),
        name,
        kind: askKind.trim() || "Friend",
        status: "asked",
        hue,
      },
    ]);
    setAskName("");
    setAskKind("Friend");
    setAsking(false);
  }

  const askingForYou = useMemo(
    () => bonds.filter((b) => b.status === "open"),
    [bonds]
  );
  const yourThread = useMemo(
    () => bonds.filter((b) => b.status !== "open"),
    [bonds]
  );

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
    <div className="space-y-5">
      <div className="weave-hero">
        <div className="weave-threads" aria-hidden />
        <div className="relative z-[1] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="section-kicker mb-1">Bonds · Constellation</p>
            <h1 className="font-display text-3xl font-semibold text-fg">The Weave</h1>
            <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-sm">
              Vessel to vessel — soft threads across the night.{" "}
              {askingForYou.length > 0
                ? `${askingForYou.length} asking for you tonight.`
                : "No open asks right now."}
            </p>
          </div>
          <button
            type="button"
            className="btn-gold text-sm py-2 px-4 min-h-0 shrink-0"
            onClick={() => setAsking((v) => !v)}
            aria-expanded={asking}
          >
            {asking ? "Close" : "Ask bond"}
          </button>
        </div>
      </div>

      {asking ? (
        <form className="weave-ask space-y-3" onSubmit={submitAsk}>
          <p className="section-kicker">Reach across</p>
          <div className="space-y-2">
            <label className="label" htmlFor="bond-name">
              Vessel name
            </label>
            <input
              id="bond-name"
              className="input"
              value={askName}
              onChange={(e) => setAskName(e.target.value)}
              placeholder="Who are you asking?"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="bond-kind">
              Bond kind
            </label>
            <input
              id="bond-kind"
              className="input"
              value={askKind}
              onChange={(e) => setAskKind(e.target.value)}
              placeholder="Friend, rival, mentor…"
            />
          </div>
          <button type="submit" className="btn-gold w-full text-sm">
            Send ask
          </button>
        </form>
      ) : null}

      {askingForYou.length > 0 ? (
        <section id="asking" className="space-y-2.5 scroll-mt-24">
          <h2 className="section-serif text-fg">Asking for you</h2>
          <ul className="space-y-2.5">
            {askingForYou.map((b) => (
              <BondRow key={b.id} bond={b} onAccept={accept} onDecline={decline} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2.5">
        <h2 className="section-serif text-fg">Your thread</h2>
        {yourThread.length === 0 ? (
          <p className="text-sm text-fg-muted leading-relaxed px-0.5">
            No bonds on your thread yet — ask someone, or wait for an open ask.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {yourThread.map((b) => (
              <BondRow key={b.id} bond={b} onAccept={accept} onDecline={decline} />
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-fg-muted leading-relaxed text-center pt-1">
        Vessel to vessel · accept, decline, or ask across the night
      </p>
    </div>
  );
}
