"use client";

import { useState } from "react";

type Visibility = "private" | "scene" | "public";

function CastingD20({ value, rolling }: { value: number | null; rolling: boolean }) {
  return (
    <div className={`cast-d20 ${rolling ? "cast-d20-rolling" : ""}`} aria-live="polite">
      <span className="cast-d20-aura" aria-hidden />
      <svg
        className="cast-d20-svg"
        viewBox="0 0 120 120"
        width="132"
        height="132"
        aria-hidden
      >
        <defs>
          <linearGradient id="d20Face" x1="18%" y1="8%" x2="85%" y2="92%">
            <stop offset="0%" stopColor="#d8b85a" stopOpacity="0.55" />
            <stop offset="42%" stopColor="#1c1828" />
            <stop offset="100%" stopColor="#100e18" />
          </linearGradient>
          <linearGradient id="d20Edge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e4c86a" />
            <stop offset="100%" stopColor="#c9a227" stopOpacity="0.75" />
          </linearGradient>
        </defs>
        <polygon
          points="60,8 108,36 108,84 60,112 12,84 12,36"
          fill="url(#d20Face)"
          stroke="url(#d20Edge)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M60 8 L108 36 L60 52 Z M60 8 L12 36 L60 52 Z M12 36 L12 84 L60 52 Z M108 36 L108 84 L60 52 Z M12 84 L60 112 L60 52 Z M108 84 L60 112 L60 52 Z"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1.1"
          opacity="0.55"
        />
        <path
          d="M60 8 L60 52 M12 36 L108 36 M12 84 L60 52 L108 84"
          fill="none"
          stroke="#7b5ea7"
          strokeWidth="0.9"
          opacity="0.5"
        />
      </svg>
      <span className="cast-d20-value font-display">
        {value ?? "—"}
      </span>
    </div>
  );
}

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

  const naturalLabel =
    value == null
      ? null
      : value === 20
        ? "Natural 20"
        : value === 1
          ? "Natural 1"
          : null;

  return (
    <div className="space-y-5">
      <div className="rite-hero">
        <p className="section-kicker mb-1">Ritual</p>
        <h1 className="font-display text-[1.85rem] sm:text-3xl font-semibold text-fg leading-tight">
          The Casting Bowl
        </h1>
        <p className="display-italic text-[1.05rem] mt-1.5">
          Witnessed under the lamps
        </p>
        <p className="text-sm text-fg-muted mt-2 leading-relaxed">
          Client-only ritual for staging. From a scene room, Cast here stamps scene rolls
          into that chamber.
        </p>
      </div>

      <div className="card dice-stage rounded-2xl flex flex-col items-center py-9 gap-5 relative overflow-hidden">
        <span className="dice-stage-speckle" aria-hidden />
        <CastingD20 value={value} rolling={rolling} />
        {naturalLabel ? (
          <p className="section-kicker -mt-1 tracking-[0.18em]">{naturalLabel}</p>
        ) : (
          <p className="text-[11px] text-fg-muted -mt-1 tracking-wide">
            {rolling ? "The bowl turns…" : value == null ? "Ready when you are" : "Cast settles"}
          </p>
        )}

        <div className="flex gap-2 flex-wrap justify-center px-1" role="group" aria-label="Witnessed by">
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

        <button
          type="button"
          className="btn-cast"
          onClick={roll}
          disabled={rolling}
        >
          {rolling ? "Casting…" : "Cast the d20"}
        </button>
      </div>

      {history.length > 0 ? (
        <div className="card stone-panel rounded-2xl">
          <p className="section-kicker mb-2.5">Your table</p>
          <ul className="space-y-2.5">
            {history.map((h, i) => (
              <li
                key={`${h.at}-${i}`}
                className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0"
              >
                <span className="text-sm text-fg-muted capitalize">
                  {h.visibility}
                  <span className="text-fg-muted/60"> · witnessed</span>
                </span>
                <span
                  className={`font-display text-xl font-semibold tabular-nums ${
                    h.value === 20 || h.value === 1 ? "text-gold" : "text-gold-soft"
                  }`}
                >
                  {h.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
