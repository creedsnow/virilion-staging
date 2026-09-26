"use client";

import { useMemo, useState } from "react";
import { ORDER_HALLS, type OrderHall } from "@/lib/canon/orderHalls";
import { MAP_REGIONS, hallsForRegion, type MapRegion } from "@/lib/canon/mapRegions";
import { EmptyState } from "@/components/EmptyState";

type Filter = "all" | "places" | "halls";
type Selection =
  | { kind: "region"; id: string }
  | { kind: "hall"; id: string };

export default function MapPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sel, setSel] = useState<Selection>({ kind: "region", id: "virelios" });
  const [hoverId, setHoverId] = useState<string | null>(null);

  const region = useMemo(
    () => MAP_REGIONS.find((r) => r.id === (sel.kind === "region" ? sel.id : "")),
    [sel]
  );
  const hall = useMemo(
    () => ORDER_HALLS.find((h) => h.id === (sel.kind === "hall" ? sel.id : "")),
    [sel]
  );
  const regionHalls = region ? hallsForRegion(region.id) : [];

  const showPlaces = filter !== "halls";
  const showHalls = filter !== "places";

  function selectRegion(id: string) {
    setSel({ kind: "region", id });
  }
  function selectHall(id: string) {
    setSel({ kind: "hall", id });
  }

  return (
    <div className="space-y-4">
      <div className="rite-hero">
        <p className="section-kicker mb-1">World</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          One world,{" "}
          <span className="display-italic text-[1.05em]">sixteen holdings</span>
        </h1>
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">
          Colour marks whose homeland it is. Tap a region or Order Hall pin. No
          Google-Maps chrome. Wisp stays off the map.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="map-legend map-legend-hub">+ Virelios · everyone</span>
        <span className="map-legend map-legend-home">◆ Homelands · their People</span>
        <span className="map-legend map-legend-hall">❖ Order Halls · their class</span>
      </div>

      <div className="flex gap-2">
        {(
          [
            ["all", "All"],
            ["places", "Places"],
            ["halls", "Order Halls"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="chip text-xs"
            data-active={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="map-stage card p-0 overflow-hidden stone-panel rounded-2xl">
        <svg
          viewBox="0 0 360 270"
          className="w-full h-auto map-svg"
          aria-label="Virilion world colour map"
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="rgba(123,94,167,0.28)" />
              <stop offset="55%" stopColor="rgba(123,94,167,0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="mapVignette" cx="50%" cy="50%" r="72%">
              <stop offset="55%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(4,2,10,0.55)" />
            </radialGradient>
            <filter id="regionSoft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="regionSelect" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#e0c36a" floodOpacity="0.55" />
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#7b5ea7" floodOpacity="0.35" />
            </filter>
            <filter id="pinGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor="#a67cdd" floodOpacity="0.65" />
            </filter>
            <filter id="pinActive" x="-80%" y="-80%" width="260%" height="260%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#e0c36a" floodOpacity="0.75" />
            </filter>
          </defs>
          <rect width="360" height="270" fill="#0a0812" />
          <rect width="360" height="270" fill="url(#mapGlow)" />

          {showPlaces
            ? MAP_REGIONS.map((r) => {
                const active = sel.kind === "region" && sel.id === r.id;
                const hovered = hoverId === r.id && !active;
                return (
                  <g
                    key={r.id}
                    className="map-region cursor-pointer"
                    onClick={() => selectRegion(r.id)}
                    onMouseEnter={() => setHoverId(r.id)}
                    onMouseLeave={() => setHoverId(null)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") selectRegion(r.id);
                    }}
                    filter={active ? "url(#regionSelect)" : "url(#regionSoft)"}
                  >
                    <polygon
                      points={r.points}
                      fill={r.color}
                      opacity={active ? 0.95 : hovered ? 0.86 : 0.68}
                      stroke={
                        active
                          ? "#e8d28a"
                          : hovered
                            ? "rgba(224,195,106,0.65)"
                            : "rgba(46,42,58,0.75)"
                      }
                      strokeWidth={active ? 2.6 : hovered ? 1.6 : 1}
                      style={{ transition: "opacity 0.15s ease" }}
                    />
                    {/* soft inner wash */}
                    <polygon
                      points={r.points}
                      fill={active ? "rgba(224,195,106,0.14)" : "rgba(255,255,255,0.04)"}
                      style={{ pointerEvents: "none" }}
                    />
                    <text
                      x={r.cx}
                      y={r.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={r.kind === "hub" ? "#1a1408" : "#f5efe4"}
                      fontSize={r.kind === "hub" ? 9 : 6.5}
                      fontWeight={r.kind === "hub" ? 700 : 600}
                      letterSpacing="0.04em"
                      style={{ pointerEvents: "none" }}
                    >
                      {r.short}
                    </text>
                  </g>
                );
              })
            : null}

          {showHalls
            ? ORDER_HALLS.map((h, i) => {
                const host = MAP_REGIONS.find((r) => r.id === h.regionId);
                if (!host) return null;
                const siblings = ORDER_HALLS.filter((x) => x.regionId === h.regionId);
                const idx = siblings.findIndex((x) => x.id === h.id);
                const spread = siblings.length > 1 ? (idx - (siblings.length - 1) / 2) * 14 : 0;
                const x = host.cx + spread;
                const y = host.cy - (h.placement === "standalone" ? 18 : 10) - (i % 3);
                const active = sel.kind === "hall" && sel.id === h.id;
                return (
                  <g
                    key={h.id}
                    className="cursor-pointer"
                    filter={active ? "url(#pinActive)" : "url(#pinGlow)"}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectHall(h.id);
                    }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={active ? 7.5 : 5.8}
                      fill={active ? "#e0c36a" : "#16102a"}
                      stroke={active ? "#f5efe4" : "#b894e0"}
                      strokeWidth={1.6}
                    />
                    <text
                      x={x}
                      y={y + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={active ? "#1a1408" : "#e0c36a"}
                      fontSize="6"
                      style={{ pointerEvents: "none" }}
                    >
                      ❖
                    </text>
                  </g>
                );
              })
            : null}

          <rect width="360" height="270" fill="url(#mapVignette)" style={{ pointerEvents: "none" }} />
        </svg>
      </div>

      {sel.kind === "region" && region ? (
        <PlaceCard region={region} halls={regionHalls} onHall={selectHall} />
      ) : null}

      {sel.kind === "hall" && hall ? (
        <HallCard hall={hall} onRegion={() => selectRegion(hall.regionId)} />
      ) : null}

      {filter === "halls" || filter === "all" ? (
        <div>
          <div className="flex items-end justify-between gap-2 mb-2">
            <h2 className="section-serif text-lg">Order Halls</h2>
            <p className="text-[10px] uppercase tracking-wide text-fg-muted">
              Class-gated · not Border Pass
            </p>
          </div>
          <p className="text-xs text-fg-muted mb-3 leading-relaxed">
            Class clubhouses open to any People, plus the Blood Hideaway for
            vampires. Mix of hub/city attach and standalone landmarks.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {ORDER_HALLS.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  className="hall-tile w-full text-left"
                  data-active={sel.kind === "hall" && sel.id === h.id}
                  onClick={() => selectHall(h.id)}
                >
                  <span className="hall-tile-glyph" aria-hidden>
                    {h.glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-gold">
                      Order Hall · {h.tiedTo}
                    </span>
                    <span className="font-display text-base font-semibold text-fg block truncate">
                      {h.name}
                    </span>
                    <span className="text-[11px] text-fg-muted block truncate">
                      {h.mapPlace}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <EmptyState
        title="Border Pass"
        body="Each vessel earns access separately. Staging shows places; passport checks ship with live place gates."
      />
    </div>
  );
}

function PlaceCard({
  region,
  halls,
  onHall,
}: {
  region: MapRegion;
  halls: OrderHall[];
  onHall: (id: string) => void;
}) {
  const status =
    region.kind === "hub"
      ? "Open to all · world capital · every People, no pass"
      : region.kind === "wastes"
        ? "Wild holding · Border Pass later"
        : region.culture
          ? `Homeland of the ${region.culture}`
          : "Homeland · Border Pass later";

  return (
    <article className="place-card">
      <div className="place-card-sheen" aria-hidden />
      <p className="relative z-[1] text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
        {region.kind === "hub"
          ? "Open hub · everyone"
          : region.kind === "wastes"
            ? "Wild holding"
            : region.culture
              ? `Homeland of the ${region.culture}`
              : "Homeland"}
      </p>
      <h2 className="relative z-[1] font-display text-2xl font-semibold text-fg leading-tight">
        {region.label}
      </h2>
      <div
        className="relative z-[1] mt-2 mb-3 h-1.5 w-16 rounded-full"
        style={{
          background: region.color,
          boxShadow: `0 0 12px ${region.color}88`,
        }}
        aria-hidden
      />
      <p className="relative z-[1] text-sm text-fg-muted leading-relaxed">{region.note}</p>
      <div className="place-status relative z-[1]" data-kind={region.kind}>
        {status}
      </div>
      {halls.length > 0 ? (
        <div className="relative z-[1] mt-3 pt-3 border-t border-border/60 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wide text-gold">
            Order Halls here
          </p>
          <div className="flex flex-wrap gap-1.5">
            {halls.map((h) => (
              <button
                key={h.id}
                type="button"
                className="chip text-xs !min-h-0 py-1.5"
                onClick={() => onHall(h.id)}
              >
                ❖ {h.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function HallCard({ hall, onRegion }: { hall: OrderHall; onRegion: () => void }) {
  const host = MAP_REGIONS.find((r) => r.id === hall.regionId);
  const vampire = hall.tiedTo.includes("Vampire");
  return (
    <article className="place-card place-card-hall">
      <div className="place-card-sheen" aria-hidden />
      <p className="relative z-[1] text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
        Order Hall · {hall.tiedTo}
      </p>
      <h2 className="relative z-[1] font-display text-2xl font-semibold text-fg leading-tight">
        {hall.name}
      </h2>
      <p className="relative z-[1] text-sm text-fg-muted mt-2 leading-relaxed">
        {hall.mapPlace}. Access is class-gated
        {vampire ? " (vampirism affliction)" : ""} — not Border Pass.
      </p>
      <div
        className="place-status relative z-[1]"
        data-kind="hall"
      >
        Class-gated · {hall.tiedTo}
        {vampire ? " · vampirism" : ""}
      </div>
      <div className="relative z-[1] mt-3 flex flex-wrap gap-2 items-center">
        <span className="demo-badge">
          {hall.placement === "standalone" ? "Standalone landmark" : "In / attached to place"}
        </span>
        <span className="text-xs text-fg-muted">{hall.channel}</span>
      </div>
      {host ? (
        <button
          type="button"
          className="relative z-[1] mt-3 text-xs text-gold hover:text-gold-soft"
          onClick={onRegion}
        >
          → View {host.label}
        </button>
      ) : null}
    </article>
  );
}
