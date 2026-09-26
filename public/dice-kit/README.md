# Virilion Dice Kit

The 3D dice from the Casting Bowl, packaged as one framework-free web component.

## Files
- `dice-stage.js` — the `<dice-stage>` component. It loads three.js from a CDN (esm.sh) the first time it's used.
- `index.html` — a demo page. Serve the folder, open it, and roll. It can also:
  - download the current die as a **GLB** model, for Blender, Unity or three.js
  - record a roll as a **WebM** video

## Use it in a site
```html
<script src="dice-stage.js"></script>
<dice-stage id="stage" theme="virilion" style="width:480px;height:360px"></dice-stage>
<script>
  const el = document.getElementById('stage');
  el.roll({ sides: 20, result: '17' }).then(r => console.log('landed on', r));
</script>
```
It works in React, Vue, Svelte or plain HTML, because it's a standard custom element.

## API
- `el.roll({ sides, result, theme })` returns a Promise that resolves with the face that landed.
  - `sides`: 4, 6, 8, 10, 12, 20 or 100
  - `result`: optional. Pass the server's roll so the die lands on it. Always decide the roll on the server, never in the browser.
- `el.setAttribute('theme', name)` — spins the die and swaps its skin.
- `muted` attribute — turns off the rattle and chime sounds.
- Events: `die-settled` (detail `{result, sides, crit, fumble}`) and `die-tapped`.

## Animations built in
- The die tumbles with gravity, bounces and settles, with a rattle on each impact.
- It lands with the number upright, facing the viewer.
- A natural 20 flares gold with a chime and a vibration on phones.
- A natural 1 shakes and glows red.
- Changing skin spins the die down and pops it back in the new colours.
- At rest it idles with a slow float and a breathing glow.

## Skins
virilion, nightcourt, starveil, gilded, bone, mosswood, molten, storm, rime, tide, night, shade, heal, tier1–tier10, plus the People skins auralith, serynth, varkyn, valkary, rhovar and velkrath.

## Notes for production
- To work offline, bundle three.js yourself: replace the `CDN` import at the top of `dice-stage.js` with your own build.
- The d% is a single tens die. For a full 1–100 roll, roll it alongside a d10.
