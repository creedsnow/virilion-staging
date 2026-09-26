"use client";

import Image from "next/image";
import { useState } from "react";
import {
  MOONMARKET_SKINS,
  moonmarketDie,
  moonmarketSkin,
} from "@/lib/assets";

type Visibility = "private" | "scene" | "public";

type SkinId = (typeof MOONMARKET_SKINS)[number]["id"];

function CastingD20({
  value,
  rolling,
  skinId,
}: {
  value: number | null;
  rolling: boolean;
  skinId: SkinId;
}) {
  const settled = value != null && !rolling;
  const className = [
    "cast-d20",
    rolling ? "cast-d20-rolling" : "",
    settled ? "cast-d20-settled" : "",
    settled && value === 20 ? "cast-d20-nat20" : "",
    settled && value === 1 ? "cast-d20-nat1" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const skin = MOONMARKET_SKINS.find((s) => s.id === skinId) || MOONMARKET_SKINS[2];

  return (
    <div className={className} aria-live="polite">
      <span className="cast-d20-aura" aria-hidden />
      <div className="cast-d20-art-frame" aria-hidden>
        <Image
          src={moonmarketSkin(skin.id)}
          alt=""
          width={800}
          height={800}
          className="cast-d20-art"
          sizes="168px"
          priority
        />
        <span className="cast-d20-art-veil" />
      </div>
      <span className="cast-d20-value font-display">{value ?? "—"}</span>
      <span className="sr-only">
        {rolling
          ? "Casting"
          : value == null
            ? `Ready · ${skin.label} skin`
            : `Cast ${value} · ${skin.label}`}
      </span>
    </div>
  );
}

export default function DicePage() {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [skinId, setSkinId] = useState<SkinId>("gilded-coil");
  const [history, setHistory] = useState<
    { value: number; visibility: Visibility; skinId: SkinId; at: string }[]
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
            {
              value: final,
              visibility,
              skinId,
              at: new Date().toISOString(),
            },
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

  const activeSkin =
    MOONMARKET_SKINS.find((s) => s.id === skinId) || MOONMARKET_SKINS[2];

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
          Client-only ritual for staging. Skin art sits in the bowl — blank faces,
          number overlaid. From a scene room, Cast here stamps scene rolls into
          that chamber.
        </p>
      </div>

      <div className="card dice-stage rounded-2xl flex flex-col items-center py-9 gap-5 relative overflow-hidden">
        <span className="dice-stage-speckle" aria-hidden />
        <CastingD20 value={value} rolling={rolling} skinId={skinId} />
        {naturalLabel ? (
          <p className="section-kicker -mt-1 tracking-[0.18em]">{naturalLabel}</p>
        ) : (
          <p className="text-[11px] text-fg-muted -mt-1 tracking-wide">
            {rolling
              ? "The bowl turns…"
              : value == null
                ? `Ready · ${activeSkin.label}`
                : "Cast settles"}
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
          {rolling ? "Casting…" : "Cast the d20"}
        </button>
      </div>

      <section className="cast-shape-strip" aria-label="Die shapes">
        <div className="flex items-end justify-between gap-2 mb-2.5">
          <div>
            <p className="section-kicker mb-0.5">Shapes in the bowl</p>
            <p className="text-xs text-fg-muted leading-snug">
              No d20 product shot yet — bowl uses skin sets. Shop / Moonmarket
              deferred post-launch; art kept for later.
            </p>
          </div>
        </div>
        <div className="cast-shape-row">
          {(["d4", "d6", "d8", "d10", "d12", "dpercent"] as const).map((id) => (
            <div
              key={id}
              className="cast-shape-tile"
              title={id === "dpercent" ? "d%" : id}
            >
              <Image
                src={moonmarketDie(id)}
                alt=""
                width={200}
                height={200}
                className="cast-shape-img"
                sizes="72px"
              />
              <span>{id === "dpercent" ? "d%" : id}</span>
            </div>
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
              return (
                <li
                  key={`${h.at}-${i}`}
                  className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-fg-muted capitalize min-w-0">
                    {h.visibility}
                    <span className="text-fg-muted/60"> · {skinLabel}</span>
                  </span>
                  <span
                    className={`font-display text-xl font-semibold tabular-nums shrink-0 ${
                      h.value === 20 || h.value === 1
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
