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

      <div className="card p-0 overflow-hidden stone-panel rounded-2xl">
        <svg
          viewBox="0 0 360 270"
          className="w-full h-auto bg-[#0a0812]"
          aria-label="Virilion world colour map"
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(123,94,167,0.22)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="360" height="270" fill="#0a0812" />
          <rect width="360" height="270" fill="url(#mapGlow)" />

          {showPlaces
            ? MAP_REGIONS.map((r) => {
                const active = sel.kind === "region" && sel.id === r.id;
                return (
                  <g
                    key={r.id}
                    className="cursor-pointer"
                    onClick={() => selectRegion(r.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") selectRegion(r.id);
                    }}
                  >
                    <polygon
                      points={r.points}
                      fill={r.color}
                      opacity={active ? 0.92 : 0.72}
                      stroke={active ? "#e0c36a" : "rgba(46,42,58,0.9)"}
                      strokeWidth={active ? 2.4 : 1}
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
                // Fan pins slightly so hub halls don't stack perfectly
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
                    onClick={(e) => {
                      e.stopPropagation();
                      selectHall(h.id);
                    }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={active ? 7 : 5.5}
                      fill={active ? "#e0c36a" : "#1a1030"}
                      stroke={active ? "#f5efe4" : "#a67cdd"}
                      strokeWidth={1.5}
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
  return (
    <article className="place-card">
      <p className="text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
        {region.kind === "hub"
          ? "Open hub · everyone"
          : region.kind === "wastes"
            ? "Wild holding"
            : region.culture
              ? `Homeland of the ${region.culture}`
              : "Homeland"}
      </p>
      <h2 className="font-display text-2xl font-semibold text-fg leading-tight">
        {region.label}
      </h2>
      <div
        className="mt-2 mb-3 h-1.5 w-16 rounded-full"
        style={{ background: region.color }}
        aria-hidden
      />
      <p className="text-sm text-fg-muted leading-relaxed">{region.note}</p>
      {halls.length > 0 ? (
        <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5">
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
  return (
    <article className="place-card place-card-hall">
      <p className="text-[10px] uppercase tracking-[0.16em] text-gold mb-1">
        Order Hall · {hall.tiedTo}
      </p>
      <h2 className="font-display text-2xl font-semibold text-fg leading-tight">
        {hall.name}
      </h2>
      <p className="text-sm text-fg-muted mt-2 leading-relaxed">
        {hall.mapPlace}. Access is class-gated
        {hall.tiedTo.includes("Vampire") ? " (vampirism affliction)" : ""} — not
        Border Pass.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <span className="demo-badge">
          {hall.placement === "standalone" ? "Standalone landmark" : "In / attached to place"}
        </span>
        <span className="text-xs text-fg-muted">{hall.channel}</span>
      </div>
      {host ? (
        <button
          type="button"
          className="mt-3 text-xs text-gold hover:text-gold-soft"
          onClick={onRegion}
        >
          → View {host.label}
        </button>
      ) : null}
    </article>
  );
}
