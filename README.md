# Virilion — Staging Demo

Premium mobile-first **Next.js App Router** PWA portal into **Virilion** (adult queer mythic fantasy RP). Built for Creed Snow’s free staging demo.

**Platform lock:** the app owns RP text + voice. Discord is temporary migration only — not the product spine.

## Why this stack

- **Next.js 16 (App Router) + React 19 + TypeScript** — fast to ship, strong local/dev DX, easy Vercel staging
- **Tailwind CSS v4** — theme tokens for dark (default) / light parchment-gold
- **Client localStorage** — demo vessel, age gate, theme, scene chat, voice presence (no backend required this slice)
- **PWA** — `manifest.webmanifest` + minimal service worker

## Canon (do not invent)

Locks live in `/workspace/virilion/handoff/` (and this repo’s `src/lib/canon/`). Key gates enforced in the Rite:

- Exactly **14 Peoples** — no Veilborn
- **One vessel per player**
- **Sorns = Bottom-only**; **Serynth = Top-only** (no Blessing / can-carry)
- Role → People filter; Style lists from §4.1; **Daddy banned for Smols only**; Bear bans unchanged
- Custom People/Style/Class → `pending_gm`
- Scenes = **in-app** text rooms + **in-app** Join call (WebRTC demo). Never Discord deep-links.

Canon questions → **Virilion GM / Launch Planner**. Do not invent lore.

## Run locally

```bash
cd virilion-staging
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### QA / demo wipe

Player path hides demo wipe CTAs. To retake the Rite in staging:

- Visit any route with `?qa=1` (latches `localStorage.virilion_qa=1`), or
- Set `localStorage.setItem("virilion_qa", "1")` in the console

Clear with `?qa=0` or `localStorage.removeItem("virilion_qa")`.


```bash
npm run build   # production build
npm start       # serve production build
```

### Demo path

1. Confirm **18+** age gate  
2. **Enter** (demo — fields cosmetic)  
3. **Rite of Making** (Role → Can carry → People → Style → Class → Name → Review)  
4. App shell: Realm · Map · d20 · Scenes · Self (+ Weave)  
5. Scenes → open room → chat as Vessel; **Join call** opens in-app voice (mic, Mute/Deafen/Leave)  
6. Self → Player → Log out returns to Enter; GM demo at `/admin`

## Staging deploy (Vercel)

**Live:** https://virilion-staging.vercel.app

CLI deploy works (project linked; `npx vercel whoami` as Creed). From repo root:

```bash
npm run build
npx vercel --yes --prod
```

**GitHub Import / auto-deploy** is optional until the Vercel GitHub App is granted access to `creedsnow/virilion-staging`. Until then, ship with CLI after each push.

Environment: none required for this demo slice.

## Fix loop (for Creed)

1. Creed notes a change (chat / issue / comment)  
2. Patch this **repo**  
3. Deploy to **staging**  
4. Creed verifies on the staging URL  
5. Promote when ready  

Canon questions → Virilion GM / Launch Planner — developers do not invent lore.

## Routes

| Path | Purpose |
|------|---------|
| `/enter` | Demo Enter + night sky |
| `/rite` | Rite of Making |
| `/` | Realm |
| `/map` | World map + Order Halls |
| `/scenes` | Discovery + in-app rooms + voice |
| `/weave` | Bonds |
| `/dice` | d20 ritual |
| `/self` | Vessel \| Player |
| `/rules` | Community rules (21) in-app |
| `/admin` | Approve / reject pending_gm vessels |

## Non-goals (this slice)

Payments, full moderation-at-scale, AI portrait UI, domain purchase, inventing Places beyond Order Halls locks.
