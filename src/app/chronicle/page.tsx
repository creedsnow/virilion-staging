"use client";

import Link from "next/link";
import Image from "next/image";
import { newsVoiceVideoHero } from "@/lib/assets";

export default function ChroniclePage() {
  return (
    <div className="space-y-5">
      <div className="page-header">
        <p className="section-kicker mb-1">World</p>
        <h1 className="font-display text-3xl font-semibold text-fg leading-tight">
          Chronicle
        </h1>
        <p className="text-sm text-fg-muted mt-2 leading-relaxed max-w-xl">
          World news and lore dispatches. A CMS ships later — demo notes for now.
        </p>
      </div>
      <Link href="/scenes" className="news-card group">
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
            The site is the RP home. More Chronicle articles arrive with publishing tools.
          </p>
          <span className="news-card-cta">Open Scenes →</span>
        </div>
      </Link>
      <div className="flex flex-wrap gap-2">
        <Link href="/codex" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          Codex
        </Link>
        <Link href="/about" className="btn-ghost text-sm py-2 px-3 !min-h-0">
          About
        </Link>
      </div>
    </div>
  );
}
