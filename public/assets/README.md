# Virilion App — Graphic Designer asset handoff

**From:** Graphic Designer  
**For:** Virilion App Developer  
**Date:** 2026-09-26 (ET)  
**Ask (Creed):** make sure App Developer has **all** Virilion images we made, for development.

## Where the files live (shared box)

| Role | Path |
|------|------|
| **Source of truth (full tree, incl. raws / masters / contact sheets)** | `/workspace/virilion/assets/` |
| **Copied into the app for local/staging use** | `/workspace/virilion-app/public/assets/` |
| Design / canon notes | `/workspace/virilion/handoff/` |
| This manifest | `/workspace/virilion/handoff/DEV_ASSETS_HANDOFF.md` and `/workspace/virilion-app/public/assets/README.md` |

You already share the box filesystem with Graphic Designer. Prefer the **public/assets** copy for Next.js `public/` URLs. Prefer the **source tree** when you need masters, raws, or contact sheets.

URL pattern once served: `/assets/<pack>/...` (e.g. `/assets/icons/ui/home.svg`, `/assets/codex/codex-peoples-cassens-card.webp`).

## What was synced into `virilion-app/public/assets` (~691 files)

### 1. Logo — `logo/`
- `Virilion-logo.png` (official purple castle + crescent + wordmark)
- Also: `/workspace/virilion-app/public/virilion-logo-design.png`

### 2. Icons — `icons/` (v1.0, Creed-approved)
- **235 SVG** under `ui/` (81), `codex/` (16), `classes/` (45 = 15×3), `peoples/` (42 = 14×3), `halls/` (45 = 15×3), `app/` (5+)
- Helpers: `manifest.json`, `icons.svg` sprite, `index.js`, `index.d.ts`, `Icon.jsx`, `README.md`
- App: `app/favicon.ico`, `favicon.svg`, `app-icon.svg`, `app-icon-maskable.svg`, `mark.svg`, `mark-mono.svg`, plus `app/png/`
- Badge variants: dark / `-light` / `-mono` for classes, peoples, halls
- **Read:** `icons/README.md` for palette, sizes, safe-zone rules
- Preview PNG sheets were **not** copied (design review only); source: `/workspace/virilion/assets/icons/previews/`

**Known gaps (icons):** Style and Role icon families were never commissioned. 12 Order Hall sigils were inferred from hall names (not locked lore).

### 3. World Codex art — `codex/`
Ship sizes (use these in UI):

| Suffix | Typical size | Use |
|--------|-------------:|-----|
| `-card.webp` | 800×1000 | primary Codex / map cards |
| `-card-sm.webp` | 480×600 | grids / mobile |
| `-square.webp` | 1024×1024 | optional square |
| `-desktop.webp` / `-mobile.webp` | tab / header / wide | tabs & headers |
| `masters/*-master.png` | 1920×2400 (etc.) | archival / re-export |

**Layout rules (locked for cards):** keep **top-left quiet** for the icon badge (~26%×22% of a 4:5 card, inset ~6%). Keep **bottom ~38% quieter** for title gradient. AI disclosure applies (no watermark on files).

**Halls (15 cards + tab):**  
- `codex-halls-arcane-academy`
- `codex-halls-bell-hall-ruins`
- `codex-halls-bellsong-auditorium`
- `codex-halls-blood-hideaway`
- `codex-halls-crusaders-hall`
- `codex-halls-dawns-chapel`
- `codex-halls-golem-university`
- `codex-halls-hall-of-the-elements`
- `codex-halls-mead-halls`
- `codex-halls-monastery-of-the-fist`
- `codex-halls-sacred-crypts`
- `codex-halls-secret-wilds`
- `codex-halls-steamwhistle-college`
- `codex-halls-thieves-hall`
- `codex-halls-wolfclad-lodge`

**Places (card set):**  
- `codex-places-access-border-pass`
- `codex-places-alliance-hall`
- `codex-places-bardwood-library`
- `codex-places-brothel`
- `codex-places-cassanova`
- `codex-places-caverns-of-trahg`
- `codex-places-cliff-observatory-roads`
- `codex-places-greater-lush-plains`
- `codex-places-grove`
- `codex-places-high-mountains`
- `codex-places-moon-gates`
- `codex-places-pub`
- `codex-places-southern-isles`
- `codex-places-starveil-sanctums`
- `codex-places-stone-halls`
- `codex-places-stormspire-aeries`
- `codex-places-suncoil-reaches`
- `codex-places-treetop-villages`
- `codex-places-velkrath-wood`
- `codex-places-verdant-canopy`
- `codex-places-virelios`
- `codex-places-virelios-colosseum`
- `codex-places-war-colleges`
- `codex-places-wastes`

**Peoples (14 + tab; many also have `-header` variants):** card slugs include  
- `codex-peoples-auralith`
- `codex-peoples-cassens`
- `codex-peoples-charms`
- `codex-peoples-dwemen`
- `codex-peoples-galands`
- `codex-peoples-kaelir`
- `codex-peoples-orks`
- `codex-peoples-rhovar`
- `codex-peoples-serynth`
- `codex-peoples-smols`
- `codex-peoples-sorns`
- `codex-peoples-trahgs`
- `codex-peoples-valkary`
- `codex-peoples-varkyn`

**Classes (14 + tab + Custom pathway art as shipped; many `-header` variants):**  
- `codex-classes-bard`
- `codex-classes-druid`
- `codex-classes-golemancer`
- `codex-classes-hunter`
- `codex-classes-mage`
- `codex-classes-monk`
- `codex-classes-necromancer`
- `codex-classes-paladin`
- `codex-classes-priest`
- `codex-classes-rogue`
- `codex-classes-shaman`
- `codex-classes-tinker`
- `codex-classes-warlock`
- `codex-classes-warrior`

**Other tabs / world blocks:** blessings, chronicle, glossary, rules, styles tabs; world premise / one-vast-world / virelios-vs-cassanova (+ headers where shipped).

Per-pack notes: `codex/HALLS_README.md`, `codex/PLACES_README.md`.  
Full commission map: `/workspace/virilion/handoff/CODEX_IMAGE_MANIFEST.md`.

**Not copied into public:** `_raw/`, `_prep/`, `_provisional/`, contact sheets. Still available under `/workspace/virilion/assets/codex/`.

### 4. News hero — `news/`
- `news-voice-video-live-hero.webp`
- `news-voice-video-live-hero-1200x675.webp`
- `news-voice-video-live-hero-master.png`

### 5. Moonmarket — `moonmarket/`
Dice skins: night-court, starveil, gilded-coil, parchment-bone, mosswood (`shop-skin-*-{webp,800.webp,master.png}`).  
Die shapes: d4, d6, d8, d10, d12, dpercent (`shop-die-*-…`).  
Blank faces (no numerals) — UI may overlay numbers. See `moonmarket/README.md`.

### 6. Companion wisp (Phase 1 v2) — `wisps/`
**Use only** in pet/wisp panel + notifications (not map/scenes/showcase/roster).

Delivery loops: `wisp-idle|greet|notify|pet|poke.webm` (+ `.apng` + `*-frames.json`).  
Stills: `wisp-still.png/.webp`, `wisp-still-128.*`, `wisp-still-256.*`.  
Masters: `wisps/masters/`.  
**Read:** `wisps/README.md`.  
Archived v1 orb (do not ship as current): `/workspace/virilion/assets/wisps/_v1_orb/`.

### 7. Style reference race cards — `discord-refs/`
- `race-card-cassens.webp`, `race-card-valkary.webp`, `race-card-rhovar.webp`  
(Discord #races style anchors — not product UI unless you choose to use them.)

## Not made yet (Batch B — hold until Creed asks)

Calendar event thumbs, campaign covers, guild crests, optional inbox empty-state. Do not invent placeholders as final art.

## Also not in this pack

- Placeholder TBG square portraits (TBG app, not Virilion) — out of scope here  
- Anthology / *She Asked for Nothing* covers — unrelated  
- Claude Design prototype screenshots under `/workspace/virilion/handoff/review_*` — look/feel reference only; Virilion GM owns Design; do **not** treat as the build source

## Suggested Next.js usage

```ts
// examples
'/assets/icons/ui/home.svg'
'/assets/icons/classes/paladin.svg'          // dark badge
'/assets/icons/classes/paladin-light.svg'    // parchment
'/assets/icons/classes/paladin-mono.svg'     // currentColor line
'/assets/codex/codex-peoples-cassens-card.webp'
'/assets/codex/codex-halls-crusaders-hall-card.webp'
'/assets/news/news-voice-video-live-hero.webp'
'/assets/moonmarket/shop-skin-night-court.webp'
'/assets/wisps/wisp-idle.webm'
```

Tint line icons with CSS `color` (`#E8C887` dark / `#9A6A1C` light).

## Source tree size note

Full `/workspace/virilion/assets` is ~470M+ (codex raws + wisp frames). The public copy is delivery-focused (~375M including masters). If the repo should stay lean for git, keep masters/raws out of git and load from the shared box path or a CDN later — ask Creed before committing the full `public/assets` tree.

## Contact

Questions on crops, missing slugs, or re-exports → Graphic Designer.  
Canon / which image belongs on which screen → Virilion GM.
