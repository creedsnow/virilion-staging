"use client";

import { useState } from "react";

type Visibility = "private" | "scene" | "public";

export default function DicePage() {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [history, setHistory] = useState<
    { value: number; visibility: Visibility; at: string }[]
  >([]);

  function roll() {
    setRolling(true);
    setValue(null);
    const duration = 700 + Math.random() * 400;
    const start = performance.now();
    const tick = (now: number) => {
      setValue(1 + Math.floor(Math.random() * 20));
      if (now - start < duration) {
        requestAnimationFrame(tick);
      } else {
        const final = 1 + Math.floor(Math.random() * 20);
        setValue(final);
        setRolling(false);
        setHistory((h) =>
          [
            { value: final, visibility, at: new Date().toISOString() },
            ...h,
          ].slice(0, 8)
        );
      }
    };
    requestAnimationFrame(tick);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="section-kicker mb-1">Ritual</p>
        <h1 className="font-display text-3xl font-semibold text-fg">d20</h1>
        <p className="text-sm text-fg-muted mt-1">
          Premium dice ritual. Staging rolls client-side; social fairness authority later.
        </p>
      </div>

      <div className="card stone-panel rounded-2xl flex flex-col items-center py-10 gap-4">
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-gold bg-bg-elevated text-4xl font-semibold text-gold-soft shadow-[0_0_40px_rgba(201,162,39,0.25)] ${
            rolling ? "animate-pulse" : ""
          }`}
          aria-live="polite"
        >
          {value ?? "—"}
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {(["private", "scene", "public"] as Visibility[]).map((v) => (
            <button
              key={v}
              type="button"
              className="chip capitalize"
              data-active={visibility === v}
              onClick={() => setVisibility(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <button type="button" className="btn-gold px-10" onClick={roll} disabled={rolling}>
          {rolling ? "Rolling…" : "Roll d20"}
        </button>
      </div>

      {history.length > 0 ? (
        <div className="card">
          <h2 className="text-sm font-medium text-fg mb-2">Recent</h2>
          <ul className="text-sm text-fg-muted space-y-1">
            {history.map((h, i) => (
              <li key={`${h.at}-${i}`}>
                <span className="text-gold-soft font-medium">{h.value}</span> · {h.visibility}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
