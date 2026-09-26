# Virilion Icon Set v1.0

Custom vector icons for the Virilion portal (prototype `Virilion.dc.html`): navigation, UI actions, World Codex tabs, the 14 Classes (+ Custom), the 14 Peoples, the 15 Order Halls, and the app icon/favicon built from the official logo mark.

All artwork is hand-built SVG: no raster images, no filters, no `<text>`, no embedded fonts. Every file has been optimised with svgo 4, parsed as XML, and rendered with librsvg as a check.

**234 SVG files** · UI 81 · Codex 16 · Classes 15 (×3 variants) · Peoples 14 (×3) · Order Halls 15 (×3) · App 5

```
icons/
  ui/        24px line icons (currentColor)
  codex/     24px line icons for the World Codex tabs and states (currentColor)
  classes/   <id>.svg dark badge · <id>-light.svg parchment badge · <id>-mono.svg 24px currentColor
  peoples/   same three variants
  halls/     same three variants
  app/       app-icon.svg (1024) · app-icon-maskable.svg · favicon.svg · favicon.ico · mark.svg · mark-mono.svg · png/
  icons.svg  one sprite: every file as a <symbol id="<category>-<id>[-light|-mono]">
  manifest.json · index.js · index.d.ts · Icon.jsx
  previews/  PNG sheets (dark + light, 64px + 24px, plus a 20px legibility sheet)
```

## 1. Palette (exact hex from the design docs)

| Role | Hex | Source |
|---|---|---|
| Night ground (dark theme) | `#0B0910` | CODEX_IMAGE_MANIFEST.md §1.1 (dark theme swatch) |
| Deep indigo (badge fill) | `#330B5F` | §1.1, logo gradient |
| Royal purple (badge glow, logo castle; light-theme accent) | `#7E0E90` | §1.1, logo |
| Antique gold (primary icon colour on dark) | `#E8C887` | §1.1 (dark theme swatch) |
| Star/moon gold (accent details: stars, jewels) | `#FFD750` | §1.1, logo stars |
| Moonsilver (hairline ring, logo arc tips) | `#88A0A8` | §1.1, logo arc |
| Garnet (blood: Blood Hideaway only) | `#C4324A` | §1.1 jewel (blood, passion, danger) |
| Parchment page (light theme) | `#F6EEDE` | §1.1 light theme |
| Card fill (light) | `#F1E8DA` / `#ECE3D2` | §1.1 light theme |
| Hairline (light) | `#DCD0BC` | §1.1 light theme |
| Antique gold-brown (icon colour on light) | `#9A6A1C` | §1.1 light theme |

Other jewels in the docs (not used inside icons, available for states): amethyst `#8F6BFF`, emerald `#3F9D7A`.

**Type (context only, no type is used in the icons):** the docs don't lock fonts. The prototype screenshots use a Cormorant-style high-contrast serif for titles and a geometric sans (Jost-like) for body and labels. The preview sheets use Cormorant Garamond and Jost. The icon stroke weight is set to sit alongside that sans at 13–16px.

## 2. Design rules

**Line icons (ui/, codex/, *-mono.svg)**
- `viewBox="0 0 24 24"`, live area 2–22 (2px padding), optical keylines: circle r≈9.5, square 18, portrait 16×20.
- Stroke **1.75**, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"`. Interior facet or detail lines drop to 1.1–1.35 (dice facets, fletching) so shapes stay open at 20px.
- Colour is always `currentColor`. Set CSS `color` to tint: `#E8C887` on dark, `#9A6A1C` (or text colour `#2B2233`) on light.
- Solid accents (stars, pips, eyes) use `fill="currentColor"`, so the icon stays one colour.

**Badges (classes/, peoples/, halls/)**
- `viewBox="0 0 48 48"`. The frame shape tells you the family at a glance:
  - **Peoples = circle medallion**
  - **Classes = cut-corner octagon**
  - **Order Halls = arched doorway** (from the manifest's "corridor of doorways")
- Dark badge: indigo→night radial fill (`#330B5F`→`#0B0910`) with a royal-purple top glow, 1.5px antique-gold ring, 0.75px moonsilver inner hairline, glyph in `#E8C887`, accents in `#FFD750`.
- Light badge: parchment fill (`#F6EEDE`→`#ECE3D2`), `#9A6A1C` ring and glyph, `#DCD0BC` hairline, accents in royal purple `#7E0E90`.
- Each glyph is the same drawing as its `-mono` twin, scaled about 1.55× with a slightly heavier stroke (1.9) so it holds up at 20px.
- Gradient ids are namespaced (`vi-<category>-<id>-<d|l>-bg`), so any number of badges can be inlined on one page without id collisions.

**Codex card medallion (CODEX_IMAGE_MANIFEST.md §1.3):** Codex card art keeps a quiet **top-left icon safe zone** (from a 6% inset, about 26% wide × 22% tall of a 4:5 card). Put the badge there:
- Badge size is 18–20% of the card width (a 360px card takes a 64–72px badge).
- Inset 6% from the top and left edges.
- Keep the CSS radial darkening behind it: `rgba(11,9,16,.45)` in dark mode.
- In light mode use the `-light` badge. The top-right 30% × 12% zone stays free for the "YOUR PEOPLE" chip.

## 3. Sizes

| Use | Size | Variant |
|---|---|---|
| Bottom nav (REALM / MAP / d20 / SCENES / SELF) | 24px (the d20 centre button can be 28px) | `ui-*` |
| Desktop sidebar, buttons, chips | 20px (smallest supported) | `ui-*`, `codex-*`, `*-mono` |
| Inline in 13–14px text | 16px (line icons only; badges should not go below 20px) | `ui-*` |
| Codex filter chips (The World · Peoples · Classes …) | 16–18px | `codex-*` |
| List rows (roster, Rite of Making choices) | 32–40px | badge |
| Codex cards / detail headers | 56–96px | badge |
| Vessel profile ("Cassens · Paladin · Crusaders' Hall") | 20px mono inline, or 28–32px badge | both |
| Browser tab, bookmarks, anything **below 32px** | 16–31px | `app/favicon.svg` / `favicon.ico` / `png/favicon-16/32` only |
| App mark at **32px and up** | 32px+ | `app/mark.svg`, `mark-mono.svg`, `app-icon*.svg` |

**App mark below 32px:** always use the favicon. It is a simplified mark drawn for 16–32px. Don't shrink `mark.svg`, `mark-mono.svg` or the app icon below 32px, because their fine crescent and star details fill in.

Scale line icons in whole-pixel steps (16/20/24/32/48) so the 1.75 stroke stays crisp. The previews show every icon at 24px and 64px, and all emblems at 20px (`previews/review-20px-*.png`).

## 4. Clear space and colour

- Line icons: the 2px padding is built in, so keep at least **4px** between an icon and its label or another icon at 24px.
- Badges: keep **1/8 of the badge width** clear on every side (8px for a 64px badge). Don't put a badge inside another frame or ring; the frame is part of the mark.
- App mark: keep clear space equal to the height of the crescent on every side. Below 32px, use `favicon.svg` / `favicon.ico` instead of the mark. Never recolour the colour mark. For one-colour use, take `mark-mono.svg` (e.g. `#E8C887` on night, `#330B5F` or `#9A6A1C` on parchment). Don't place the mark inside artwork (manifest rule).
- Don't add glows or drop-shadows to the icons themselves. The prototype's selected state belongs on the chip/pill background (DESIGN_REVIEW_FIXES.md #7: "soften glow-heavy selected chip/nav states").
- Contrast: `#E8C887` on `#0B0910` ≈ 12:1. `#9A6A1C` on `#F6EEDE` ≈ 4.1:1 and on `#F1E8DA` ≈ 3.9:1 (both pass the 3:1 non-text contrast rule).

## 5. Usage

**Sprite (recommended).** Inline `icons.svg` once, near the top of `<body>`. Keep it inline rather than referencing it as an external file: badges hold gradients, and some browsers drop gradients from externally referenced sprites. Also don't hide the sprite with `display:none`, because that breaks gradients in Chromium; the file already hides itself with a 0×0 box.
```html
<svg class="icon" width="24" height="24"><use href="#ui-d20"/></svg>
<svg width="64" height="64" viewBox="0 0 48 48"><use href="#peoples-varkyn"/></svg>
```
**React**
```jsx
import { Icon } from "./icons/Icon.jsx";
<Icon name="ui-join-call" />                 // inherits color
<Icon name="classes-paladin" size={64} />   // dark badge
<Icon name="halls-crusaders-hall-light" size={64} />
<Icon name="peoples-cassens-mono" size={20} title="Cassens" />
```
**Plain files:** `<img src="icons/classes/mage.svg" width="64" height="64" alt="Mage">`. Use `<img>` for badges. For line icons, prefer an inline SVG or the sprite so that `currentColor` can be tinted.

**Accessibility:** icons next to a visible label take `aria-hidden="true"`. Icon-only buttons need an `aria-label` (Close, Back, Join call, Mute…).

**Naming:** kebab-case, `<category>-<id>[-light|-mono]` in the sprite and manifest. `manifest.json` lists name, file, category, variant, viewBox, label and the source document for every file.

## 6. Canon rules the emblems follow

- Exactly 14 Peoples. **No Veilborn.**
- **Varkyn** = a natural wolf People: a calm heraldic wolf mask with **no moon and no transformation**. The moon-and-claw imagery exists only on the separate *Lycanthropy* affliction icon.
- **Auralith** = crescent and constellation only: **no horns, halo or wings.**
- **Valkary** = a feathered wing and a storm bolt. No legs are drawn at all, so there are no talons.
- **Orks** = short tusks. **Rhovar** = bull horns. **Kaelir** = big cat. **Serynth** = an elegant serpent-dragon head in profile with a swept crest. **Smols** = fairy wings. **Sorns** = water. **Trahgs** = inventor goggles. **Dwemen** = stone arch with keystone and crystal lamp. **Galands** = mountains. **Charms** = a refined profile with a pointed ear and a jewel earring. **Cassens** = a human city skyline (Cassanova, city life).
- Every Order Hall is shown as a symbol, never a location ("Not yet charted"). Blood Hideaway is the vampirism commons, not a class.
- No letters, text or runes. No real-world religious symbols: no crosses (all swords are crossed diagonally), no pentagrams, no halos, no Christian chalice (Priest is a votive candle), no dreamcatcher (Shaman is an ancestral cairn). Golemancer is a carved stone head with a glowing geometric mark, not a robot. Nothing sexual or nude.
- The app mark keeps the logo's "V" because it is the official brand mark. It is the only letterform in the set.

## 7. Inventory

### Classes (15: 14 + Custom) · octagon badge
| id | label | files | source |
|---|---|---|---|
| `classes-mage` | Mage | `classes/mage.svg` · `classes/mage-light.svg` · `classes/mage-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (arcane power, spellwork) |
| `classes-druid` | Druid | `classes/druid.svg` · `classes/druid-light.svg` · `classes/druid-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (nature, wild power, healing) |
| `classes-rogue` | Rogue | `classes/rogue.svg` · `classes/rogue-light.svg` · `classes/rogue-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (secrets, precision, stealth) |
| `classes-hunter` | Hunter | `classes/hunter.svg` · `classes/hunter-light.svg` · `classes/hunter-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (archers, trackers) |
| `classes-priest` | Priest | `classes/priest.svg` · `classes/priest-light.svg` · `classes/priest-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (faith, healing, votive light; no real-world symbols) |
| `classes-paladin` | Paladin | `classes/paladin.svg` · `classes/paladin-light.svg` · `classes/paladin-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (oath, protection) |
| `classes-warlock` | Warlock | `classes/warlock.svg` · `classes/warlock-light.svg` · `classes/warlock-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (pacts, shadows; formless presence, no demon imagery) |
| `classes-warrior` | Warrior | `classes/warrior.svg` · `classes/warrior-light.svg` · `classes/warrior-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (strength, battle presence) |
| `classes-tinker` | Tinker | `classes/tinker.svg` · `classes/tinker-light.svg` · `classes/tinker-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (machines, gadgets) |
| `classes-bard` | Bard | `classes/bard.svg` · `classes/bard-light.svg` · `classes/bard-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (music, performance magic) |
| `classes-monk` | Monk | `classes/monk.svg` · `classes/monk-light.svg` · `classes/monk-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (body control, the Fist) |
| `classes-shaman` | Shaman | `classes/shaman.svg` · `classes/shaman-light.svg` · `classes/shaman-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (spirits, ancestors, earth; ancestral cairn + spirit light) |
| `classes-necromancer` | Necromancer | `classes/necromancer.svg` · `classes/necromancer-light.svg` · `classes/necromancer-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (death, memory; reverent, not gory) |
| `classes-golemancer` | Golemancer | `classes/golemancer.svg` · `classes/golemancer-light.svg` · `classes/golemancer-mono.svg` | DESIGN_CLASSES_HALLS.md; CLASSES_FULL_INVENTORY.md (stone, clay, runes, constructs) |
| `classes-custom` | Custom Class (GM approval) | `classes/custom.svg` · `classes/custom-light.svg` · `classes/custom-mono.svg` | DESIGN_CLASSES_HALLS.md (Custom Class: GM approval, no default hall) |

### Peoples (14) · circle medallion
| id | label | files | source |
|---|---|---|---|
| `peoples-cassens` | Cassens | `peoples/cassens.svg` · `peoples/cassens-light.svg` · `peoples/cassens-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (humanlike; city life, capital Cassanova) |
| `peoples-charms` | Charms | `peoples/charms.svg` · `peoples/charms-light.svg` · `peoples/charms-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (refined, magically gifted, pointed ear; academy/old libraries) |
| `peoples-smols` | Smols | `peoples/smols.svg` · `peoples/smols-light.svg` · `peoples/smols-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (small, winged, fairy-like; adults) |
| `peoples-galands` | Galands | `peoples/galands.svg` · `peoples/galands-light.svg` · `peoples/galands-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (giants of mountains, valleys, cliffs) |
| `peoples-orks` | Orks | `peoples/orks.svg` · `peoples/orks-light.svg` · `peoples/orks-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (green skin, SHORT tusks; War Colleges) |
| `peoples-trahgs` | Trahgs | `peoples/trahgs.svg` · `peoples/trahgs-light.svg` · `peoples/trahgs-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (cave inventors; goggles, workshops) |
| `peoples-dwemen` | Dwemen | `peoples/dwemen.svg` · `peoples/dwemen-light.svg` · `peoples/dwemen-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (master stone builders; underground halls, crystal lamps) |
| `peoples-sorns` | Sorns | `peoples/sorns.svg` · `peoples/sorns-light.svg` · `peoples/sorns-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (sacred water, healing pools) |
| `peoples-varkyn` | Varkyn | `peoples/varkyn.svg` · `peoples/varkyn-light.svg` · `peoples/varkyn-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (natural wolf beast-men; NOT werewolves, no moon transformation) |
| `peoples-rhovar` | Rhovar | `peoples/rhovar.svg` · `peoples/rhovar-light.svg` · `peoples/rhovar-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (bull beast-men; strong bull horns) |
| `peoples-kaelir` | Kaelir | `peoples/kaelir.svg` · `peoples/kaelir-light.svg` · `peoples/kaelir-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (big-cat beast-men: lion/tiger/panther) |
| `peoples-serynth` | Serynth | `peoples/serynth.svg` · `peoples/serynth-light.svg` · `peoples/serynth-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (serpent-dragon beast-men; heat, ritual) |
| `peoples-auralith` | Auralith | `peoples/auralith.svg` · `peoples/auralith-light.svg` · `peoples/auralith-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (celestial; midnight skin, star & moon markings; NO horns/halo/wings) |
| `peoples-valkary` | Valkary | `peoples/valkary.svg` · `peoples/valkary-light.svg` · `peoples/valkary-mono.svg` | DESIGN_RACES.md; RACES_INDEX.md; CANON_NOTES.md (winged harpy-inspired men; human feet, NO talons; storm cliffs) |

### Order Halls (15) · arched doorway
| id | label | files | source |
|---|---|---|---|
| `halls-dawns-chapel` | Dawn’s Chapel — hall of **Priest** | `halls/dawns-chapel.svg` · `halls/dawns-chapel-light.svg` · `halls/dawns-chapel-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-crusaders-hall` | Crusaders’ Hall — hall of **Paladin** | `halls/crusaders-hall.svg` · `halls/crusaders-hall-light.svg` · `halls/crusaders-hall-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-hall-of-the-elements` | Hall of the Elements — hall of **Shaman** | `halls/hall-of-the-elements.svg` · `halls/hall-of-the-elements-light.svg` · `halls/hall-of-the-elements-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-thieves-hall` | Thieves’ Hall — hall of **Rogue** | `halls/thieves-hall.svg` · `halls/thieves-hall-light.svg` · `halls/thieves-hall-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-the-mead-halls` | The Mead Halls — hall of **Warrior** | `halls/the-mead-halls.svg` · `halls/the-mead-halls-light.svg` · `halls/the-mead-halls-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-the-arcane-academy` | The Arcane Academy — hall of **Mage** | `halls/the-arcane-academy.svg` · `halls/the-arcane-academy-light.svg` · `halls/the-arcane-academy-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-the-secret-wilds` | The Secret Wilds — hall of **Druid** | `halls/the-secret-wilds.svg` · `halls/the-secret-wilds-light.svg` · `halls/the-secret-wilds-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-bell-hall-ruins` | Bell Hall Ruins — hall of **Warlock** | `halls/bell-hall-ruins.svg` · `halls/bell-hall-ruins-light.svg` · `halls/bell-hall-ruins-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-the-sacred-crypts` | The Sacred Crypts — hall of **Necromancer** | `halls/the-sacred-crypts.svg` · `halls/the-sacred-crypts-light.svg` · `halls/the-sacred-crypts-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-golem-university` | Golem University — hall of **Golemancer** | `halls/golem-university.svg` · `halls/golem-university-light.svg` · `halls/golem-university-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-the-bellsong-auditorium` | The Bellsong Auditorium — hall of **Bard** | `halls/the-bellsong-auditorium.svg` · `halls/the-bellsong-auditorium-light.svg` · `halls/the-bellsong-auditorium-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-the-wolfclad-lodge` | The Wolfclad Lodge — hall of **Hunter** | `halls/the-wolfclad-lodge.svg` · `halls/the-wolfclad-lodge-light.svg` · `halls/the-wolfclad-lodge-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-steamwhistle-college` | Steamwhistle College — hall of **Tinker** | `halls/steamwhistle-college.svg` · `halls/steamwhistle-college-light.svg` · `halls/steamwhistle-college-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-the-monastery-of-the-fist` | The Monastery of the Fist — hall of **Monk** | `halls/the-monastery-of-the-fist.svg` · `halls/the-monastery-of-the-fist-light.svg` · `halls/the-monastery-of-the-fist-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4 |
| `halls-the-blood-hideaway` | The Blood Hideaway — hall of **Vampires (affliction, not a class)** | `halls/the-blood-hideaway.svg` · `halls/the-blood-hideaway-light.svg` · `halls/the-blood-hideaway-mono.svg` | ORDER_HALLS.md; CODEX_IMAGE_MANIFEST.md §3.4; DESIGN_CLASSES_HALLS.md (Blood Hideaway = vampirism commons) |

### World Codex (16) · 24px line
| id | label | files | source |
|---|---|---|---|
| `codex-world` | The World | `codex/world.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.1 (crescent over the horizon of Virilion) |
| `codex-peoples` | Peoples | `codex/peoples.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.2 (fourteen Peoples) |
| `codex-classes` | Classes | `codex/classes.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.3 (tools of fourteen callings) |
| `codex-halls` | Order Halls | `codex/halls.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.4; ORDER_HALLS.md (corridor of doorways) |
| `codex-places` | Places | `codex/places.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.5 (regions, homelands, Virelios, access rules) |
| `codex-styles` | Styles | `codex/styles.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.6 (atelier mirror) |
| `codex-blessings` | Blessings & Afflictions | `codex/blessings.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.7 (moons of fate over sacred water) |
| `codex-rules` | Rules & Making a Vessel | `codex/rules.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.8 (oath table; fair play) |
| `codex-glossary` | Glossary | `codex/glossary.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.9 (open illuminated codex) |
| `codex-chronicle` | Chronicle / Updates | `codex/chronicle.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.10 (official world updates and events history) |
| `codex-blessing` | Blessing of Continuation | `codex/blessing.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.7 card (warm seed of light over a moonlit pool) |
| `codex-lycanthropy` | Lycanthropy (affliction) | `codex/lycanthropy.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.7 card (silver full moon; a curse, not a People) |
| `codex-vampirism` | Vampirism (affliction) | `codex/vampirism.svg` | DESIGN_WORLD_CODEX.md tab list; CODEX_IMAGE_MANIFEST.md §3 §3.7 card (single drop of blood; beauty and hunger) |
| `codex-not-yet-written` | Not yet written (empty lore) | `codex/not-yet-written.svg` | DESIGN_WORLD_CODEX.md ('Not yet written' state) |
| `codex-not-yet-charted` | Not yet charted (no location) | `codex/not-yet-charted.svg` | ORDER_HALLS.md / DESIGN_WORLD_CODEX.md (Location 'Not yet charted') |
| `codex-your-vessel` | In your vessel's codex | `codex/your-vessel.svg` | DESIGN_WORLD_CODEX.md ("Your vessel" highlight); codex_home_tabs (KAELEN IN THE CODEX) |

### UI & navigation (81) · 24px line
Mobile nav: `ui-realm` · `ui-map` · `ui-d20` (centre) · `ui-scenes` · `ui-self`. Desktop sidebar adds `ui-weave` (Bonds & guilds), `ui-calendar` and `ui-codex`.
Dice visibility: Private = `ui-unseen` · Party = `ui-party` · Scene = `ui-scenes` · Public = `ui-eye`.
RP status: Unseen = `ui-unseen` · In scene = `ui-scenes` · Available = `ui-voice-lit` (or a plain dot).

| id | label | files | source |
|---|---|---|---|
| `ui-realm` | Realm (World Feed) | `ui/realm.svg` | DESIGN_REVIEW_FIXES.md (bottom nav REALM / MAP / d20 / SCENES / SELF); review_post desktop sidebar; DEVELOPER_BRIEF.md core loop 'Realm/Feed' (lantern: 'The lamps of Virelios are lit') |
| `ui-map` | Map | `ui/map.svg` | DESIGN_REVIEW_FIXES.md (bottom nav REALM / MAP / d20 / SCENES / SELF); review_post desktop sidebar; DESIGN_UI_LOCKS.md World Map |
| `ui-d20` | d20 (Dice) | `ui/d20.svg` | DESIGN_REVIEW_FIXES.md (bottom nav REALM / MAP / d20 / SCENES / SELF); review_post desktop sidebar; MECHANISMS.md §4 D20 Dice Roller |
| `ui-scenes` | Scenes (Live RP) | `ui/scenes.svg` | DESIGN_REVIEW_FIXES.md (bottom nav REALM / MAP / d20 / SCENES / SELF); review_post desktop sidebar; DESIGN_REVIEW_FIXES.md 'STEP INSIDE' primary action |
| `ui-self` | Self | `ui/self.svg` | DESIGN_REVIEW_FIXES.md (bottom nav REALM / MAP / d20 / SCENES / SELF); review_post desktop sidebar; DESIGN_UI_LOCKS.md (Vessel | Player); DESIGN_ONE_VESSEL_ONLY.md |
| `ui-weave` | The Weave (Bonds & guilds) | `ui/weave.svg` | DEVELOPER_BRIEF.md 'Weave — connections constellation'; review_post guild_page (Bonds & guilds) |
| `ui-codex` | World Codex | `ui/codex.svg` | DESIGN_WORLD_CODEX.md (entry from Realm; desktop sidebar section) |
| `ui-calendar` | Events calendar | `ui/calendar.svg` | DESIGN_CAMPAIGNS_CALENDAR.md; review_post events_calendar_detail |
| `ui-guild` | Guild | `ui/guild.svg` | DESIGN_GUILDS.md; REVIEW_POST_GUILDS_CALENDAR.md |
| `ui-campaign` | Campaign | `ui/campaign.svg` | DESIGN_CAMPAIGNS_CALENDAR.md (Campaigns: arcs with starting region) |
| `ui-die-d4` | d4 | `ui/die-d4.svg` | MECHANISMS.md §4 D20 Dice Roller (dice set) |
| `ui-die-d6` | d6 | `ui/die-d6.svg` | MECHANISMS.md §4 D20 Dice Roller |
| `ui-die-d8` | d8 | `ui/die-d8.svg` | MECHANISMS.md §4 D20 Dice Roller |
| `ui-die-d10` | d10 | `ui/die-d10.svg` | MECHANISMS.md §4 D20 Dice Roller |
| `ui-die-d12` | d12 | `ui/die-d12.svg` | MECHANISMS.md §4 D20 Dice Roller |
| `ui-die-d100` | d100 (percentile) | `ui/die-d100.svg` | MECHANISMS.md §4 D20 Dice Roller |
| `ui-roll-history` | Roll history | `ui/roll-history.svg` | MECHANISMS.md §4 D20 Dice Roller (roll history) |
| `ui-add` | Add / plus | `ui/add.svg` | Standard UI action used across prototype screens (review_* screenshots); dice modifiers (+/−) |
| `ui-minus` | Minus | `ui/minus.svg` | MECHANISMS.md §4 D20 Dice Roller modifiers (+/−) |
| `ui-join-call` | Join call (voice) | `ui/join-call.svg` | DESIGN_GROUP_CALLS.md; DESIGN_REVIEW_FIXES.md #4 |
| `ui-mic` | Microphone (unmuted) | `ui/mic.svg` | DESIGN_GROUP_CALLS.md (Mute) |
| `ui-mute` | Mute | `ui/mute.svg` | DESIGN_GROUP_CALLS.md (Mute) |
| `ui-deafen` | Deafen | `ui/deafen.svg` | DESIGN_GROUP_CALLS.md (Deafen) |
| `ui-leave-call` | Leave call | `ui/leave-call.svg` | DESIGN_GROUP_CALLS.md (Leave) |
| `ui-report` | Report | `ui/report.svg` | DESIGN_GROUP_CALLS.md (Report) |
| `ui-knock` | Knock (room full) | `ui/knock.svg` | DESIGN_GROUP_CALLS.md (Wait / Knock); DESIGN_CATCHUP_ALL.md §3 |
| `ui-voice-lit` | Voice lit / live | `ui/voice-lit.svg` | DESIGN_GROUP_CALLS.md (Feed: 'Voice lit at [Place]'); Scenes OPEN/LIVE status |
| `ui-chat` | Chat (guild chat) | `ui/chat.svg` | DESIGN_GUILDS.md; REVIEW_POST_GUILDS_CALENDAR.md (Guild chat) |
| `ui-whisper` | Whisper | `ui/whisper.svg` | DESIGN_VESSEL_SHOWCASE.md (Join scene / whisper CTAs) |
| `ui-bond` | Bond / Connect | `ui/bond.svg` | MECHANISMS.md §3 (Follow · Connect); §6 Connections |
| `ui-follow` | Follow / Recruit | `ui/follow.svg` | MECHANISMS.md §3 (Follow); DESIGN_GUILDS.md; REVIEW_POST_GUILDS_CALENDAR.md (Recruiting status) |
| `ui-party` | Party / group | `ui/party.svg` | MECHANISMS.md §4 visibility 'Shared with party'; DESIGN_GROUP_CALLS.md (Party scope) |
| `ui-roster` | Roster | `ui/roster.svg` | DESIGN_GUILDS.md; REVIEW_POST_GUILDS_CALENDAR.md (ranked roster) |
| `ui-crown` | Guild master / rank | `ui/crown.svg` | DESIGN_GUILDS.md; REVIEW_POST_GUILDS_CALENDAR.md (master + co-master) |
| `ui-quest` | Quest | `ui/quest.svg` | DESIGN_GUILDS.md; REVIEW_POST_GUILDS_CALENDAR.md (Guild quests); MECHANISMS.md §8 Quests & Events |
| `ui-leave` | Leave (guild) | `ui/leave.svg` | review_post guild_page (Leave) |
| `ui-walking` | Walking now (presence count) | `ui/walking.svg` | prototype header chip '147 walking'; DESIGN_CATCHUP_ALL.md §6 map heat/counts |
| `ui-vessel` | Vessel (character) | `ui/vessel.svg` | DESIGN_UI_LOCKS.md (Vessel | Player); DESIGN_ONE_VESSEL_ONLY.md |
| `ui-player` | Player (account) | `ui/player.svg` | DESIGN_UI_LOCKS.md (Vessel | Player); DESIGN_ONE_VESSEL_ONLY.md |
| `ui-rite-of-making` | Rite of Making (create vessel) | `ui/rite-of-making.svg` | DEVELOPER_BRIEF.md core loop 1; MECHANISMS.md §2 |
| `ui-portrait-add` | Add portrait ('Add his face') | `ui/portrait-add.svg` | DESIGN_REVIEW_FIXES.md #3 portrait empty state; DESIGN_VESSEL_SHOWCASE.md |
| `ui-gallery` | Gallery | `ui/gallery.svg` | DESIGN_VESSEL_SHOWCASE.md (portrait + optional gallery) |
| `ui-edit` | Edit (quill) | `ui/edit.svg` | MECHANISMS.md §3 owner 'Edit bio fields' |
| `ui-gm-seal` | GM approval (seal) | `ui/gm-seal.svg` | DEVELOPER_BRIEF.md 'Rite of Making → GM approval'; MECHANISMS.md status pending_gm |
| `ui-share` | Share (share card) | `ui/share.svg` | DESIGN_VESSEL_SHOWCASE.md (Share card / link) |
| `ui-link` | Copy link | `ui/link.svg` | DESIGN_VESSEL_SHOWCASE.md (copy link) |
| `ui-external` | Open externally (Discord deep link) | `ui/external.svg` | DEVELOPER_BRIEF.md (Discord deep links, v1 voice = Discord) |
| `ui-pin` | Place / location | `ui/pin.svg` | DESIGN_UI_LOCKS.md (place card); DESIGN_CAMPAIGNS_CALENDAR.md (place) |
| `ui-lock` | Locked (no access) | `ui/lock.svg` | DESIGN_CATCHUP_ALL.md §2-4 (place access, Border Pass); MECHANISMS.md appendices (locked or Knock) |
| `ui-unlock` | Unlocked | `ui/unlock.svg` | DESIGN_CATCHUP_ALL.md §2-4 (place access, Border Pass); MECHANISMS.md appendices |
| `ui-border-pass` | Border Pass | `ui/border-pass.svg` | DESIGN_CATCHUP_ALL.md §2-4 (place access, Border Pass); MECHANISMS.md appendices; WORLD_CODEX glossary |
| `ui-access-open` | Open to all (Virelios) | `ui/access-open.svg` | DESIGN_CATCHUP_ALL.md §2-4 (place access, Border Pass); MECHANISMS.md appendices (Virelios open to everyone); map access legend |
| `ui-homeland` | Homeland (People-gated) | `ui/homeland.svg` | DESIGN_CATCHUP_ALL.md §2-4 (place access, Border Pass); MECHANISMS.md appendices (racial cities / homelands) |
| `ui-order-hall` | Order Hall (class-gated) | `ui/order-hall.svg` | DESIGN_CATCHUP_ALL.md §2-4 (place access, Border Pass); MECHANISMS.md appendices; ORDER_HALLS.md |
| `ui-notifications` | Notifications | `ui/notifications.svg` | DESIGN_UI_LOCKS.md Player (Notifications); prototype header badge |
| `ui-reminder` | Remind me | `ui/reminder.svg` | DESIGN_CAMPAIGNS_CALENDAR.md; events_calendar_detail (REMIND ME) |
| `ui-search` | Search | `ui/search.svg` | DESIGN_WORLD_CODEX.md (global codex search) |
| `ui-close` | Close | `ui/close.svg` | Standard UI action used across prototype screens (review_* screenshots) |
| `ui-back` | Back | `ui/back.svg` | Standard UI action used across prototype screens (review_* screenshots) (‹ GUILD REGISTRY) |
| `ui-chevron-right` | Forward / open | `ui/chevron-right.svg` | Standard UI action used across prototype screens (review_* screenshots) |
| `ui-chevron-down` | Expand | `ui/chevron-down.svg` | Standard UI action used across prototype screens (review_* screenshots) |
| `ui-check` | Confirm / selected | `ui/check.svg` | Standard UI action used across prototype screens (review_* screenshots); DESIGN_REVIEW_FIXES.md #2 selected chips |
| `ui-more` | More | `ui/more.svg` | Standard UI action used across prototype screens (review_* screenshots) |
| `ui-menu` | Menu | `ui/menu.svg` | Standard UI action used across prototype screens (review_* screenshots) |
| `ui-filter` | Filter | `ui/filter.svg` | REVIEW_POST_GUILDS_CALENDAR.md (calendar filters); Scenes discovery filters |
| `ui-settings` | Settings | `ui/settings.svg` | REVIEW_POST_GUILDS_CALENDAR.md (Player settings: theme, layout, privacy); DESIGN_DESKTOP_MODE.md |
| `ui-eye` | Visible / public | `ui/eye.svg` | MECHANISMS.md §4 visibility (public); privacy toggles |
| `ui-unseen` | Unseen / private | `ui/unseen.svg` | DESIGN_UI_LOCKS.md RP status 'Unseen'; DESIGN_GROUP_CALLS.md (Unseen vessels hidden); dice 'Private' |
| `ui-time` | Time (America/New_York) | `ui/time.svg` | DESIGN_CAMPAIGNS_CALENDAR.md |
| `ui-theme-dark` | Dark theme (Night court) | `ui/theme-dark.svg` | DESIGN_CATCHUP_ALL.md §1; MECHANISMS.md Theme appendix |
| `ui-theme-light` | Light theme (Parchment & gold) | `ui/theme-light.svg` | DESIGN_CATCHUP_ALL.md §1 |
| `ui-layout-phone` | Phone layout | `ui/layout-phone.svg` | REVIEW_POST_GUILDS_CALENDAR.md (Player settings: theme, layout, privacy); DESIGN_DESKTOP_MODE.md |
| `ui-layout-desktop` | Desktop layout | `ui/layout-desktop.svg` | REVIEW_POST_GUILDS_CALENDAR.md (Player settings: theme, layout, privacy); DESIGN_DESKTOP_MODE.md |
| `ui-alert` | Content warning / alert | `ui/alert.svg` | CODEX rules (consent and content warnings); Standard UI action used across prototype screens (review_* screenshots) |
| `ui-spark` | Spark (your vessel / primary) | `ui/spark.svg` | prototype ✦ accent ('KAELEN IN THE CODEX', 'PRIMARY GUILD'); logo four-point stars |
| `ui-stat-might` | Might | `ui/stat-might.svg` | MECHANISMS.md §2 step 5 (stats Might, Grace, Grit, Wit, Spirit, Presence); WORLD_DIGEST.md |
| `ui-stat-grace` | Grace | `ui/stat-grace.svg` | MECHANISMS.md §2 step 5 (stats Might, Grace, Grit, Wit, Spirit, Presence); WORLD_DIGEST.md |
| `ui-stat-grit` | Grit | `ui/stat-grit.svg` | MECHANISMS.md §2 step 5 (stats Might, Grace, Grit, Wit, Spirit, Presence); WORLD_DIGEST.md |
| `ui-stat-wit` | Wit | `ui/stat-wit.svg` | MECHANISMS.md §2 step 5 (stats Might, Grace, Grit, Wit, Spirit, Presence); WORLD_DIGEST.md |
| `ui-stat-spirit` | Spirit | `ui/stat-spirit.svg` | MECHANISMS.md §2 step 5 (stats Might, Grace, Grit, Wit, Spirit, Presence); WORLD_DIGEST.md |
| `ui-stat-presence` | Presence | `ui/stat-presence.svg` | MECHANISMS.md §2 step 5 (stats Might, Grace, Grit, Wit, Spirit, Presence); WORLD_DIGEST.md |

### App (5)
| id | label | files | source |
|---|---|---|---|
| `app-app-icon` | App icon (1024, rounded square, iOS/desktop) | `app/app-icon.svg` | handoff/Virilion-logo.png (official logo mark: V, three-spire castle, gold crescent, four-point stars, violet flame arcs); CODEX_IMAGE_MANIFEST.md §1.1 palette |
| `app-app-icon-maskable` | App icon, maskable/full-bleed (PWA, Android) | `app/app-icon-maskable.svg` | handoff/Virilion-logo.png (official logo mark: V, three-spire castle, gold crescent, four-point stars, violet flame arcs); CODEX_IMAGE_MANIFEST.md §1.1 palette |
| `app-favicon` | Favicon (32, simplified mark) | `app/favicon.svg` | handoff/Virilion-logo.png (official logo mark: V, three-spire castle, gold crescent, four-point stars, violet flame arcs); CODEX_IMAGE_MANIFEST.md §1.1 palette |
| `app-mark` | Logo mark (colour, transparent) | `app/mark.svg` | handoff/Virilion-logo.png (official logo mark: V, three-spire castle, gold crescent, four-point stars, violet flame arcs); CODEX_IMAGE_MANIFEST.md §1.1 palette |
| `app-mark-mono` | Logo mark (single colour, currentColor) | `app/mark-mono.svg` | handoff/Virilion-logo.png (official logo mark: V, three-spire castle, gold crescent, four-point stars, violet flame arcs); CODEX_IMAGE_MANIFEST.md §1.1 palette |

PNG exports in `app/png/`: app-icon 1024/512/192, apple-touch-icon-180, maskable 512/192, favicon 16/32/48, plus `app/favicon.ico`.

```html
<link rel="icon" href="/icons/app/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icons/app/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/icons/app/png/apple-touch-icon-180.png">
<!-- manifest.webmanifest: {"src":"/icons/app/png/maskable-512.png","sizes":"512x512","purpose":"maskable"} -->
```

## 8. Not included (and why)
- **Styles** (Twink, Muscle, Otter, Wolf, Chub, Bear, Daddy): these are body types. The rule is "nothing sexual or nude", and a body-type pictogram reads as body-rating, so the set leaves them out. Use the `codex-styles` tab icon plus text.
- **Role** (Top / Verse / Bottom): sexual role, deliberately excluded.
- **Map regions** (16 regions): the map lock is "colour regions, not icons". `ui-homeland`, `ui-access-open` (Virelios) and `ui-order-hall` cover the access legend.
- **Discord logo:** trademarked. `ui-external` + `ui-join-call` stand in for "Open Discord voice".

## 9. Regenerating
The source lives in `assets/icons_build/`: `defs_*.py` and `overrides.py` hold the glyph drawings, `appmark.py` the logo mark, and `final.py` the build, svgo, validation, sprite, manifest and previews. Run `python3 final.py`, then `python3 readme.py`. Requires rsvg-convert and svgo.
