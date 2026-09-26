"use client";

import Image from "next/image";
import Link from "next/link";
import { PEOPLES } from "@/lib/canon/peoples";
import { CLASSES } from "@/lib/canon/classes";
import { ORDER_HALLS } from "@/lib/canon/orderHalls";
import { MAP_REGIONS } from "@/lib/canon/mapRegions";
import {
  codexClassCard,
  codexHallCard,
  codexPeopleCard,
  codexPlaceCard,
  hallIcon,
  peopleIcon,
  uiIcon,
} from "@/lib/assets";

export default function CodexPage() {
  const playableClasses = CLASSES.filter((c) => c.id !== "custom");

  return (
    <div className="space-y-6">
      <div className="codex-hero">
        <div className="codex-hero-sheen" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-kicker mb-1">World book · lantern library</p>
          <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
            The World{" "}
            <span className="display-italic text-[1.05em]">Codex</span>
          </h1>
          <p className="text-sm text-fg-muted mt-1.5 leading-relaxed max-w-md">
            Everything known of Virilion — peoples, classes, places, rules. Unwritten
            pages stay honest: Record incomplete.
          </p>
        </div>
      </div>

      <nav className="tome-tabs" aria-label="Codex sections">
        {[
          ["#peoples", "Peoples"],
          ["#classes", "Classes"],
          ["#places", "Places"],
          ["#halls", "Halls"],
          ["#rules", "Rules"],
          ["#chronicle", "Chronicle"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="tome-tab">
            {label}
          </a>
        ))}
      </nav>

      <section id="peoples" className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="section-serif">Fourteen Peoples</h2>
          <p className="text-[10px] uppercase tracking-wide text-fg-muted">No Veilborn</p>
        </div>
        <div className="codex-people-grid">
          {PEOPLES.map((p) => (
            <article key={p.id} className="codex-art-card">
              <div className="codex-art-frame">
                <Image
                  src={codexPeopleCard(p.id)}
                  alt=""
                  width={800}
                  height={1000}
                  className="codex-art-img"
                  sizes="(max-width: 640px) 50vw, 240px"
                />
                <div className="codex-art-veil" aria-hidden />
                <span className="codex-art-badge" aria-hidden>
                  <img src={peopleIcon(p.id)} alt="" width={28} height={28} />
                </span>
                <div className="codex-art-caption">
                  <p className="codex-art-title">{p.name}</p>
                  <p className="codex-art-sub">
                    {p.cultureName} · {p.homeland}
                  </p>
                </div>
              </div>
              <p className="codex-art-blurb">
                {p.racialAbility}
                {p.roleNote ? ` · ${p.roleNote}` : ""}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="classes" className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="section-serif">Classes</h2>
          <p className="text-[10px] uppercase tracking-wide text-fg-muted">
            {playableClasses.length} · Order Halls
          </p>
        </div>
        <ul className="space-y-2">
          {playableClasses.map((c) => {
            const hall = ORDER_HALLS.find((h) => h.name === c.orderHall);
            return (
              <li key={c.id}>
                <div className="codex-class-row codex-class-row-art">
                  <div className="codex-class-accent" aria-hidden />
                  <div className="codex-class-thumb" aria-hidden>
                    <Image
                      src={codexClassCard(c.id)}
                      alt=""
                      width={160}
                      height={200}
                      className="codex-class-thumb-img"
                      sizes="72px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 relative z-[1]">
                    <p className="font-display text-lg font-semibold text-fg">{c.name}</p>
                    <p className="text-xs text-fg-muted mt-0.5 leading-snug">{c.blurb}</p>
                    <p className="text-[11px] text-gold-soft mt-1.5">
                      ✦ {c.orderHall}
                      {hall?.mapPlace ? ` · ${hall.mapPlace}` : ""}
                    </p>
                  </div>
                  <Link
                    href="/map"
                    className="text-[10px] uppercase tracking-[0.12em] text-gold shrink-0 hover:text-gold-soft relative z-[1]"
                  >
                    Map →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] text-fg-muted leading-relaxed">
          Blood Hideaway is affliction-tied (vampires) — not a creation class. Afflictions:
          Coming soon.
        </p>
      </section>

      <section id="places" className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="section-serif">Places</h2>
          <Link
            href="/map"
            className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gold hover:text-gold-soft"
          >
            Open Map →
          </Link>
        </div>
        <div className="codex-place-grid">
          {MAP_REGIONS.map((r) => {
            const art = codexPlaceCard(r.id);
            const badge =
              (r.peopleId ? peopleIcon(r.peopleId) : null) || uiIcon("homeland");
            if (!art) {
              return (
                <Link
                  key={r.id}
                  href="/map"
                  className="lantern-card codex-place-card"
                  style={{ ["--lantern-accent" as string]: r.color }}
                >
                  <div className="lantern-card-accent" aria-hidden />
                  <div className="lantern-card-glow" aria-hidden />
                  <div className="relative z-[1] flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg font-display">{r.label}</p>
                      <p className="text-[11px] text-fg-muted mt-0.5 capitalize">{r.kind}</p>
                    </div>
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 mt-1 border border-border/40"
                      style={{ background: r.color }}
                      aria-hidden
                    />
                  </div>
                </Link>
              );
            }
            return (
              <Link key={r.id} href="/map" className="codex-art-card codex-art-card-link">
                <div className="codex-art-frame">
                  <Image
                    src={art}
                    alt=""
                    width={800}
                    height={1000}
                    className="codex-art-img"
                    sizes="(max-width: 640px) 50vw, 240px"
                  />
                  <div className="codex-art-veil" aria-hidden />
                  {badge ? (
                    <span className="codex-art-badge" aria-hidden>
                      <img src={badge} alt="" width={28} height={28} />
                    </span>
                  ) : null}
                  <div className="codex-art-caption">
                    <p className="codex-art-title">{r.label}</p>
                    <p className="codex-art-sub capitalize">
                      {r.kind}
                      {r.culture ? ` · ${r.culture}` : ""}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="halls" className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="section-serif">Order Halls</h2>
          <p className="text-[10px] uppercase tracking-wide text-fg-muted">
            {ORDER_HALLS.length} · map pins
          </p>
        </div>
        <div className="codex-hall-grid">
          {ORDER_HALLS.map((h) => {
            const art = codexHallCard(h.id);
            if (!art) {
              return (
                <article key={h.id} className="lantern-card codex-place-card">
                  <div className="lantern-card-accent" aria-hidden />
                  <div className="relative z-[1]">
                    <p className="text-sm font-medium text-fg font-display">{h.name}</p>
                    <p className="text-[11px] text-fg-muted mt-0.5">
                      {h.tiedTo} · {h.mapPlace}
                    </p>
                  </div>
                </article>
              );
            }
            return (
              <article key={h.id} className="codex-art-card">
                <div className="codex-art-frame">
                  <Image
                    src={art}
                    alt=""
                    width={800}
                    height={1000}
                    className="codex-art-img"
                    sizes="(max-width: 640px) 50vw, 240px"
                  />
                  <div className="codex-art-veil" aria-hidden />
                  <span className="codex-art-badge" aria-hidden>
                    <img src={hallIcon(h.id)} alt="" width={28} height={28} />
                  </span>
                  <div className="codex-art-caption">
                    <p className="codex-art-title">{h.name}</p>
                    <p className="codex-art-sub">
                      {h.tiedTo} · {h.mapPlace}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="rules" className="space-y-3">
        <h2 className="section-serif">Rules</h2>
        <Link href="/rules" className="care-panel care-panel-link">
          <div className="care-panel-glow" aria-hidden />
          <span className="relative z-[1] flex items-center gap-3">
            <span className="codex-icon" aria-hidden>
              ☾
            </span>
            <span className="min-w-0">
              <span className="font-display text-xl font-semibold text-fg block">
                Rules · 21 locks
              </span>
              <span className="text-sm text-fg-muted mt-0.5 block">
                Community product rules · 21 locks.
              </span>
            </span>
          </span>
        </Link>
        <Link href="/safety" className="care-panel care-panel-link">
          <div className="care-panel-glow" aria-hidden />
          <span className="relative z-[1] flex items-center gap-3">
            <span className="codex-icon" aria-hidden>
              ✦
            </span>
            <span className="min-w-0">
              <span className="font-display text-xl font-semibold text-fg block">Safety</span>
              <span className="text-sm text-fg-muted mt-0.5 block">
                Report · Block · consent reminder
              </span>
            </span>
          </span>
        </Link>
      </section>

      <section id="chronicle" className="stub-panel px-4 py-4">
        <p className="section-kicker mb-1">Chronicle</p>
        <p className="font-display text-base text-fg">Coming soon</p>
        <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
          Record incomplete. No invented chronicles — official updates will land here.
        </p>
      </section>
    </div>
  );
}
