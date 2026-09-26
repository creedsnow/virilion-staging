/* <dice-stage> — real 3D dice with hand-rolled rigid-body tumbling (three.js).
   API:  el.roll({sides, result, theme}) -> Promise<result>
         el.setTheme(name)
   Events: 'die-settled' (detail {result, sides, crit, fumble})
   Attrs: theme, muted                                                  */
(function () {
  const CDN = 'https://esm.sh/three@0.160.0';
  let THREE = null, loadingThree = null;
  const loadThree = () => (loadingThree ||= import(/* @vite-ignore */ CDN).then(m => (THREE = m.default || m)));

  const THEMES = {
    virilion: { base: '#141018', rim: '#3a2c1a', ink: '#e8c887', glow: '#c9a35b', metal: 0.85, rough: 0.28 },
    auralith: { base: '#0f1420', rim: '#25304a', ink: '#dbe7ff', glow: '#9fc2ff', metal: 0.7, rough: 0.2 },
    serynth:  { base: '#1a1206', rim: '#4a3410', ink: '#ffd98a', glow: '#e0a93f', metal: 0.95, rough: 0.18 },
    varkyn:   { base: '#14161c', rim: '#2e3340', ink: '#e6ecf2', glow: '#aebfd0', metal: 0.45, rough: 0.5 },
    valkary:  { base: '#0b1620', rim: '#17384a', ink: '#c9f0ff', glow: '#59c8ee', metal: 0.8, rough: 0.22 },
    rhovar:   { base: '#181513', rim: '#3a332c', ink: '#e4d8c4', glow: '#b8a184', metal: 0.2, rough: 0.78 },
    velkrath: { base: '#120c16', rim: '#3a1f46', ink: '#e8ccff', glow: '#b07ae0', metal: 0.7, rough: 0.3 },
    tier1:  { base: '#3a3834', rim: '#55524c', ink: '#e8e3d8', glow: '#8a8578', metal: 0.05, rough: 0.92 },
    tier2:  { base: '#1c2530', rim: '#3a4a5a', ink: '#dcebf7', glow: '#7fa0bb', metal: 0.2, rough: 0.7 },
    tier3:  { base: '#2e1e12', rim: '#5a3a22', ink: '#f4dcb2', glow: '#b07a44', metal: 0.1, rough: 0.8 },
    tier4:  { base: '#2e1c0c', rim: '#7a4a1e', ink: '#ffdca4', glow: '#c8823a', metal: 0.8, rough: 0.35 },
    tier5:  { base: '#1e2027', rim: '#6a7282', ink: '#f2f6ff', glow: '#c9d4e6', metal: 0.92, rough: 0.2 },
    tier6:  { base: '#0c2018', rim: '#1f5a44', ink: '#c6f7e0', glow: '#3f9d7a', metal: 0.5, rough: 0.22 },
    tier7:  { base: '#1a0f28', rim: '#4a2a78', ink: '#ead9ff', glow: '#8f6bff', metal: 0.6, rough: 0.2 },
    tier8:  { base: '#0a1428', rim: '#1c3f7a', ink: '#d4e6ff', glow: '#59a7ee', metal: 0.7, rough: 0.16 },
    tier9:  { base: '#241906', rim: '#8a6414', ink: '#fff2c4', glow: '#e8c887', metal: 0.96, rough: 0.14 },
    tier10: { base: '#07060c', rim: '#2a2440', ink: '#ffffff', glow: '#c3b0ff', metal: 0.9, rough: 0.1 },
    molten: { base: '#2a0a02', rim: '#b8400c', ink: '#ffe08a', glow: '#ff6a1a', metal: 0.35, rough: 0.45 },
    storm:  { base: '#0a1a26', rim: '#2a6a8a', ink: '#e8fbff', glow: '#59c8ee', metal: 0.75, rough: 0.18 },
    rime:   { base: '#16242e', rim: '#6aa8c8', ink: '#ffffff', glow: '#a8e4ff', metal: 0.4, rough: 0.12 },
    tide:   { base: '#06201f', rim: '#1f6e6a', ink: '#d6fff9', glow: '#3fb7b0', metal: 0.6, rough: 0.2 },
    night:  { base: '#0b0d22', rim: '#2e3570', ink: '#e8ebff', glow: '#8f9dff', metal: 0.6, rough: 0.22 },
    shade:  { base: '#0c0812', rim: '#3a2a4a', ink: '#e2ccff', glow: '#9a7ab8', metal: 0.3, rough: 0.5 },
    heal:   { base: '#0a2016', rim: '#2a7a50', ink: '#eafff2', glow: '#6fe0a0', metal: 0.4, rough: 0.25 },
    nightcourt: { base: '#07060a', rim: '#2a2418', ink: '#e8c887', glow: '#c9a35b', metal: 0.9, rough: 0.12 },
    bone:     { base: '#e6d9bc', rim: '#b9a47c', ink: '#4a2e10', glow: '#e8c887', metal: 0.05, rough: 0.85 },
    gilded:   { base: '#3a2410', rim: '#b8862c', ink: '#fff0c4', glow: '#ffd98a', metal: 0.98, rough: 0.16 },
    mosswood: { base: '#14241a', rim: '#3a5a34', ink: '#d8f5d0', glow: '#8fe0a8', metal: 0.15, rough: 0.7 },
    bloomspore: { base: '#2a3a1c', rim: '#5a7a3a', ink: '#ffd6e8', glow: '#f0a0c8', metal: 0.2, rough: 0.35 },
    emberheart: { base: '#1e0804', rim: '#6a1a08', ink: '#ffd08a', glow: '#ff6a1a', metal: 0.3, rough: 0.55 },
    honeycomb: { base: '#3a2408', rim: '#b8801c', ink: '#fff0c4', glow: '#f2b53a', metal: 0.55, rough: 0.25 },
    rimefrost: { base: '#b8c8d8', rim: '#e8f4ff', ink: '#1a2a3a', glow: '#cfe6ff', metal: 0.1, rough: 0.6 },
    stormglass: { base: '#1a181e', rim: '#4a4458', ink: '#efe6ff', glow: '#a07aff', metal: 0.5, rough: 0.4 },
    tideglass: { base: '#0c2a26', rim: '#2a7a6a', ink: '#e0fff6', glow: '#6fe0c8', metal: 0.3, rough: 0.15 },
    starveil: { base: '#0c0e24', rim: '#3a3a7a', ink: '#efeaff', glow: '#c3b0ff', metal: 0.7, rough: 0.14 }
  };

  const LABELS = {
    4: ['1','2','3','4'],
    6: ['1','2','3','4','5','6'],
    8: ['1','2','3','4','5','6','7','8'],
    10: ['1','2','3','4','5','6','7','8','9','10','1','2','3','4','5','6','7','8','9','10'],
    12: ['1','2','3','4','5','6','7','8','9','10','11','12'],
    20: Array.from({ length: 20 }, (_, i) => String(i + 1)),
    100: ['00','10','20','30','40','50','60','70','80','90','00','10','20','30','40','50','60','70','80','90']
  };
  const FACE_GEO = { 4: 4, 6: 6, 8: 8, 10: 20, 12: 12, 20: 20, 100: 20 };

  class DiceStage extends HTMLElement {
    static get observedAttributes() { return ['theme']; }
    attributeChangedCallback(n, o, v) { if (n === 'theme' && v && v !== o && this._built) this.swapTheme(v); }
    set theme(v) { if (v && this._built) this.swapTheme(v); else if (v) this.setAttribute('theme', v); }
    get theme() { return this._theme; }
    swapTheme(name) {
      if (!THEMES[name] || name === this._theme) return;
      if (!this._die || this._rolling) { this._theme = name; if (this._die && !this._rolling) this._build(this._sides); return; }
      this._pendingTheme = name; this._swapT = 0; this._swapping = true; this._swapBuilt = false; this._swapFrom = this._state === 'rest' ? 'rest' : 'idle';
    }
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.display = 'block';
      this.style.position = 'relative';
      this.style.touchAction = 'none';
      if (!this.style.width) this.style.width = '100%';
      if (!this.style.height) this.style.height = '100%';
      this._theme = this.getAttribute('theme') || 'virilion';
      this._sides = 20;
      this._ready = this._init();
      this.addEventListener('pointerdown', () => { if (!this._rolling) this.dispatchEvent(new CustomEvent('die-tapped')); });
    }

    async _init() {
      await loadThree();
      const w = this.clientWidth || 320, h = this.clientHeight || 320;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
      this.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
      cam.position.set(0, 6.4, 7.6); cam.lookAt(0, 0.9, 0);

      scene.add(new THREE.AmbientLight(0x6a6480, 0.85));
      const key = new THREE.DirectionalLight(0xfff0d0, 2.4);
      key.position.set(4, 8, 5); key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -6; key.shadow.camera.right = 6;
      key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
      scene.add(key);
      const rim = new THREE.PointLight(0x8f6bff, 14, 18); rim.position.set(-4, 2.4, -3); scene.add(rim);
      const warm = new THREE.PointLight(0xffb45e, 10, 16); warm.position.set(3.4, 1.6, 3.2); scene.add(warm);
      this._glowLight = new THREE.PointLight(0xffd98a, 0, 12); this._glowLight.position.set(0, 1.2, 0); scene.add(this._glowLight);

      const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.44 }));
      floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

      this._r = renderer; this._scene = scene; this._cam = cam;
      this._build(this._sides);

      const ro = new ResizeObserver(() => {
        const W = this.clientWidth || 1, H = this.clientHeight || 1;
        renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
      });
      ro.observe(this);

      this._clock = new THREE.Clock();
      const loop = () => {
        this._raf = requestAnimationFrame(loop);
        this._step(Math.min(this._clock.getDelta(), 0.033));
        renderer.render(scene, cam);
      };
      loop();
      this.dispatchEvent(new CustomEvent('stage-ready'));
    }

    disconnectedCallback() { cancelAnimationFrame(this._raf); }

    /* ---------- geometry + face atlas ---------- */
    _build(sides) {
      const t = THEMES[this._theme] || THEMES.virilion;
      const faces = FACE_GEO[sides], labels = LABELS[sides];
      let g;
      if (faces === 4) g = new THREE.TetrahedronGeometry(1.4);
      else if (faces === 6) g = new THREE.BoxGeometry(1.7, 1.7, 1.7);
      else if (faces === 8) g = new THREE.OctahedronGeometry(1.32);
      else if (faces === 12) g = new THREE.DodecahedronGeometry(1.18);
      else g = new THREE.IcosahedronGeometry(1.25);
      g = g.toNonIndexed();
      g.computeVertexNormals();

      const pos = g.attributes.position;
      const tri = pos.count / 3;
      const clusters = [];
      const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), N = new THREE.Vector3();
      for (let i = 0; i < tri; i++) {
        A.fromBufferAttribute(pos, i * 3); B.fromBufferAttribute(pos, i * 3 + 1); C.fromBufferAttribute(pos, i * 3 + 2);
        N.copy(B).sub(A).cross(new THREE.Vector3().copy(C).sub(A)).normalize();
        let hit = clusters.find(c => c.n.dot(N) > 0.985);
        if (!hit) { hit = { n: N.clone(), tris: [] }; clusters.push(hit); }
        hit.tris.push(i);
      }

      const cols = Math.ceil(Math.sqrt(clusters.length)), rows = Math.ceil(clusters.length / cols), CELL = 256;
      const mk = () => { const c = document.createElement('canvas'); c.width = cols * CELL; c.height = rows * CELL; return c; };
      const faceCv = mk(), glowCv = mk();
      const fx = faceCv.getContext('2d'), gx = glowCv.getContext('2d');
      fx.fillStyle = t.base; fx.fillRect(0, 0, faceCv.width, faceCv.height);
      gx.fillStyle = '#000'; gx.fillRect(0, 0, glowCv.width, glowCv.height);

      const uv = new Float32Array(pos.count * 2);
      clusters.forEach((cl, ci) => {
        const cx = (ci % cols) * CELL, cy = Math.floor(ci / cols) * CELL;
        // cell art
        const rg = fx.createRadialGradient(cx + CELL / 2, cy + CELL / 2, 8, cx + CELL / 2, cy + CELL / 2, CELL * 0.62);
        rg.addColorStop(0, t.rim); rg.addColorStop(1, t.base);
        fx.fillStyle = rg; fx.fillRect(cx, cy, CELL, CELL);
        const label = labels[ci % labels.length];
        for (const ctx of [fx, gx]) {
          ctx.save();
          ctx.translate(cx + CELL / 2, cy + CELL / 2);
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.font = `600 ${label.length > 1 ? 98 : 124}px Spectral, Georgia, serif`;
          ctx.fillStyle = ctx === fx ? t.ink : t.glow;
          ctx.fillText(label, 0, 6);
          ctx.strokeStyle = ctx === fx ? 'rgba(255,255,255,.18)' : t.glow;
          ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, CELL * 0.40, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        }

        // plane basis + normalize verts into the cell
        const n = cl.n, u = new THREE.Vector3(), v = new THREE.Vector3();
        u.set(0, 1, 0).cross(n); if (u.lengthSq() < 1e-4) u.set(1, 0, 0); u.normalize();
        v.copy(n).cross(u).normalize();
        const P = [], cen = new THREE.Vector3();
        cl.tris.forEach(ti => { for (let k = 0; k < 3; k++) { const p = new THREE.Vector3().fromBufferAttribute(pos, ti * 3 + k); P.push({ i: ti * 3 + k, p }); cen.add(p); } });
        cen.divideScalar(P.length);
        let R = 0;
        P.forEach(({ p }) => { const d = new THREE.Vector3().copy(p).sub(cen); R = Math.max(R, Math.hypot(d.dot(u), d.dot(v))); });
        const s = 0.42 / (R || 1);
        P.forEach(({ i, p }) => {
          const d = new THREE.Vector3().copy(p).sub(cen);
          const ux = 0.5 + d.dot(u) * s, vy = 0.5 + d.dot(v) * s;
          uv[i * 2] = (cx + ux * CELL) / faceCv.width;
          uv[i * 2 + 1] = 1 - (cy + (1 - vy) * CELL) / faceCv.height;
        });
        cl.centroid = cen; cl.inradius = Math.abs(cen.dot(n)); cl.label = label;
      });
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

      const tex = new THREE.CanvasTexture(faceCv), gtex = new THREE.CanvasTexture(glowCv);
      tex.anisotropy = 4;
      const mat = new THREE.MeshStandardMaterial({
        map: tex, emissiveMap: gtex, emissive: new THREE.Color(t.glow),
        emissiveIntensity: 0.35, metalness: t.metal, roughness: t.rough
      });
      if (this._die) { this._scene.remove(this._die); this._die.traverse(o => { o.geometry?.dispose?.(); }); }
      const mesh = new THREE.Mesh(g, mat);
      mesh.castShadow = true;
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(g, 12),
        new THREE.LineBasicMaterial({ color: new THREE.Color(t.glow), transparent: true, opacity: 0.55 })
      );
      mesh.add(edges);
      this._die = mesh; this._mat = mat; this._clusters = clusters;
      this._radius = Math.max(...clusters.map(c => c.centroid.length())) * 1.12;
      mesh.position.set(0, 2.2, 0);
      mesh.rotation.set(0.6, 0.9, 0.3);
      this._scene.add(mesh);
      this._sides = sides;
      this._state = 'idle';
      this._vel = new THREE.Vector3(); this._spin = new THREE.Vector3(0.25, 0.4, 0.12);
    }

    setTheme(name) {
      if (!THEMES[name] || name === this._theme) return;
      this._theme = name;
      if (this._die) this._build(this._sides);
    }

    /* ---------- audio ---------- */
    _ac() {
      if (this.hasAttribute('muted')) return null;
      try { this._actx ||= new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
      if (this._actx.state === 'suspended') this._actx.resume();
      return this._actx;
    }
    _clack(power) {
      const ac = this._ac(); if (!ac) return;
      const n = ac.sampleRate * 0.09, buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 5);
      const src = ac.createBufferSource(); src.buffer = buf;
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900 + Math.random() * 1400; bp.Q.value = 3.2;
      const gn = ac.createGain(); gn.gain.value = Math.min(0.5, 0.1 + power * 0.14);
      src.connect(bp).connect(gn).connect(ac.destination); src.start();
      const o = ac.createOscillator(), og = ac.createGain();
      o.type = 'sine'; o.frequency.value = 120 + Math.random() * 40;
      og.gain.setValueAtTime(Math.min(0.22, 0.05 + power * 0.06), ac.currentTime);
      og.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.14);
      o.connect(og).connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.15);
    }
    _chime(kind) {
      const ac = this._ac(); if (!ac) return;
      const t0 = ac.currentTime;
      const notes = kind === 'crit' ? [523.25, 659.25, 783.99, 1046.5] : [174.6, 138.6, 110];
      notes.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = kind === 'crit' ? 'triangle' : 'sawtooth';
        o.frequency.value = f;
        const st = t0 + i * (kind === 'crit' ? 0.07 : 0.11);
        g.gain.setValueAtTime(0, st);
        g.gain.linearRampToValueAtTime(kind === 'crit' ? 0.16 : 0.1, st + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, st + (kind === 'crit' ? 1.5 : 0.9));
        o.connect(g).connect(ac.destination); o.start(st); o.stop(st + 1.6);
      });
    }

    /* ---------- roll ---------- */
    roll(opts = {}) {
      const sides = opts.sides || this._sides || 20;
      if (opts.theme) this.setTheme(opts.theme);
      return (this._ready || Promise.resolve()).then(() => {
        if (sides !== this._sides || opts.theme) this._build(sides);
        const labels = LABELS[sides];
        const result = opts.result != null ? String(opts.result) : labels[Math.floor(Math.random() * labels.length)];
        this._target = result;
        this._rolling = true;
        this._state = 'tumble';
        this._t = 0;
        this._mat.emissiveIntensity = 0.35;
        this._glowLight.intensity = 0;
        const d = this._die;
        d.position.set((Math.random() - 0.5) * 1.6, 4.6 + Math.random(), -1.6 + Math.random() * 0.8);
        d.quaternion.setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6));
        this._vel.set((Math.random() - 0.5) * 4.6, -2.2, 2.6 + Math.random() * 1.6);
        this._spin.set((Math.random() - 0.5) * 26, (Math.random() - 0.5) * 26, (Math.random() - 0.5) * 26);
        try { navigator.vibrate?.(18); } catch (e) {}
        this._clack(0.6);
        return new Promise(res => { this._resolve = res; });
      });
    }

    _step(dt) {
      const d = this._die; if (!d) return;
      // theme swap — spin down, rebuild, pop back with a flash of the new colour
      if (this._swapping) {
        this._swapT += dt;
        const T = this._swapT;
        if (T < 0.22) { const k = T / 0.22; d.scale.setScalar(1 - 0.75 * k * k); d.rotation.y += dt * 22; d.rotation.x += dt * 8; }
        else if (!this._swapBuilt) {
          this._theme = this._pendingTheme; const p = d.position.clone(); this._build(this._sides);
          this._die.position.copy(p); this._die.quaternion.copy(d.quaternion); this._die.scale.setScalar(0.25); this._swapBuilt = true;
          const t = THEMES[this._theme]; this._glowLight.color.set(t.glow);
        } else {
          const k = Math.min(1, (T - 0.22) / 0.5), e = 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2);
          this._die.scale.setScalar(0.25 + 0.75 * e); this._die.rotation.y += dt * 14 * (1 - k);
          this._mat.emissiveIntensity = 0.35 + (1 - k) * 2.2; this._glowLight.intensity = (1 - k) * 18;
          if (k >= 1) { this._die.scale.setScalar(1); this._swapping = false; this._swapBuilt = false; this._glowLight.intensity = 0; this._state = this._swapFrom || 'idle'; this._t = 0; this._flare = 0; }
        }
        return;
      }
      if (this._state === 'idle') { d.rotation.y += dt * 0.28; d.rotation.x += dt * 0.11; d.position.y = 2.1 + Math.sin(performance.now() / 1400) * 0.13; return; }

      if (this._state === 'tumble') {
        this._t += dt;
        this._vel.y -= 22 * dt;
        d.position.addScaledVector(this._vel, dt);
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(this._spin.x * dt, this._spin.y * dt, this._spin.z * dt));
        d.quaternion.premultiply(q);
        const r = this._radius;
        if (d.position.y < r) {
          d.position.y = r;
          if (this._vel.y < -1.1) this._clack(Math.min(1, Math.abs(this._vel.y) / 9));
          this._vel.y = -this._vel.y * 0.44;
          this._vel.x *= 0.72; this._vel.z *= 0.72;
          this._spin.multiplyScalar(0.62);
          try { navigator.vibrate?.(8); } catch (e) {}
        }
        const LX = 3.0, LZ = 2.2;
        ['x', 'z'].forEach((ax, i) => {
          const lim = i ? LZ : LX;
          if (Math.abs(d.position[ax]) > lim) {
            d.position[ax] = Math.sign(d.position[ax]) * lim;
            this._vel[ax] *= -0.55; this._spin.multiplyScalar(0.8);
            this._clack(0.35);
          }
        });
        if (this._t > 1.25 && Math.abs(this._vel.y) < 3.2) this._beginSettle();
        else if (this._t > 2.4) this._beginSettle();
        return;
      }

      if (this._state === 'settle') {
        this._t += dt;
        const k = Math.min(1, this._t / 0.42), e = 1 - Math.pow(1 - k, 3);
        d.quaternion.slerpQuaternions(this._q0, this._q1, e);
        d.position.x = this._p0.x + (this._p1.x - this._p0.x) * e;
        d.position.y = this._p0.y + (this._p1.y - this._p0.y) * e;
        d.position.z = this._p0.z + (this._p1.z - this._p0.z) * e;
        if (k >= 1) {
          this._state = 'rest'; this._t = 0; this._rolling = false;
          const n = Number(this._target);
          const crit = this._sides === 20 && n === 20, fumble = this._sides === 20 && n === 1;
          if (crit) { this._chime('crit'); try { navigator.vibrate?.([22, 40, 22, 40, 90]); } catch (e) {} }
          else if (fumble) { this._chime('fumble'); try { navigator.vibrate?.(140); } catch (e) {} }
          this._flare = crit ? 1 : fumble ? -1 : 0;
          this._resolve?.(this._target);
          this.dispatchEvent(new CustomEvent('die-settled', { detail: { result: this._target, sides: this._sides, crit, fumble } }));
        }
        return;
      }

      // rest — breathing glow, crit/fumble flare
      this._t += dt;
      const base = 0.35 + Math.sin(this._t * 2) * 0.08;
      if (this._flare === 1) {
        const f = Math.max(0, 1 - this._t / 2.2);
        this._mat.emissiveIntensity = base + f * 3.4;
        this._glowLight.color.set(0xffd98a); this._glowLight.intensity = f * 26;
        d.rotation.y += dt * 0.5 * f;
      } else if (this._flare === -1) {
        const f = Math.max(0, 1 - this._t / 2.2);
        this._mat.emissiveIntensity = base + f * 1.2;
        this._glowLight.color.set(0xc4324a); this._glowLight.intensity = f * 20;
        d.position.y = this._p1.y + Math.sin(this._t * 26) * 0.045 * f;
      } else {
        this._mat.emissiveIntensity = base;
        this._glowLight.intensity = 0;
      }
    }

    _beginSettle() {
      const d = this._die;
      const cl = this._clusters.find(c => c.label === String(this._target)) || this._clusters[0];
      const up = new THREE.Vector3(0, 1, 0);
      const q = new THREE.Quaternion().setFromUnitVectors(cl.n.clone().normalize(), up);
      const n0 = cl.n.clone().normalize(); const u0 = new THREE.Vector3(0, 1, 0).cross(n0); if (u0.lengthSq() < 1e-4) u0.set(1, 0, 0); u0.normalize();
      const v0 = new THREE.Vector3().copy(n0).cross(u0).normalize().applyQuaternion(q);
      const yaw = new THREE.Quaternion().setFromAxisAngle(up, Math.PI - Math.atan2(v0.x, v0.z));
      this._q0 = d.quaternion.clone();
      this._q1 = yaw.multiply(q);
      this._p0 = d.position.clone();
      this._p1 = new THREE.Vector3(
        THREE.MathUtils.clamp(d.position.x, -1.3, 1.3),
        cl.inradius,
        THREE.MathUtils.clamp(d.position.z, -0.9, 0.9)
      );
      this._state = 'settle'; this._t = 0;
      this._clack(0.5);
    }
  }
  if (!customElements.get('dice-stage')) customElements.define('dice-stage', DiceStage);
})();
