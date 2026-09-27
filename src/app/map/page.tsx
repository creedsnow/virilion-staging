"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ORDER_HALLS, type OrderHall } from "@/lib/canon/orderHalls";
import { MAP_REGIONS, hallsForRegion, type MapRegion } from "@/lib/canon/mapRegions";
import { CLASSES } from "@/lib/canon/classes";
import { SceneRoom } from "@/components/SceneRoom";
import { sceneForHall, sceneForPlace, type SceneInfo } from "@/lib/scenes";
import { getVessel, subscribeVessel } from "@/lib/storage";
import type { Vessel } from "@/lib/types";
import {
  codexHallCard,
  codexHallCardSm,
  codexPlaceCard,
  codexPlaceCardSm,
  worldMap,
} from "@/lib/assets";

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
      reason: "Embody a Character in the Rite first.",
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
  const [hallsOpen, setHallsOpen] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
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
            Tap a hotspot on the painted atlas to open a place. Order Halls
            stay on the list below — Enter from the detail card.
          </p>
        </div>
      </div>

      <figure className="map-world-paint map-atlas-primary stone-panel rounded-2xl">
        <div
          className="map-world-paint-scroll"
          tabIndex={0}
          aria-label="Painted Virilion atlas · scroll to explore · tap regions"
        >
          <div className="map-atlas-surface">
            <Image
              src={worldMap()}
              alt="Painted map of Virilion — sixteen holdings across one vast world"
              width={959}
              height={1616}
              className="map-world-paint-img"
              sizes="(max-width: 900px) 100vw, 860px"
              priority
            />
            {showPlaces
              ? MAP_REGIONS.map((r) => {
                  const activeRegion = sel.kind === "region" && sel.id === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`map-atlas-hotspot ${activeRegion ? "is-active" : ""} ${
                        r.kind === "hub" ? "is-hub" : ""
                      }`}
                      style={{
                        left: `${r.atlasPct.x}%`,
                        top: `${r.atlasPct.y}%`,
                      }}
                      aria-label={r.label}
                      aria-pressed={activeRegion}
                      onClick={() => selectRegion(r.id)}
                    >
                      <span className="map-atlas-hotspot-dot" style={{ background: r.color }} />
                      <span className="map-atlas-hotspot-label">{r.short}</span>
                    </button>
                  );
                })
              : null}
          </div>
        </div>
        <figcaption className="map-world-paint-cap">
          Painted atlas · primary map · approximate hotspots
        </figcaption>
      </figure>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="map-legend map-legend-hub">+ Virelios · everyone</span>
        <span className="map-legend map-legend-home">◆ Homelands · their People</span>
        <span className="map-legend map-legend-hall">❖ Order Halls · their class</span>
        <button
          type="button"
          className="chip text-xs ml-auto"
          data-active={showOutline}
          onClick={() => setShowOutline((v) => !v)}
        >
          {showOutline ? "Hide colour outline" : "Colour outline"}
        </button>
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

      {showOutline ? (
        <div className="map-stage map-stage-fallback card p-0 overflow-hidden stone-panel rounded-2xl">
          <p className="map-fallback-label">Colour outline · optional fallback</p>
          <svg
            viewBox="0 0 360 270"
            className="w-full h-auto map-svg map-svg-fallback"
            aria-label="Virilion colour outline fallback"
          >
            <rect width="360" height="270" fill="#0a0812" />
            {showPlaces
              ? MAP_REGIONS.map((r) => {
                  const activeRegion = sel.kind === "region" && sel.id === r.id;
                  return (
                    <g
                      key={r.id}
                      className="map-region cursor-pointer"
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
                        opacity={activeRegion ? 0.95 : 0.68}
                        stroke={activeRegion ? "#e8d28a" : "rgba(46,42,58,0.75)"}
                        strokeWidth={activeRegion ? 2.4 : 1}
                      />
                      <text
                        className="map-region-label"
                        x={r.cx}
                        y={r.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={r.kind === "hub" ? "#1a1408" : "#f5efe4"}
                        fontSize={r.kind === "hub" ? 10 : 7.5}
                        fontWeight={700}
                        style={{ pointerEvents: "none" }}
                      >
                        {r.short}
                      </text>
                    </g>
                  );
                })
              : null}
          </svg>
        </div>
      ) : null}

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
  const art = codexPlaceCardSm(region.id) || codexPlaceCard(region.id);
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
      <div className="relative z-[1] flex items-start gap-3">
        {art ? (
          <div className="place-card-art shrink-0" aria-hidden>
            <Image
              src={art}
              alt=""
              width={400}
              height={500}
              className="place-card-art-img"
              sizes="120px"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1 flex items-start justify-between gap-3">
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
          <Link href="/join" className="btn-gold place-enter-cta text-sm py-2 px-4 !min-h-0 inline-flex">
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
  const art = codexHallCardSm(hall.id) || codexHallCard(hall.id);

  return (
    <article className="place-card place-card-hall place-card-arrive" data-arrive="true">
      <div className="place-card-sheen" aria-hidden />
      <div className="place-arrive-ring" aria-hidden />
      <div className="relative z-[1] flex items-start gap-3">
        {art ? (
          <div className="place-card-art shrink-0" aria-hidden>
            <Image
              src={art}
              alt=""
              width={400}
              height={500}
              className="place-card-art-img"
              sizes="120px"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1 flex items-start justify-between gap-3">
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
          <Link href="/join" className="btn-gold place-enter-cta text-sm py-2 px-4 !min-h-0 inline-flex">
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
