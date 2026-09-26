"use client";

import { useState } from "react";
import { PEOPLES } from "@/lib/canon/peoples";
import { ORDER_HALLS } from "@/lib/canon/orderHalls";
import { EmptyState } from "@/components/EmptyState";

export default function MapPage() {
  const [selected, setSelected] = useState<string | null>("virelios");

  const places = [
    {
      id: "virelios",
      name: "Virelios",
      note: "Open hub capital — all Peoples welcome. Not Cassanova.",
      color: "#c9a227",
    },
    ...PEOPLES.map((p) => ({
      id: p.id,
      name: p.homeland,
      note: `${p.name} homeland · ${p.racialAbility}. Racial cities need Border Pass for outsiders.`,
      color: p.mapColor,
    })),
  ];

  const place = places.find((p) => p.id === selected) || places[0];

  return (
    <div className="space-y-4">
      <div>
        <p className="section-kicker mb-1">World</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Map</h1>
        <p className="text-sm text-fg-muted mt-1 leading-relaxed">
          One vast world. Color regions — tap a place. No Google-Maps chrome. Wisp stays off
          the map.
        </p>
      </div>

      <div className="card p-0 overflow-hidden stone-panel rounded-2xl">
        <svg viewBox="0 0 360 220" className="w-full h-auto bg-[#0a0812]" aria-label="World sketch">
          <rect width="360" height="220" fill="#0a0812" />
          {PEOPLES.map((p, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x = 30 + col * 68;
            const y = 28 + row * 58;
            return (
              <g key={p.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={selected === p.id ? 22 : 18}
                  fill={p.mapColor}
                  opacity={0.85}
                  stroke={selected === p.id ? "#e0c36a" : "#2e2a3a"}
                  strokeWidth={selected === p.id ? 2 : 1}
                  className="cursor-pointer"
                  onClick={() => setSelected(p.id)}
                />
                <text
                  x={x}
                  y={y + 32}
                  textAnchor="middle"
                  fill="#a89b88"
                  fontSize="7"
                >
                  {p.name}
                </text>
              </g>
            );
          })}
          <circle
            cx={180}
            cy={110}
            r={selected === "virelios" ? 16 : 12}
            fill="#c9a227"
            stroke="#fff8"
            strokeWidth={2}
            className="cursor-pointer"
            onClick={() => setSelected("virelios")}
          />
          <text x={180} y={132} textAnchor="middle" fill="#e0c36a" fontSize="8">
            Virelios
          </text>
        </svg>
      </div>

      <div className="card space-y-2 stone-panel rounded-2xl">
        <h2 className="font-medium text-gold-soft">{place.name}</h2>
        <p className="text-sm text-fg-muted leading-relaxed">{place.note}</p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-fg mb-2">Order Halls</h2>
        <ul className="space-y-2">
          {ORDER_HALLS.map((h) => (
            <li key={h.channel} className="card py-2 px-3 text-sm">
              <span className="text-fg font-medium">{h.name}</span>
              <span className="text-fg-muted"> · {h.tiedTo} · {h.mapPlace}</span>
            </li>
          ))}
        </ul>
      </div>

      <EmptyState
        title="Border Pass"
        body="Each vessel earns access separately. Staging shows places; passport checks ship with live place gates."
      />
    </div>
  );
}
