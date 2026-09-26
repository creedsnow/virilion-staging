"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ORDER_HALLS, type OrderHall } from "@/lib/canon/orderHalls";
import { MAP_REGIONS, hallsForRegion, type MapRegion } from "@/lib/canon/mapRegions";
import { CLASSES } from "@/lib/canon/classes";
import { SceneRoom } from "@/components/SceneRoom";
import { sceneForHall, sceneForPlace, type SceneInfo } from "@/lib/scenes";
import { getVessel, subscribeVessel } from "@/lib/storage";
import type { Vessel } from "@/lib/types";

type Filter = "all" | "places" | "halls";
type Selection =
  | { kind: "region"; id: string }
  | { kind: "hall"; id: string };

function demoHeat(id: string): number {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return (n % 5) + 2;
}

function hallGate(
  hall: OrderHall,
  vessel: Vessel | null
): { enterable: boolean; label: string; reason: string } {
  if (!vessel) {
    return {
      enterable: false,
      label: "Locked",
      reason: "Embody a Vessel in the Rite first.",
    };
  }
  if (hall.id === "the-blood-hideaway") {
    return {
      enterable: false,
      label: "Locked",
      reason: "Vampirism affliction required · locked for now",
    };
  }
  const cls = CLASSES.find((c) => c.id === vessel.classId);
  const className = cls?.name || vessel.classId;
  if (vessel.classId === "custom" || !cls || cls.name !== hall.tiedTo) {
    return {
      enterable: false,
      label: "Locked",
      reason: `${hall.tiedTo} class only · you are ${className}`,
    };
  }
  return {
    enterable: true,
    label: "Open to your class",
    reason: `Your ${hall.tiedTo} seal opens this hall.`,
  };
}

function resolveRoom(
  placeId: string | null,
  hallId: string | null,
  vessel: Vessel | null
): SceneInfo | null {
  if (hallId) {
    const h = ORDER_HALLS.find((x) => x.id === hallId);
    if (!h) return null;
    const gate = hallGate(h, vessel);
    if (!gate.enterable) return null;
    return sceneForHall({
      id: h.id,
      name: h.name,
      mapPlace: h.mapPlace,
      tiedTo: h.tiedTo,
    });
  }
  if (placeId) {
    const r = MAP_REGIONS.find((x) => x.id === placeId);
    if (!r) return null;
    return sceneForPlace({
      id: r.id,
      label: r.label,
      note: r.note,
      kind: r.kind,
    });
  }
  return null;
}

function MapInner() {
  const router = useRouter();
  const search = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [sel, setSel] = useState<Selection>({ kind: "region", id: "virelios" });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hallsOpen, setHallsOpen] = useState(false);
  const [vessel, setVesselState] = useState<Vessel | null>(null);
  const [booted, setBooted] = useState(false);

  const placeId = search.get("place");
  const hallId = search.get("hall");

  useEffect(() => {
    function hydrate() {
      setVesselState(getVessel());
      setBooted(true);
    }
    hydrate();
    return subscribeVessel(hydrate);
  }, []);

  // Keep selection aligned with room identity so Back lands on the right card.
  useEffect(() => {
    if (hallId && ORDER_HALLS.some((h) => h.id === hallId)) {
      setSel({ kind: "hall", id: hallId });
      return;
    }
    if (placeId && MAP_REGIONS.some((r) => r.id === placeId)) {
      setSel({ kind: "region", id: placeId });
    }
  }, [placeId, hallId]);

  const active = useMemo(
    () => (booted ? resolveRoom(placeId, hallId, vessel) : null),
    [booted, placeId, hallId, vessel]
  );

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

  function enterPlace(id: string) {
    router.replace(`/map?place=${encodeURIComponent(id)}`, { scroll: false });
  }

  function enterHall(id: string) {
    router.replace(`/map?hall=${encodeURIComponent(id)}`, { scroll: false });
  }

  function leaveRoom() {
    router.replace("/map", { scroll: false });
  }

  if (!booted) {
    return <p className="text-sm text-fg-muted">Unfurling the map…</p>;
  }

  if (active && vessel) {
    return (
      <SceneRoom
        scene={active}
        vessel={vessel}
        onBack={leaveRoom}
        backLabel="← Map"
      />
    );
  }

  return (
    <div className="space-y-4 map-chamber">
      <div className="map-hero">
        <div className="map-hero-sheen" aria-hidden />
        <div className="relative z-[1]">
          <p className="realm-kicker mb-1.5">World</p>
          <h1 className="map-hero-title">
            One world,{" "}
            <span className="display-italic">sixteen holdings</span>
          </h1>
          <p className="map-hero-sub">
            Tap a region or Order Hall pin, then Enter. Colour marks whose homeland
            it is.
          </p>
        </div>
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
            onClick={() => {
              setFilter(id);
              if (id === "halls") setHallsOpen(true);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="map-stage map-stage-hero map-stage-weight card p-0 overflow-hidden stone-panel rounded-2xl">
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
                const activeRegion = sel.kind === "region" && sel.id === r.id;
                const hovered = hoverId === r.id && !activeRegion;
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
                    filter={activeRegion ? "url(#regionSelect)" : "url(#regionSoft)"}
                  >
                    <polygon
                      points={r.points}
                      fill={r.color}
                      opacity={activeRegion ? 0.95 : hovered ? 0.86 : 0.68}
                      stroke={
                        activeRegion
                          ? "#e8d28a"
                          : hovered
                            ? "rgba(224,195,106,0.65)"
                            : "rgba(46,42,58,0.75)"
                      }
                      strokeWidth={activeRegion ? 2.6 : hovered ? 1.6 : 1}
                      style={{ transition: "opacity 0.15s ease" }}
                    />
                    <polygon
                      points={r.points}
                      fill={activeRegion ? "rgba(224,195,106,0.14)" : "rgba(255,255,255,0.04)"}
                      style={{ pointerEvents: "none" }}
                    />
                    <text
                      className="map-region-label"
                      x={r.cx}
                      y={r.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={r.kind === "hub" ? "#1a1408" : "#f5efe4"}
                      fontSize={r.kind === "hub" ? 10 : 7.5}
                      fontWeight={r.kind === "hub" ? 700 : 600}
                      letterSpacing="0.03em"
                      stroke={r.kind === "hub" ? "rgba(255,248,230,0.35)" : "rgba(8,6,14,0.72)"}
                      strokeWidth={r.kind === "hub" ? 0.35 : 0.9}
                      paintOrder="stroke fill"
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
                const activeHall = sel.kind === "hall" && sel.id === h.id;
                return (
                  <g
                    key={h.id}
                    className="cursor-pointer"
                    filter={activeHall ? "url(#pinActive)" : "url(#pinGlow)"}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectHall(h.id);
                    }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={activeHall ? 7.5 : 5.8}
                      fill={activeHall ? "#e0c36a" : "#16102a"}
                      stroke={activeHall ? "#f5efe4" : "#b894e0"}
                      strokeWidth={1.6}
                    />
                    <text
                      x={x}
                      y={y + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={activeHall ? "#1a1408" : "#e0c36a"}
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
        <PlaceCard
          key={`place-${region.id}`}
          region={region}
          halls={regionHalls}
          vessel={vessel}
          onHall={selectHall}
          onEnter={() => {
            if (!vessel) return;
            enterPlace(region.id);
          }}
        />
      ) : null}

      {sel.kind === "hall" && hall ? (
        <HallCard
          key={`hall-${hall.id}`}
          hall={hall}
          vessel={vessel}
          onRegion={() => selectRegion(hall.regionId)}
          onEnter={() => {
            if (!vessel) return;
            const gate = hallGate(hall, vessel);
            if (!gate.enterable) return;
            enterHall(hall.id);
          }}
        />
      ) : null}

      {filter === "halls" || filter === "all" ? (
        <div className="map-halls-secondary">
          <button
            type="button"
            className="map-halls-toggle w-full text-left"
            aria-expanded={hallsOpen || filter === "halls"}
            onClick={() => setHallsOpen((v) => !v)}
          >
            <span className="min-w-0">
              <span className="section-serif text-lg text-fg block">Order Halls</span>
              <span className="text-[10px] uppercase tracking-wide text-fg-muted">
                Class-gated · not Border Pass · {ORDER_HALLS.length} holdings
              </span>
            </span>
            <span className="text-fg-muted text-sm shrink-0" aria-hidden>
              {hallsOpen || filter === "halls" ? "▾" : "▸"}
            </span>
          </button>
          {hallsOpen || filter === "halls" ? (
            <div className="mt-3">
              <p className="text-xs text-fg-muted mb-3 leading-relaxed">
                Class clubhouses · Blood Hideaway for vampires.
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {ORDER_HALLS.map((h) => {
                  const gate = hallGate(h, vessel);
                  return (
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
                          <span className="hall-tile-name truncate">
                            {h.name}
                          </span>
                          <span className="text-[11px] text-fg-muted block truncate">
                            {gate.enterable ? h.mapPlace : gate.label + " · " + gate.reason}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="map-lock-strip" role="note">
        <span className="map-lock-chip" data-state="open">Open</span>
        <span className="map-lock-chip" data-state="preview">Preview</span>
        <span className="map-lock-chip" data-state="locked">Locked</span>
        <span className="text-[10px] text-fg-muted tracking-wide">
          Border Pass · states on cards
        </span>
      </div>
    </div>
  );
}


export default function MapPage() {
  return (
    <Suspense fallback={<p className="text-sm text-fg-muted">Unfurling the map…</p>}>
      <MapInner />
    </Suspense>
  );
}

function PlaceCard({
  region,
  halls,
  vessel,
  onHall,
  onEnter,
}: {
  region: MapRegion;
  halls: OrderHall[];
  vessel: Vessel | null;
  onHall: (id: string) => void;
  onEnter: () => void;
}) {
  const heat = demoHeat(region.id);
  const isHub = region.kind === "hub";
  const isWastes = region.kind === "wastes";
  const accessState = isHub ? "open" : "preview";
  const accessLabel = isHub ? "Open" : "Preview";
  const status = isHub
    ? "Open · all Peoples · no pass"
    : isWastes
      ? "Preview · wild holding"
      : region.culture
        ? `Preview · ${region.culture} homeland · Border Pass later`
        : "Preview · homeland · Border Pass later";

  return (
    <article className="place-card place-card-arrive" data-arrive="true">
      <div className="place-card-sheen" aria-hidden />
      <div className="place-arrive-ring" aria-hidden />
      <div className="relative z-[1] flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="place-arrive-kicker mb-1">
            {isHub
              ? "Open hub · everyone"
              : isWastes
                ? "Wild holding"
                : region.culture
                  ? `Homeland of the ${region.culture}`
                  : "Homeland"}
          </p>
          <h2 className="place-arrive-title">
            {region.label}
          </h2>
        </div>
        <span className="place-heat shrink-0" title="Gathering heat · demo" data-heat={heat}>
          <span className="place-heat-pips" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} data-on={i < heat ? "true" : "false"} />
            ))}
          </span>
          <span>{heat}</span>
        </span>
      </div>
      <div
        className="relative z-[1] mt-2 mb-3 h-1.5 w-16 rounded-full place-arrive-swatch"
        style={{
          background: region.color,
          boxShadow: `0 0 14px ${region.color}99`,
        }}
        aria-hidden
      />
      <p className="relative z-[1] place-arrive-note">{region.note}</p>
      <div className="place-status relative z-[1]" data-kind={region.kind} data-state={accessState}>
        <span className="place-state-pill" data-state={accessState}>
          {accessLabel}
        </span>
        <span>{status}</span>
      </div>
      <div className="place-enter-frame relative z-[1]">
        {vessel ? (
          <button type="button" className="btn-gold place-enter-cta text-sm py-2 px-4 !min-h-0" onClick={onEnter}>
            Enter place
          </button>
        ) : (
          <Link href="/rite" className="btn-gold place-enter-cta text-sm py-2 px-4 !min-h-0 inline-flex">
            Rite first
          </Link>
        )}
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

function HallCard({
  hall,
  vessel,
  onRegion,
  onEnter,
}: {
  hall: OrderHall;
  vessel: Vessel | null;
  onRegion: () => void;
  onEnter: () => void;
}) {
  const host = MAP_REGIONS.find((r) => r.id === hall.regionId);
  const vampire = hall.tiedTo.includes("Vampire");
  const gate = hallGate(hall, vessel);
  const heat = demoHeat(hall.id);

  return (
    <article className="place-card place-card-hall place-card-arrive" data-arrive="true">
      <div className="place-card-sheen" aria-hidden />
      <div className="place-arrive-ring" aria-hidden />
      <div className="relative z-[1] flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="place-arrive-kicker mb-1">
            Order Hall · {hall.tiedTo}
          </p>
          <h2 className="place-arrive-title">
            {hall.name}
          </h2>
        </div>
        <span className="place-heat shrink-0" title="Gathering heat · demo" data-heat={heat}>
          <span className="place-heat-pips" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} data-on={i < heat ? "true" : "false"} />
            ))}
          </span>
          <span>{heat}</span>
        </span>
      </div>
      <p className="relative z-[1] place-arrive-note mt-2">
        {hall.mapPlace}
        {vampire ? " · vampirism gate" : " · class-gated"}
        {" · not Border Pass"}
      </p>
      <div
        className="place-status relative z-[1]"
        data-kind={gate.enterable ? "hall" : "locked"}
        data-state={gate.enterable ? "open" : "locked"}
      >
        <span
          className="place-state-pill"
          data-state={gate.enterable ? "open" : "locked"}
        >
          {gate.enterable ? "Open" : gate.label}
        </span>
        <span>{gate.reason}</span>
      </div>
      <div className="place-enter-frame relative z-[1]">
        {gate.enterable ? (
          <button type="button" className="btn-gold place-enter-cta text-sm py-2 px-4 !min-h-0" onClick={onEnter}>
            Enter hall
          </button>
        ) : vessel ? (
          <span
            className="place-locked-cta"
            title={gate.reason}
          >
            Locked
          </span>
        ) : (
          <Link href="/rite" className="btn-gold place-enter-cta text-sm py-2 px-4 !min-h-0 inline-flex">
            Rite first
          </Link>
        )}
        <span className="place-enter-meta">
          {hall.placement === "standalone" ? "Standalone" : "Attached"} · {hall.hallLabel}
        </span>
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
