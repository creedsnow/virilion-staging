> **Deferred post-launch:** Wisp UI is off the player path for now. Assets kept for later re-enable.

# Virilion Companion Wisp — Phase 1 v2 (prettier / Creed reference)

Soft Magic Fault / moon-gate residue mote for Night Court UI + parchment surfaces.

**v2** rebuilds the companion from Creed’s painterly reference (ethereal onion/teardrop body, luminous cyan–cerulean core, long soft upward flame/tendril trails, tiny sparkles, soft bloom on black, **two bright glowing white eye points only**).

No mouth, nose, brows, cheeks, limbs, fairy-wings cliché overload, text, combat props, NSFW, or Order Hall/class branding.

The simple **v1 orb** set (Lottie + simple Pillow orb) is archived under `_v1_orb/` so nothing was lost.

## Style (v2)

- Ethereal **onion / teardrop** body with painterly, translucent tendril trails
- Core `#A8D8FF` → mid `#7EC8F0` → glow `#C9ECFF` → deep `#4A9FD8` (leans richer cyan like the reference)
- Soft bloom / halo on black (keyed to alpha for delivery)
- Eyes: two bright white points with soft bloom; blink = thin zeros / dim
- Gentle mystical bioluminescent mood

## Colors (default blue)

| Token       | Hex       | Role                       |
|-------------|-----------|----------------------------|
| core        | `#A8D8FF` | Main body fill             |
| mid         | `#7EC8F0` | Mid shell                  |
| glow        | `#C9ECFF` | Soft bloom / sparkles      |
| deep accent | `#4A9FD8` | Underside / edge volume    |
| eye         | `#FFFFFF` | Bright eye points (+ bloom)|

Reads on Night Court dark UI and parchment light (`#F5E6C8`).

## Where they appear (Creed)

**Only** in:

1. Pet / wisp panel — hero idle, greet, pet/poke reactions, feeding UI
2. Notifications — notify-pulse as the waiting affordance (bell companion)

**Do not** place on: map pinpoint, scene roster, vessel showcase, floating always-on corner buddy, or whisper stamps.

## Recommended display sizes

| Context                 | Size     |
|-------------------------|----------|
| Wisp panel hero         | 64–96 px |
| Notification affordance | 24–40 px |

Design masters: **512×512** (`masters/wisp-master-512.png`). Delivery loops: **256×256** WebM. Stills: **128** + **256** PNG/WebP.

## Motion summary

| File | State | Loop | Notes |
|------|-------|------|-------|
| `wisp-idle.webm` / `.apng` | Idle | **~2.5 s** seamless | Calm bob + tendril drift + 1 gentle blink |
| `wisp-greet.webm` / `.apng` | Greet | **~2.2 s** seamless | Brighter + more sparkles + bob |
| `wisp-notify.webm` / `.apng` | Notify | **~2.0 s** seamless | One glow pulse + brighter alert eyes |
| `wisp-pet.webm` / `.apng` | Pet | **~0.6 s** one-shot | Horizontal squeeze |
| `wisp-poke.webm` / `.apng` | Poke | **~0.5 s** one-shot | Squash + bounce |
| `wisp-still.*` | Static | — | Soft neutral, eyes open |

All loops ease gently; no strobe.

## Formats (web prototype) — v2 preference

**Primary — transparent WebM (VP9 `yuva420p`, `ALPHA_MODE=1`)**  
Best quality/size for the painterly tendrils:

- `wisp-idle.webm`, `wisp-greet.webm`, `wisp-notify.webm`, `wisp-pet.webm`, `wisp-poke.webm`
- ~26–57 KB each @ 256², 20 fps (full frame counts)

**Secondary — APNG** (lighter subsampled / quantized fallback for browsers without WebM alpha):

- `wisp-*.apng` and `*-apng.png` aliases
- ~220–510 KB; 160², 8–16 keyframes spanning the same loop durations

**Stills:**

- `wisp-still.png` / `.webp` — 128×128 (canonical)
- `wisp-still-128.png` / `.webp` — same
- `wisp-still-256.png` / `.webp` — 256×256

**Sprite sheets + JSON** (sampled cells):

- `wisp-*-sheet.png` + `wisp-*-frames.json`

### Lottie — skipped for v2

A simplified vector Lottie (soft teardrop + glow + eye ellipses + sparkle circles) **cannot match** Creed’s painterly tendrils / bloom. v2 therefore **does not ship** `wisp-*.json` Lottie files. Use **WebM → APNG → still** for the pretty version. v1 Lotties remain in `_v1_orb/` if a tiny vector stand-in is needed for notifications at 24–40 px.

## Previews

Under `previews/`:

- `contact-*-dark.png` — frame strips on Night Court–ish dark
- `contact-*-light.png` — same on parchment `#F5E6C8`
- `wisp-idle-preview.gif` — quick idle check (composited on dark)

## Build

- Reference (Creed): absolute attachment PNG used as visual master (crop → soft-key black → alpha).
- `build_v2_from_ref.py` — Pillow warps (tendril drift), bob, blink, sparkles, pet/poke squash; ffmpeg for WebM.
- Intermediates: `frames/{idle,greet,notify,pet,poke}/` (512) and `frames/*_256/` (delivery).
- Master: `masters/wisp-master-512.png`

**Note on GenerateImage:** this rebuild used Creed’s reference raster as the master still (exact style match) and Pillow motion, because the executor subagent did not have the Cursor `GenerateImage` / `CallDynamicTool` namespace available. If regenerating AI key-poses later, call `GenerateImage` with `aspect_ratio: "1:1"` and `reference_image_paths` pointing at Creed’s reference, then re-run the encode path.

## Archive

`_v1_orb/` — complete Phase 1 v1 simple-orb set (Lottie JSON, WebM, APNG, stills, `render_wisp.py`, `build_lottie.py`, old README).

## Limitations

- APNG is heavier and lower temporal resolution than WebM; prefer WebM when alpha WebM is supported.
- Hue variants (gold / violet / rose / moss / moon-white) remain **out of Phase 1**.
- Motion is reference-locked morph (consistent identity across frames); not per-frame AI redraws.

## Checklist

- [x] v1 orb archived to `_v1_orb/`
- [x] v2 prettier style from Creed reference
- [x] No mouth / nose / brows / cheeks / limbs / wings / text / combat / NSFW
- [x] Eyes with blink + greet/notify/pet/poke variants
- [x] Still PNG + WebP (128 & 256)
- [x] Transparent WebM (primary) + APNG for all loops
- [x] Contact sheets dark + light + idle preview GIF
- [x] README (v2); Lottie skipped with rationale
