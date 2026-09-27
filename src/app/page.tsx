"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PEOPLES } from "@/lib/canon/peoples";
import { COMING_UP } from "@/lib/events";
import { codexPeopleCard, newsVoiceVideoHero, worldMap } from "@/lib/assets";
import { getPlayer, getVessel, subscribeVessel } from "@/lib/storage";

/**
 * Guest marketing landing — Site Map `/`.
 * Signed-in members with a Character are redirected to `/dash` by AppShell;
 * this page also self-redirects as a safety net.
 */
export default function GuestLandingPage() {
  const router = useRouter();

  useEffect(() => {
    function check() {
      if (getPlayer() && getVessel()) {
        router.replace("/dash");
      }
    }
    check();
    return subscribeVessel(check);
  }, [router]);

  const teaserPeoples = PEOPLES.slice(0, 8);

  return (
    <div className="landing space-y-10 pb-6">
      <section className="landing-hero">
        <div className="landing-hero-sheen" aria-hidden />
        <div className="relative z-[1] space-y-4 max-w-2xl">
          <p className="section-kicker">Adult queer mythic fantasy</p>
          <h1 className="display-hero landing-title">
            One Character.{" "}
            <span className="display-italic">One living world.</span>
          </h1>
          <p className="text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl">
            Virilion is a site for roleplay under moonlight — halls, bonds, and a
            painted atlas. Create your Character in the Rite, then walk the Realm.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <Link href="/join" className="btn-gold">
              Begin the Rite
            </Link>
            <Link href="/login" className="btn-ghost">
              Sign in
            </Link>
            <Link href="/codex" className="btn-ghost">
              Explore the Codex
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="section-serif-lg">Peoples of Virilion</h2>
          <Link
            href="/codex"
            className="text-[11px] tracking-[0.1em] uppercase text-fg-muted hover:text-gold-soft"
          >
            Codex →
          </Link>
        </div>
        <div className="landing-people-rail h-scroll">
          {teaserPeoples.map((p) => (
            <Link
              key={p.id}
              href="/codex"
              className="landing-people-card"
              aria-label={`${p.name} · ${p.homeland}`}
            >
              <div className="landing-people-art">
                <Image
                  src={codexPeopleCard(p.id)}
                  alt=""
                  width={240}
                  height={300}
                  className="landing-people-img"
                  sizes="140px"
                />
              </div>
              <p className="landing-people-name">{p.name}</p>
              <p className="landing-people-meta">{p.homeland}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-map-teaser card stone-panel !p-0 overflow-hidden">
        <div className="landing-map-frame">
          <Image
            src={worldMap()}
            alt="Painted atlas of Virilion"
            width={959}
            height={1616}
            className="landing-map-img"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
          <div className="landing-map-veil" aria-hidden />
        </div>
        <div className="landing-map-body">
          <p className="section-kicker mb-1">The map</p>
          <h2 className="font-display text-2xl text-fg leading-tight">
            Sixteen holdings · one painted world
          </h2>
          <p className="text-sm text-fg-muted mt-2 leading-relaxed max-w-md">
            Tap regions on the atlas, open Order Halls, and find your place under the lamps.
          </p>
          <Link href="/map" className="btn-gold text-sm py-2 px-4 !min-h-0 inline-flex mt-3">
            Open the map
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="section-serif">Coming up</h2>
          <Link
            href="/login"
            className="text-[11px] tracking-[0.1em] uppercase text-fg-muted hover:text-gold-soft"
          >
            Sign in to RSVP →
          </Link>
        </div>
        <div className="h-scroll">
          {COMING_UP.slice(0, 4).map((e) => (
            <Link
              key={e.title}
              href="/login"
              className="event-card"
              style={{ ["--accent" as string]: e.accent }}
            >
              <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-semibold">
                ✦ {e.when}
              </p>
              <p className="font-display text-[1.05rem] font-semibold text-fg mt-1.5 leading-snug">
                {e.title}
              </p>
              <p className="text-xs text-fg-muted mt-2">✦ {e.place}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="section-serif-lg">News</h2>
        <Link href="/chronicle" className="news-card group">
          <div className="news-card-frame">
            <Image
              src={newsVoiceVideoHero("1200")}
              alt=""
              width={1200}
              height={675}
              className="news-card-img"
              sizes="(max-width: 640px) 100vw, 720px"
            />
            <div className="news-card-veil" aria-hidden />
          </div>
          <div className="news-card-body">
            <p className="news-card-title">Voice and video now live inside Virilion.</p>
            <p className="news-card-sub">
              The site is the RP home. Discord stays a temporary community hub while players migrate in.
            </p>
            <span className="news-card-cta">Read the Chronicle →</span>
          </div>
        </Link>
      </section>

      <section className="landing-cta card stone-panel text-center space-y-3 py-8 px-5">
        <p className="section-kicker">Ready?</p>
        <h2 className="font-display text-2xl sm:text-3xl text-fg leading-tight">
          Seal your Character · walk under the lamps
        </h2>
        <div className="flex flex-wrap gap-2.5 justify-center pt-1">
          <Link href="/join" className="btn-gold">
            Join · Rite of Making
          </Link>
          <Link href="/about" className="btn-ghost">
            How to play
          </Link>
        </div>
      </section>
    </div>
  );
}
