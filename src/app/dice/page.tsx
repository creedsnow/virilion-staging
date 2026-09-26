"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiceStage, type DiceStageHandle } from "@/components/DiceStage";
import {
  MOONMARKET_SKINS,
  moonmarketDie,
  moonmarketSkin,
} from "@/lib/assets";
import type { DiceSettledDetail } from "@/types/dice-stage";

type Visibility = "private" | "scene" | "public";

type SkinId = (typeof MOONMARKET_SKINS)[number]["id"];

/** Moonmarket skin id → dice-kit theme name. */
const SKIN_TO_THEME: Record<SkinId, string> = {
  "night-court": "nightcourt",
  starveil: "starveil",
  "gilded-coil": "gilded",
  "parchment-bone": "bone",
  mosswood: "mosswood",
};

type ShapeId = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "dpercent";

const SHAPE_SIDES: Record<ShapeId, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  dpercent: 100,
};

function shapeLabel(id: ShapeId): string {
  return id === "dpercent" ? "d%" : id;
}

function randomResult(sides: number): string {
  if (sides === 100) {
    const tens = Math.floor(Math.random() * 10) * 10;
    return String(tens).padStart(2, "0");
  }
  return String(1 + Math.floor(Math.random() * sides));
}

export default function DicePage() {
  const stageRef = useRef<DiceStageHandle>(null);
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [skinId, setSkinId] = useState<SkinId>("gilded-coil");
  const [sides, setSides] = useState(20);
  const [shapeId, setShapeId] = useState<ShapeId>("d20");
  const [muted, setMuted] = useState(false);
  const [history, setHistory] = useState<
    {
      value: string;
      sides: number;
      visibility: Visibility;
      skinId: SkinId;
      at: string;
    }[]
  >([]);

  const theme = SKIN_TO_THEME[skinId] || "gilded";

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMuted(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onSettled = useCallback(
    (detail: DiceSettledDetail) => {
      setValue(detail.result);
      setRolling(false);
      setHistory((h) =>
        [
          {
            value: detail.result,
            sides: detail.sides,
            visibility,
            skinId,
            at: new Date().toISOString(),
          },
          ...h,
        ].slice(0, 8)
      );
    },
    [visibility, skinId]
  );

  async function roll() {
    if (rolling) return;
    const el = stageRef.current;
    if (!el) return;
    setRolling(true);
    setValue(null);
    const result = randomResult(sides);
    try {
      await el.roll({ sides, result, theme });
    } catch {
      setRolling(false);
    }
  }

  function pickShape(id: ShapeId) {
    if (rolling) return;
    setShapeId(id);
    setSides(SHAPE_SIDES[id]);
    setValue(null);
  }

  const naturalLabel =
    value == null || sides !== 20
      ? null
      : value === "20"
        ? "Natural 20"
        : value === "1"
          ? "Natural 1"
          : null;

  const activeSkin =
    MOONMARKET_SKINS.find((s) => s.id === skinId) || MOONMARKET_SKINS[2];

  const castLabel =
    shapeId === "dpercent"
      ? "Cast the d%"
      : `Cast the ${shapeId}`;

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
          Client-only ritual for staging. A real 3D die tumbles in the bowl —
          Moonmarket skins paint its faces. From a scene room, Cast here stamps
          scene rolls into that chamber.
        </p>
      </div>

      <div className="card dice-stage rounded-2xl flex flex-col items-center py-7 gap-5 relative overflow-hidden">
        <span className="dice-stage-speckle" aria-hidden />
        <DiceStage
          ref={stageRef}
          theme={theme}
          muted={muted}
          className="dice-kit-host relative z-[1]"
          onSettled={onSettled}
        />
        {naturalLabel ? (
          <p className="section-kicker -mt-1 tracking-[0.18em]">{naturalLabel}</p>
        ) : (
          <p className="text-[11px] text-fg-muted -mt-1 tracking-wide">
            {rolling
              ? "The bowl turns…"
              : value == null
                ? `Ready · ${activeSkin.label} · ${shapeLabel(shapeId)}`
                : `Cast settles · ${value}`}
          </p>
        )}

        <div
          className="cast-skin-row"
          role="group"
          aria-label="Dice skin in the bowl"
        >
          {MOONMARKET_SKINS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="cast-skin-chip"
              data-active={skinId === s.id}
              aria-pressed={skinId === s.id}
              title={s.label}
              onClick={() => setSkinId(s.id)}
              disabled={rolling}
            >
              <Image
                src={moonmarketSkin(s.id)}
                alt=""
                width={64}
                height={64}
                className="cast-skin-chip-img"
                sizes="40px"
              />
              <span className="cast-skin-chip-label">{s.label}</span>
            </button>
          ))}
        </div>

        <div
          className="flex gap-2 flex-wrap justify-center px-1"
          role="group"
          aria-label="Witnessed by"
        >
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
          {rolling ? "Casting…" : castLabel}
        </button>
      </div>

      <section className="cast-shape-strip" aria-label="Die shapes">
        <div className="flex items-end justify-between gap-2 mb-2.5">
          <div>
            <p className="section-kicker mb-0.5">Shapes in the bowl</p>
            <p className="text-xs text-fg-muted leading-snug">
              Tap a shape to change sides on the stage. Shop / Moonmarket
              deferred post-launch; art kept for later.
            </p>
          </div>
        </div>
        <div className="cast-shape-row">
          {(
            [
              "d4",
              "d6",
              "d8",
              "d10",
              "d12",
              "d20",
              "dpercent",
            ] as const
          ).map((id) => (
            <button
              key={id}
              type="button"
              className="cast-shape-tile"
              data-active={shapeId === id}
              aria-pressed={shapeId === id}
              title={shapeLabel(id)}
              disabled={rolling}
              onClick={() => pickShape(id)}
            >
              {id === "d20" ? (
                <span className="cast-shape-d20-mark font-display" aria-hidden>
                  20
                </span>
              ) : (
                <Image
                  src={moonmarketDie(id === "dpercent" ? "dpercent" : id)}
                  alt=""
                  width={200}
                  height={200}
                  className="cast-shape-img"
                  sizes="72px"
                />
              )}
              <span>{shapeLabel(id)}</span>
            </button>
          ))}
        </div>
      </section>

      {history.length > 0 ? (
        <div className="card stone-panel rounded-2xl">
          <p className="section-kicker mb-2.5">Your table</p>
          <ul className="space-y-2.5">
            {history.map((h, i) => {
              const skinLabel =
                MOONMARKET_SKINS.find((s) => s.id === h.skinId)?.label ||
                h.skinId;
              const dieTag =
                h.sides === 100 ? "d%" : h.sides === 20 ? "d20" : `d${h.sides}`;
              return (
                <li
                  key={`${h.at}-${i}`}
                  className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-fg-muted capitalize min-w-0">
                    {h.visibility}
                    <span className="text-fg-muted/60">
                      {" "}
                      · {skinLabel} · {dieTag}
                    </span>
                  </span>
                  <span
                    className={`font-display text-xl font-semibold tabular-nums shrink-0 ${
                      h.sides === 20 && (h.value === "20" || h.value === "1")
                        ? "text-gold"
                        : "text-gold-soft"
                    }`}
                  >
                    {h.value}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
