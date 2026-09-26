# Virilion — Staging Demo

Premium mobile-first **Next.js App Router** PWA portal into **Virilion** (adult queer mythic fantasy RP). Built for Creed Snow’s free staging demo.

**Platform lock:** the app owns RP text + voice. Discord is temporary migration only — not the product spine.

**Live:** https://virilion-staging.vercel.app

## Why this stack

- **Next.js 16 (App Router) + React 19 + TypeScript** — fast to ship, strong local/dev DX, easy Vercel staging
- **Tailwind CSS v4** — theme tokens for dark (default) / light parchment-gold
- **Auth.js (NextAuth v5) + Drizzle + Neon Postgres** — real email/password accounts when env is set; Demo localStorage path always works without secrets
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

### Log out vs hard-refresh vs `?qa=1`

- **Log out** (Self → Player, header ⋯ menu, or Enter when already signed in): clears demo session + vessel + related play keys (`virilion_demo_player`, `virilion_vessel`, pending, presence, scenes/voice/weave/reports/blocked) **and** Auth.js session cookie when present; returns to Enter. Moonlight dark is the default after clear. Keeps age gate + QA latch.
- **Hard-refresh** alone does **not** clear localStorage — you stay in the same saved demo state.
- **`?qa=1` wipe**: player path hides demo wipe CTAs. Latch `localStorage.virilion_qa=1` (or `?qa=1`) to show vessel-only “wipe & re-Rite” for QA retake — not a full Log out. Clear with `?qa=0`.

```bash
npm run build   # production build
npm start       # serve production build
```

### Dual-track Enter

1. Confirm **18+** age gate
2. **Enter**
   - **Log in** — Auth.js credentials when `DATABASE_URL` + `AUTH_SECRET` are set
   - **Continue as Demo** — localStorage only (identical ceremonial look; no fake signup)
   - **Create account** — email + passphrase + confirm against Neon; if secrets are missing shows honest **“Accounts wiring — needs database”**
3. **Rite of Making** (Role → Can carry → People → Style → Class → Name → Review). Real accounts also persist the vessel to Neon.
4. App shell: Realm · Map · d20 · Scenes · Self (+ Weave)
5. Scenes → open room → chat as Vessel; **Join call** opens in-app voice
6. Self → Player → **Log out** clears session cookie + local demo keys

## Real accounts (Neon + Auth.js)

Without secrets the app **builds and demos fine**. Signup/login stay gated.

### Exact env vars

| Variable | Required for accounts | Notes |
|----------|----------------------|--------|
| `DATABASE_URL` | yes | Neon Postgres connection string (`?sslmode=require`) |
| `AUTH_SECRET` | yes | Auth.js session signing secret — `openssl rand -base64 32` |
| `AUTH_URL` | optional | e.g. `https://virilion-staging.vercel.app` (Vercel often infers host) |

Copy `.env.example` → `.env.local` for local work. **Never commit secrets.**

### Neon setup

1. Create a project at [console.neon.tech](https://console.neon.tech)
2. Copy the connection string → `DATABASE_URL`
3. Generate `AUTH_SECRET`: `openssl rand -base64 32`
4. Apply schema:

```bash
# pushes schema (fastest for staging) — needs DATABASE_URL in env
npm run db:push

# or generate/apply SQL migrations
npm run db:generate
npm run db:migrate
```

Migration SQL lives in `drizzle/0000_virilion_accounts.sql` (`users`, `vessels`).

### Vercel env

In the Vercel project (**virilion-staging**) → Settings → Environment Variables, add for **Production** (and Preview if desired):

- `DATABASE_URL` = Neon connection string
- `AUTH_SECRET` = random 32+ byte secret
- `AUTH_URL` = `https://virilion-staging.vercel.app` (optional but recommended)

Then redeploy:

```bash
npm run build
npx vercel --yes --prod
```

Or trigger a redeploy from the Vercel dashboard after saving env.

### Turn signup live (checklist)

1. Neon project + `DATABASE_URL`
2. `AUTH_SECRET` generated and set locally + on Vercel
3. `npm run db:push` (or migrate) against Neon
4. Redeploy staging
5. Enter → **Create account** with email + passphrase + confirm → Rite → vessel lands in Neon
6. Log out / Log in on another browser — vessel returns from DB

Until those secrets exist, Create account shows **Accounts wiring — needs database** and **Continue as Demo** still works.

## Staging deploy (Vercel)

**Live:** https://virilion-staging.vercel.app

CLI deploy works (project linked; `npx vercel whoami` as Creed). From repo root:

```bash
npm run build
npx vercel --yes --prod
```

**GitHub Import / auto-deploy** is optional until the Vercel GitHub App is granted access to `creedsnow/virilion-staging`. Until then, ship with CLI after each push.

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
| `/enter` | Enter (Auth.js + Demo dual-track) + night sky |
| `/rite` | Rite of Making |
| `/` | Realm |
| `/map` | World map + Order Halls |
| `/scenes` | Discovery + in-app rooms + voice |
| `/weave` | Bonds |
| `/dice` | d20 ritual |
| `/wisp` | Deferred → redirects to `/` |
| `/shop` | Deferred → redirects to `/` |
| `/self` | Vessel \| Player |
| `/rules` | Community rules (21) in-app |
| `/admin` | Approve / reject pending_gm vessels |
| `/api/auth/*` | Auth.js handlers + register + status |
| `/api/vessel` | Persist / load vessel for signed-in users |

## Demo data honesty

| Mode | What persists | Shared across browsers? |
|------|---------------|-------------------------|
| **Demo** (Continue as Demo) | localStorage only | No |
| **Real account** (when env wired) | Neon `users` + `vessels` + Auth.js httpOnly JWT cookie | Yes (same account) |

| What works in demo | What needs Neon + AUTH_SECRET |
|--------------------|-------------------------------|
| Enter → Rite → one Vessel → Realm | Create account / Log in |
| `/admin` Approve embodies vessel here | Multi-device GM queue (still local for demo approve) |
| Map / Scenes / Weave local persist | Shared rooms / bonds later |

## Deferred post-launch (kept for re-enable)

- **Wisp** companion (`/wisp`) — soft-redirects to Realm. Packs stay in `public/assets/wisps/`. Not in shell mote, header, nav, or Self.
- **Shop / Moonmarket** (`/shop`) — soft-redirects to Realm. Art stays in `public/assets/moonmarket/`; Casting Bowl still uses skin/die shots. No nav or Self stall CTA.

## Non-goals (this slice)

Payments, full moderation-at-scale, AI portrait UI, domain purchase, inventing Places beyond Order Halls locks, password-reset email.
