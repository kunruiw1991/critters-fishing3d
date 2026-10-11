(function () {
  "use strict";

  // Safe roundRect polyfill for 2D canvas helpers
  if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      const rad = typeof r === "number" ? r : (Array.isArray(r) ? r[0] || 0 : 0);
      const rr = Math.min(rad, w * 0.5, h * 0.5);
      this.moveTo(x + rr, y);
      this.arcTo(x + w, y, x + w, y + h, rr);
      this.arcTo(x + w, y + h, x, y + h, rr);
      this.arcTo(x, y + h, x, y, rr);
      this.arcTo(x, y, x + w, y, rr);
      this.closePath();
      return this;
    };
  }

  // 8 Smiling Critters with full names, species traits, and high-contrast hull colors (every pair >= 20 ΔE76 apart & distinct from all stage waterColors)
  const CRITTERS = [
    { id: "catnap", name: "CatNap", emoji: "🐱", color: 0x6a1b9a, bodyColor: 0x8e24aa, boatTrim: 0xe1bee7, icon: "icons/catnap.jpg" },
    { id: "dogday", name: "DogDay", emoji: "🐶", color: 0xef6c00, bodyColor: 0xff8f00, boatTrim: 0xffe082, icon: "icons/dogday.jpg" },
    { id: "bobby", name: "Bobby BearHug", emoji: "🐻", color: 0xc62828, bodyColor: 0xd32f2f, boatTrim: 0xffcdd2, icon: "icons/bobby.jpg" },
    { id: "craftycorn", name: "CraftyCorn", emoji: "🦄", color: 0xfafafa, bodyColor: 0x00e5ff, boatTrim: 0xff80ab, icon: "icons/craftycorn.jpg" },
    { id: "hoppy", name: "Hoppy Hopscotch", emoji: "🐰", color: 0x2e7d32, bodyColor: 0x00c853, boatTrim: 0xb9f6ca, icon: "icons/hoppy.jpg" },
    { id: "kickin", name: "KickinChicken", emoji: "🐥", color: 0xfdd835, bodyColor: 0xffea00, boatTrim: 0xfff59d, icon: "icons/kickin.jpg" },
    { id: "picky", name: "PickyPiggy", emoji: "🐷", color: 0xf48fb1, bodyColor: 0xff4081, boatTrim: 0xfce4ec, icon: "icons/picky.jpg" },
    { id: "bubba", name: "Bubba Bubbaphant", emoji: "🐘", color: 0x1a237e, bodyColor: 0x3949ab, boatTrim: 0x90caf9, icon: "icons/bubba.jpg" }
  ];

  // 8 Distinct Lagoon Stages with unique themes, landmarks, islet styles, and stage-specific fish mixes & palettes
  const STAGES = [
    {
      id: 0, icon: "🌈", theme: "coral", waterColor: 0x00acc1, deepColor: 0x005b82, skyColor: 0x4dd0e1, sandColor: 0xffe082,
      targetScore: 900, aiRate: 11.2, fishCount: 18, jellyCount: 1,
      fishMix: ["whale", "chest", "rainbow", "goldfish", "starfish", "rainbow"],
      fishPalette: { rainbow: [0xff5252, 0x40c4ff, 0x69f0ae, 0xffab40], goldfish: [0xffd740, 0xff6e40], starfish: [0xffff00, 0xff4081], chest: [0xffb300], whale: [0xffd700] }
    },
    {
      id: 1, icon: "☀️", theme: "lighthouse", waterColor: 0x039be5, deepColor: 0x01497c, skyColor: 0x81d4fa, sandColor: 0xffd54f,
      targetScore: 1050, aiRate: 13.0, fishCount: 19, jellyCount: 2,
      fishMix: ["whale", "goldfish", "goldfish", "chest", "goldfish", "starfish"],
      fishPalette: { goldfish: [0xffd700, 0xff9100, 0xffab00], rainbow: [0xffca28, 0x29b6f6], starfish: [0xffe57f], chest: [0xffb300], whale: [0xffd700] }
    },
    {
      id: 2, icon: "🍭", theme: "candy", waterColor: 0x0097a7, deepColor: 0x4a148c, skyColor: 0xf48fb1, sandColor: 0xf8bbd0,
      targetScore: 1200, aiRate: 14.8, fishCount: 20, jellyCount: 2,
      fishMix: ["whale", "starfish", "starfish", "chest", "rainbow", "starfish"],
      fishPalette: { starfish: [0xff4081, 0xff80ab, 0xe040fb], rainbow: [0xff80ab, 0xba68c8, 0x80deea], goldfish: [0xf48fb1], chest: [0xf06292], whale: [0xff80ab] }
    },
    {
      id: 3, icon: "❄️", theme: "frost", waterColor: 0x0288d1, deepColor: 0x0d47a1, skyColor: 0xb3e5fc, sandColor: 0xe1f5fe,
      targetScore: 1350, aiRate: 16.5, fishCount: 21, jellyCount: 3,
      fishMix: ["whale", "whale", "chest", "rainbow", "starfish", "goldfish"],
      fishPalette: { whale: [0xe0f7fa, 0xb3e5fc], rainbow: [0x80d8ff, 0x40c4ff, 0xe1f5fe], goldfish: [0x84ffff], starfish: [0xb388ff], chest: [0x80deea] }
    },
    {
      id: 4, icon: "🌋", theme: "volcano", waterColor: 0x00796b, deepColor: 0x1b3a4b, skyColor: 0xffab91, sandColor: 0xd7ccc8,
      targetScore: 1500, aiRate: 18.2, fishCount: 22, jellyCount: 3,
      fishMix: ["whale", "chest", "chest", "goldfish", "rainbow", "starfish"],
      fishPalette: { chest: [0xff1744, 0xd50000], goldfish: [0xff3d00, 0xff9100], rainbow: [0xff6e40, 0xffab40], starfish: [0xffd740], whale: [0xff5252] }
    },
    {
      id: 5, icon: "🌸", theme: "blossom", waterColor: 0x00838f, deepColor: 0x004d40, skyColor: 0xfce4ec, sandColor: 0xfff9c4,
      targetScore: 1650, aiRate: 19.8, fishCount: 22, jellyCount: 4,
      fishMix: ["whale", "goldfish", "rainbow", "goldfish", "chest", "starfish"],
      fishPalette: { goldfish: [0xff5252, 0xffffff, 0xffb300], rainbow: [0xff80ab, 0xffffff, 0xff6e40], starfish: [0xf48fb1], chest: [0xffb300], whale: [0xf8bbd0] }
    },
    {
      id: 6, icon: "⚓", theme: "pirate", waterColor: 0x006064, deepColor: 0x002f3d, skyColor: 0x80deea, sandColor: 0xffe57f,
      targetScore: 1800, aiRate: 21.5, fishCount: 24, jellyCount: 4,
      fishMix: ["whale", "chest", "chest", "chest", "goldfish", "starfish"],
      fishPalette: { chest: [0xffd700, 0xffc400], goldfish: [0xffea00, 0x00e676], rainbow: [0x26a69a, 0xffca28], starfish: [0xffd740], whale: [0xffd700] }
    },
    {
      id: 7, icon: "👑", theme: "royal", waterColor: 0x0277bd, deepColor: 0x1a237e, skyColor: 0xffe082, sandColor: 0xffd740,
      targetScore: 2000, aiRate: 23.2, fishCount: 25, jellyCount: 5,
      fishMix: ["whale", "whale", "chest", "chest", "starfish", "goldfish"],
      fishPalette: { whale: [0xffd700, 0xffea00], chest: [0xffd700, 0xff1744], starfish: [0xffff00], goldfish: [0xffab00, 0xe040fb], rainbow: [0x00e5ff, 0xff4081] }
    }
  ];

  const FISH_TYPES = {
    rainbow: { kind: "rainbow", emoji: "🐟", points: 80, weight: 1.0, speed: 3.6, scale: 0.95 },
    goldfish: { kind: "goldfish", emoji: "🐠", points: 120, weight: 1.35, speed: 4.3, scale: 1.1 },
    starfish: { kind: "starfish", emoji: "⭐", points: 155, weight: 1.5, speed: 2.6, scale: 1.05 },
    chest: { kind: "chest", emoji: "🧰", points: 240, weight: 2.2, speed: 1.4, scale: 1.25 },
    whale: { kind: "whale", emoji: "🐋", points: 350, weight: 2.8, speed: 2.9, scale: 1.75 },
    jelly: { kind: "jelly", emoji: "🪼", points: -40, weight: 0.6, speed: 2.4, scale: 1.0 }
  };

  // CIELAB ΔE76 Color Contrast Verifier (enforces minPair >= 20)
  function hexToLab(hex) {
    let r = ((hex >> 16) & 255) / 255;
    let g = ((hex >> 8) & 255) / 255;
    let b = (hex & 255) / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const fx = f(x), fy = f(y), fz = f(z);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }

  function deltaE76(hexA, hexB) {
    const a = hexToLab(hexA);
    const b = hexToLab(hexB);
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }

  (function assertPaletteContrast() {
    let minPair = Infinity;
    let worstDesc = "";
    for (let i = 0; i < CRITTERS.length; i++) {
      for (let j = i + 1; j < CRITTERS.length; j++) {
        const d = deltaE76(CRITTERS[i].color, CRITTERS[j].color);
        if (d < minPair) {
          minPair = d;
          worstDesc = `hull ${CRITTERS[i].id} vs ${CRITTERS[j].id}`;
        }
      }
      for (let s = 0; s < STAGES.length; s++) {
        const d = deltaE76(CRITTERS[i].color, STAGES[s].waterColor);
        if (d < minPair) {
          minPair = d;
          worstDesc = `hull ${CRITTERS[i].id} vs stage ${s} water`;
        }
      }
    }
    if (minPair < 20) {
      console.error(`[CritterFishing3D] Palette contrast violation (< 20 ΔE76): ${minPair.toFixed(1)} on ${worstDesc}`);
    } else {
      console.info(`[CritterFishing3D] Palette contrast verified: min ΔE76 = ${minPair.toFixed(1)} (${worstDesc}) >= 20`);
    }
  })();

  const STORAGE_KEY = "critter_fishing3d_save_v1";

  function showWebGLFallback(reason) {
    const root = document.getElementById("game-root") || document.body;
    const card = document.createElement("div");
    card.className = "webgl-fallback-card";
    card.innerHTML = `<div>⛵ 🎣 🌈 🐋</div><div style="font-size:18px;opacity:0.9">${reason || "3D WebGL Unavailable"}</div>`;
    root.appendChild(card);
  }

  if (typeof window.THREE === "undefined") {
    showWebGLFallback("Three.js failed to load");
    return;
  }

  console.info(`[CritterFishing3D] Booting with THREE.REVISION = r${THREE.REVISION}`);

  function waveHeight(x, z, t) {
    const r = Math.hypot(x, z);
    if (r >= 16.5) return 0;
    const u = r / 16.5;
    const falloff = (1 - u * u) * (1 - u * u);
    return (Math.sin(x * 0.35 + t * 2.4) * 0.13 + Math.cos(z * 0.42 + t * 1.9) * 0.11) * falloff;
  }

  // Lazy Web Audio Synthesizer
  const SFX = {
    ctx: null,
    muted: false,
    ensure() {
      if (this.muted) return null;
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    },
    tone(freq, dur, type, vol, slideTo) {
      const ctx = this.ensure();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq, now);
        if (slideTo) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), now + dur);
        }
        gain.gain.setValueAtTime(vol || 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur);
      } catch (e) {}
    },
    cast() { this.tone(360, 0.18, "sine", 0.14, 780); },
    splash() { this.tone(240, 0.14, "triangle", 0.12, 110); },
    bite() { this.tone(520, 0.11, "triangle", 0.14, 880); },
    tug() { this.tone(290, 0.07, "triangle", 0.08, 410); },
    coinTick(step) {
      const idx = typeof step === "number" ? Math.max(0, Math.min(5, step)) : 0;
      const base = Math.round(880 * Math.pow(1.065, idx));
      this.tone(base, 0.06, "sine", 0.09, Math.round(base * 1.48));
    },
    catchFish(isBig) {
      const notes = isBig ? [523, 659, 784, 1046] : [523, 659, 784];
      notes.forEach((n, i) => setTimeout(() => this.tone(n, 0.14, "triangle", 0.14, Math.round(n * 1.06)), i * 55));
    },
    zap() { this.tone(190, 0.25, "sawtooth", 0.12, 85); },
    shockHit() { this.tone(280, 0.14, "sawtooth", 0.12, 95); },
    feverChime() {
      const notes = [523, 659, 784, 988, 1318];
      notes.forEach((n, i) => setTimeout(() => this.tone(n, 0.15, "triangle", 0.14, Math.round(n * 1.15)), i * 50));
    },
    pedal(idx) {
      if (idx === 0) this.tone(320, 0.28, "sine", 0.15, 680);
      else if (idx === 1) this.tone(440, 0.26, "triangle", 0.16, 960);
      else this.tone(160, 0.32, "sawtooth", 0.16, 520);
    },
    fanfare(win) {
      if (win) {
        const seq = [523, 659, 784, 1046];
        seq.forEach((n, i) => setTimeout(() => this.tone(n, 0.22, "triangle", 0.15, Math.round(n * 1.04)), i * 90));
      } else {
        const trombone = [
          { f: 392, to: 370, d: 0.22, delay: 0 },
          { f: 370, to: 349, d: 0.22, delay: 210 },
          { f: 349, to: 330, d: 0.24, delay: 420 },
          { f: 311, to: 196, d: 0.52, delay: 650 }
        ];
        trombone.forEach((n) => setTimeout(() => this.tone(n.f, n.d, "sawtooth", 0.13, n.to), n.delay));
      }
    }
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.unlockedStage === "number") {
          return {
            unlockedStage: Math.max(0, Math.min(7, parsed.unlockedStage)),
            stars: Array.isArray(parsed.stars) && parsed.stars.length === 8 ? parsed.stars : [0, 0, 0, 0, 0, 0, 0, 0],
            selectedCritter: typeof parsed.selectedCritter === "number" ? parsed.selectedCritter : 0
          };
        }
      }
    } catch (e) {}
    return { unlockedStage: 0, stars: [0, 0, 0, 0, 0, 0, 0, 0], selectedCritter: 0 };
  }

  function saveProgress(prog) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
    } catch (e) {}
  }

  const progress = loadProgress();

  const state = {
    mode: "menu",
    stageIndex: 0,
    critterIndex: progress.selectedCritter || 0,
    unlockedStage: progress.unlockedStage || 0,
    stageStars: progress.stars.slice(),
    timeLeft: 60,
    duration: 60,
    fever: 0,
    feverTimer: 0,
    combo: 1,
    comboTimer: 0,
    trauma: 0,
    shakePhase: 0,
    camKick: new THREE.Vector3(),
    camKickVel: new THREE.Vector3(),
    shockWaveId: 0,
    shockOrigin: new THREE.Vector3(0, 0.2, 12.6),
    shockRadius: 0,
    aimX: 0,
    aimZ: 1.5,
    keys: { left: false, right: false, up: false, down: false },
    pedals: [
      { id: "whirlpool", cd: 0, maxCd: 7.0, activeTimer: 0 },
      { id: "net", cd: 0, maxCd: 8.5, activeTimer: 0 },
      { id: "shock", cd: 0, maxCd: 9.0, activeTimer: 0 }
    ],
    racers: [],
    fishes: [],
    lastRank: 1,
    lastStars: 3,
    assetsReady: false
  };

  // Trauma Camera Shake Adder (frame-rate independent smooth multi-sine rotation + directional spring kick)
  function addTrauma(amount, kickX, kickZ) {
    state.trauma = Math.min(1.0, state.trauma + amount);
    state.shakePhase = (state.shakePhase + 1.37) % (Math.PI * 2);
    if (kickX || kickZ) {
      state.camKickVel.x += (kickX || 0) * 6.5;
      state.camKickVel.z += (kickZ || 0) * 6.5;
      state.camKickVel.y += Math.hypot(kickX || 0, kickZ || 0) * 3.5;
    }
  }

  // DOM Elements
  const canvas = document.getElementById("webgl-canvas");
  const fxLayer = document.getElementById("fx-layer");
  const topHudEl = document.getElementById("top-hud");
  const bottomCockpitEl = document.getElementById("bottom-cockpit");
  const hudCritterAvatar = document.getElementById("hud-critter-avatar");
  const hudStageIcon = document.getElementById("hud-stage-icon");
  const stageDotsEl = document.getElementById("stage-dots");
  const leaderboardEl = document.getElementById("race-leaderboard");
  const timerFillEl = document.getElementById("timer-fill");
  const timerNumEl = document.getElementById("timer-num");
  const stageRailEl = document.getElementById("stage-rail");
  const scoreFillEl = document.getElementById("score-fill");
  const playerScoreNumEl = document.getElementById("player-score-num");
  const feverFillEl = document.getElementById("fever-fill");
  const comboBadgeEl = document.getElementById("combo-badge");
  const castBtnEl = document.getElementById("btn-cast-reel");
  const castIconEl = document.getElementById("cast-icon");
  const overlayMenu = document.getElementById("overlay-menu");
  const overlayPodium = document.getElementById("overlay-podium");
  const critterPickerEl = document.getElementById("critter-picker");
  const stagePickerEl = document.getElementById("stage-picker");
  const podiumMedalEl = document.getElementById("podium-rank-medal");
  const podiumStarsEl = document.getElementById("podium-stars");
  const podiumStandingsEl = document.getElementById("podium-standings");
  const btnNextStage = document.getElementById("btn-next-stage");
  const btnPlay = document.getElementById("btn-play");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  } catch (err) {
    showWebGLFallback("WebGL Renderer Error");
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x4dd0e1);
  scene.fog = new THREE.Fog(0x4dd0e1, 52, 135);

  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.5, 220);
  const baseCamPos = new THREE.Vector3(0, 18, 25);
  const baseCamLook = new THREE.Vector3(0, 0.6, 2.2);

  const CONTENT_BOX_CORNERS = [
    new THREE.Vector3(-14.6, 0.0, -9.2),
    new THREE.Vector3(14.6, 0.0, -9.2),
    new THREE.Vector3(-14.6, 4.4, -9.2),
    new THREE.Vector3(14.6, 4.4, -9.2),
    new THREE.Vector3(-13.8, 0.0, 14.8),
    new THREE.Vector3(13.8, 0.0, 14.8),
    new THREE.Vector3(-13.8, 4.4, 14.8),
    new THREE.Vector3(13.8, 4.4, 14.8)
  ];
  const projTmp = new THREE.Vector3();
  const worldPosTmp = new THREE.Vector3();

  function orientBillboards() {
    const vh = Math.max(1, window.innerHeight);
    const vw = Math.max(1, window.innerWidth);
    const focalPx = (vh * 0.5) / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    const isCompact = vw <= 860 || vh <= 520;
    const targetPx = isCompact ? 32 : 48;

    for (let i = 0; i < state.racers.length; i++) {
      const r = state.racers[i];
      if (!r || !r.medallionGroup) continue;
      r.medallionGroup.getWorldPosition(worldPosTmp);
      const distToCam = camera.position.distanceTo(worldPosTmp);
      const baseScale = THREE.MathUtils.clamp((targetPx * distToCam) / (focalPx * 1.64), 1.0, 2.35);
      const finalScale = baseScale * (r.isPlayer ? 1.16 : 1.0);
      r.medallionGroup.scale.setScalar(finalScale);
      r.medallionGroup.lookAt(camera.position);
    }
  }

  function fitCamera() {
    const vw = Math.max(1, window.innerWidth);
    const vh = Math.max(1, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(vw, vh);

    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();

    const topHudH = (topHudEl && topHudEl.offsetHeight) ? topHudEl.offsetHeight + 8 : (vh <= 520 ? 46 : 62);
    const botHudH = (bottomCockpitEl && bottomCockpitEl.offsetHeight) ? bottomCockpitEl.offsetHeight + 10 : (vh <= 520 ? 60 : 78);
    const leftRailW = vw > 860 ? 52 : 6;
    const rightPadW = 6;

    const maxNdcX = (1 - (2 * Math.max(leftRailW, rightPadW)) / vw) * 0.94;
    const maxNdcYTop = (1 - (2 * topHudH) / vh) * 0.93;
    const minNdcYBot = (-1 + (2 * botHudH) / vh) * 0.93;

    const pitch = 0.62;
    const vFovRad = THREE.MathUtils.degToRad(camera.fov);
    const tanHalfV = Math.tan(vFovRad * 0.5);

    let lo = 17.0;
    let hi = 62.0;
    for (let iter = 0; iter < 20; iter++) {
      const mid = (lo + hi) * 0.5;
      const shiftZ = ((botHudH - topHudH) / vh) * mid * tanHalfV * 0.85;
      baseCamLook.set(0, 0.55, 1.8 + shiftZ);
      baseCamPos.set(0, baseCamLook.y + Math.sin(pitch) * mid, baseCamLook.z + Math.cos(pitch) * mid);
      camera.position.copy(baseCamPos);
      camera.lookAt(baseCamLook);
      camera.updateMatrixWorld(true);

      let fits = true;
      for (let c = 0; c < CONTENT_BOX_CORNERS.length; c++) {
        projTmp.copy(CONTENT_BOX_CORNERS[c]).project(camera);
        if (Math.abs(projTmp.x) > maxNdcX || projTmp.y > maxNdcYTop || projTmp.y < minNdcYBot) {
          fits = false;
          break;
        }
      }
      if (fits) hi = mid;
      else lo = mid;
    }

    const finalDist = hi;
    const shiftZ = ((botHudH - topHudH) / vh) * finalDist * tanHalfV * 0.85;
    baseCamLook.set(0, 0.55, 1.8 + shiftZ);
    baseCamPos.set(0, baseCamLook.y + Math.sin(pitch) * finalDist, baseCamLook.z + Math.cos(pitch) * finalDist);
    camera.position.copy(baseCamPos);
    camera.lookAt(baseCamLook);
    camera.updateMatrixWorld(true);
    orientBillboards();
  }

  function buildStudioEnvironment() {
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x29b6f6);
    const skyGeo = new THREE.SphereGeometry(20, 16, 12);
    const skyMat = new THREE.MeshBasicMaterial({ color: 0x81d4fa, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(skyGeo, skyMat));

    const sunGeo = new THREE.PlaneGeometry(14, 14);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const sunPanel = new THREE.Mesh(sunGeo, sunMat);
    sunPanel.position.set(8, 14, 10);
    sunPanel.lookAt(0, 0, 0);
    envScene.add(sunPanel);

    const warmMat = new THREE.MeshBasicMaterial({ color: 0xffe082, side: THREE.DoubleSide });
    const warmPanel = new THREE.Mesh(sunGeo, warmMat);
    warmPanel.position.set(-10, 9, -8);
    warmPanel.lookAt(0, 0, 0);
    envScene.add(warmPanel);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    skyGeo.dispose();
    skyMat.dispose();
    sunGeo.dispose();
    sunMat.dispose();
    warmMat.dispose();
    pmrem.dispose();
  }
  buildStudioEnvironment();

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0277bd, 1.35);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff8e1, 2.8);
  sunLight.position.set(14, 28, 18);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.left = -22;
  sunLight.shadow.camera.right = 22;
  sunLight.shadow.camera.top = 18;
  sunLight.shadow.camera.bottom = -18;
  sunLight.shadow.camera.near = 5;
  sunLight.shadow.camera.far = 70;
  sunLight.shadow.bias = -0.0004;
  sunLight.shadow.normalBias = 0.03;
  scene.add(sunLight);

  const lurePointLight = new THREE.PointLight(0xfff8e1, 1.2, 5.5, 2.0);
  lurePointLight.position.set(0, 1.0, 1.5);
  scene.add(lurePointLight);

  function createFallbackPortraitTexture(critter) {
    const cnv = document.createElement("canvas");
    cnv.width = 128;
    cnv.height = 128;
    const ctx = cnv.getContext("2d");
    const hex = "#" + critter.bodyColor.toString(16).padStart(6, "0");
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.arc(64, 64, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.font = "68px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(critter.emoji, 64, 68);
    const tex = new THREE.CanvasTexture(cnv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const critterTextures = {};
  const fallbackTextures = {};
  CRITTERS.forEach((c) => {
    fallbackTextures[c.id] = createFallbackPortraitTexture(c);
    critterTextures[c.id] = fallbackTextures[c.id];
  });

  const loadingManager = new THREE.LoadingManager();
  if (btnPlay) btnPlay.disabled = true;
  loadingManager.onLoad = function () {
    state.assetsReady = true;
    if (btnPlay) btnPlay.disabled = false;
  };
  loadingManager.onError = function (url) {
    console.warn(`[CritterFishing3D] Asset fallback active for: ${url}`);
    if (btnPlay) btnPlay.disabled = false;
  };

  const textureLoader = new THREE.TextureLoader(loadingManager);
  CRITTERS.forEach((c) => {
    textureLoader.load(
      c.icon,
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.magFilter = THREE.LinearFilter;
        critterTextures[c.id] = loadedTex;
        state.racers.forEach((r) => {
          if (r.critter.id === c.id && r.portraitMat) {
            r.portraitMat.map = loadedTex;
            r.portraitMat.needsUpdate = true;
          }
        });
      },
      undefined,
      () => {
        critterTextures[c.id] = fallbackTextures[c.id];
      }
    );
  });

  // Build 5-Point Star ExtrudeGeometry for Flying Star Coins
  function createStarCoinGeometry() {
    const shape = new THREE.Shape();
    const spikes = 5;
    const outerR = 0.44;
    const innerR = 0.20;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI * 0.5;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelSegments: 2
    });
    geo.center();
    return geo;
  }

  // Shared Geometries & Materials
  const SHARED = {
    hullGeo: new THREE.CylinderGeometry(1.55, 1.15, 0.95, 18),
    innerBowlGeo: new THREE.CylinderGeometry(1.22, 0.95, 0.55, 16),
    gunwaleGeo: new THREE.TorusGeometry(1.38, 0.12, 8, 24),
    seatGeo: new THREE.BoxGeometry(1.4, 0.35, 0.65),
    critterBodyGeo: new THREE.SphereGeometry(0.68, 16, 14),
    critterEarGeo: new THREE.ConeGeometry(0.24, 0.48, 10),
    bunnyEarGeo: new THREE.CylinderGeometry(0.14, 0.18, 0.82, 10),
    roundEarGeo: new THREE.SphereGeometry(0.26, 10, 10),
    discEarGeo: new THREE.CylinderGeometry(0.38, 0.38, 0.1, 12),
    snoutGeo: new THREE.CylinderGeometry(0.24, 0.26, 0.22, 12),
    hornGeo: new THREE.ConeGeometry(0.16, 0.62, 10),
    beakGeo: new THREE.ConeGeometry(0.2, 0.42, 8),
    trunkArcGeo: new THREE.TorusGeometry(0.32, 0.11, 8, 14, Math.PI * 0.85),
    smileArcGeo: new THREE.TorusGeometry(0.26, 0.048, 8, 16, Math.PI),
    moonCharmGeo: new THREE.TorusGeometry(0.18, 0.05, 8, 14, Math.PI * 1.3),
    medallionRingGeo: new THREE.TorusGeometry(0.88, 0.11, 10, 24),
    medallionFaceGeo: new THREE.CircleGeometry(0.82, 24),
    rodGeo: new THREE.CylinderGeometry(0.04, 0.09, 3.2, 8),
    bobberSphereGeo: new THREE.SphereGeometry(0.38, 14, 12),
    bobberTopGeo: new THREE.ConeGeometry(0.22, 0.45, 10),
    aimRingGeo: new THREE.RingGeometry(0.75, 1.12, 28),
    aimInnerGeo: new THREE.RingGeometry(0.22, 0.36, 20),
    fishBodyGeo: new THREE.SphereGeometry(0.62, 14, 12),
    fishTailGeo: new THREE.ConeGeometry(0.48, 0.68, 8),
    finGeo: new THREE.ConeGeometry(0.24, 0.42, 6),
    eyeWhiteGeo: new THREE.SphereGeometry(0.13, 8, 8),
    eyePupilGeo: new THREE.SphereGeometry(0.07, 8, 8),
    starArmGeo: new THREE.ConeGeometry(0.32, 0.78, 6),
    chestBaseGeo: new THREE.BoxGeometry(0.95, 0.68, 0.72),
    chestLidGeo: new THREE.CylinderGeometry(0.36, 0.36, 0.95, 12),
    jellyDomeGeo: new THREE.SphereGeometry(0.58, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62),
    jellyTentacleGeo: new THREE.CylinderGeometry(0.04, 0.02, 0.75, 6),
    splashRingGeo: new THREE.RingGeometry(0.45, 0.68, 24),
    starCoinGeo: createStarCoinGeometry(),
    particleGeo: new THREE.OctahedronGeometry(0.16, 0),
    whirlpoolRingGeo: new THREE.TorusGeometry(2.4, 0.14, 10, 32),
    netDiskGeo: new THREE.RingGeometry(0.4, 3.2, 24),
    shockRingGeo: new THREE.RingGeometry(0.6, 1.25, 48),
    islandConeGeo: new THREE.CylinderGeometry(1.8, 3.2, 1.6, 16),
    palmTrunkGeo: new THREE.CylinderGeometry(0.18, 0.28, 2.6, 8),
    palmLeafGeo: new THREE.ConeGeometry(1.1, 0.45, 6),
    torusArchGeo: new THREE.TorusGeometry(6.5, 0.55, 12, 32, Math.PI),
    pillarGeo: new THREE.CylinderGeometry(0.42, 0.52, 4.2, 12),
    lollipopDiscGeo: new THREE.CylinderGeometry(1.15, 1.15, 0.32, 18),
    volcanoConeGeo: new THREE.ConeGeometry(4.4, 6.2, 18),
    crownBandGeo: new THREE.CylinderGeometry(3.2, 2.8, 1.4, 18, 1, true),
    sailGeo: new THREE.BoxGeometry(3.4, 2.5, 0.16),
    crystalGeo: new THREE.OctahedronGeometry(1.45, 0),
    lotusPadGeo: new THREE.CylinderGeometry(1.55, 1.55, 0.16, 18),
    blobShadowGeo: new THREE.CircleGeometry(0.95, 18)
  };

  // Water VFX Materials use depthTest: true, depthWrite: false, polygonOffset: true so they sit ON the water and NEVER draw over boats, critters, or medallions!
  const MATS = {
    white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 }),
    pupil: new THREE.MeshBasicMaterial({ color: 0x111111 }),
    smileBlack: new THREE.MeshBasicMaterial({ color: 0x1a091e }),
    navyGunwale: new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.3, metalness: 0.3 }),
    goldMetal: new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.18, metalness: 0.85, emissive: 0x442b00 }),
    rubyRed: new THREE.MeshStandardMaterial({ color: 0xff1744, roughness: 0.2, metalness: 0.5, emissive: 0x440011 }),
    orangeBeak: new THREE.MeshStandardMaterial({ color: 0xff6d00, roughness: 0.3 }),
    pinkSnout: new THREE.MeshStandardMaterial({ color: 0xff80ab, roughness: 0.35 }),
    chestWood: new THREE.MeshStandardMaterial({ color: 0x8d4e24, roughness: 0.5, metalness: 0.2 }),
    charredWood: new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 }),
    rodCarbon: new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.3, metalness: 0.6 }),
    bobberRed: new THREE.MeshStandardMaterial({ color: 0xff1744, roughness: 0.2, emissive: 0x550011 }),
    bobberGold: new THREE.MeshStandardMaterial({ color: 0xffea00, roughness: 0.2, metalness: 0.7, emissive: 0x665500 }),
    jellyMat: new THREE.MeshStandardMaterial({ color: 0xe040fb, emissive: 0x6a1b9a, roughness: 0.2, transparent: true, opacity: 0.86 }),
    palmTrunk: new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 }),
    palmLeaf: new THREE.MeshStandardMaterial({ color: 0x00c853, roughness: 0.45 }),
    sakuraLeaf: new THREE.MeshStandardMaterial({ color: 0xff80ab, roughness: 0.4 }),
    aimRingMat: new THREE.MeshBasicMaterial({
      color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.88,
      depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false
    }),
    aimInnerMat: new THREE.MeshBasicMaterial({
      color: 0xffea00, side: THREE.DoubleSide, transparent: true, opacity: 0.95,
      depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false
    }),
    blobShadowMat: new THREE.MeshBasicMaterial({ color: 0x011627, transparent: true, opacity: 0.36, depthWrite: false })
  };

  // Seamless World Architecture
  const skyDomeGeo = new THREE.SphereGeometry(175, 24, 16);
  const skyDomeMat = new THREE.MeshBasicMaterial({ color: 0x4dd0e1, side: THREE.BackSide });
  scene.add(new THREE.Mesh(skyDomeGeo, skyDomeMat));

  const outerOceanGeo = new THREE.CircleGeometry(165, 48);
  outerOceanGeo.rotateX(-Math.PI / 2);
  const outerOceanMat = new THREE.MeshStandardMaterial({ color: 0x005b82, roughness: 0.32, metalness: 0.22 });
  const outerOceanMesh = new THREE.Mesh(outerOceanGeo, outerOceanMat);
  outerOceanMesh.position.y = -0.14;
  outerOceanMesh.receiveShadow = true;
  scene.add(outerOceanMesh);

  const waterGeo = new THREE.RingGeometry(0.01, 18.8, 96, 28);
  waterGeo.rotateX(-Math.PI / 2);
  const waterBasePos = waterGeo.attributes.position.array.slice();
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x00acc1,
    roughness: 0.22,
    metalness: 0.28
  });
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.y = 0;
  waterMesh.receiveShadow = true;
  scene.add(waterMesh);

  const shoreGeo = new THREE.CylinderGeometry(24.5, 27.5, 0.56, 48, 1, true);
  const shoreTopGeo = new THREE.RingGeometry(16.8, 24.8, 48);
  shoreTopGeo.rotateX(-Math.PI / 2);
  const shoreMat = new THREE.MeshStandardMaterial({ color: 0xffe082, roughness: 0.78, metalness: 0.05, side: THREE.DoubleSide });
  const shoreMesh = new THREE.Mesh(shoreTopGeo, shoreMat);
  shoreMesh.position.y = 0.28;
  shoreMesh.receiveShadow = true;
  scene.add(shoreMesh);

  const shoreSlopeMesh = new THREE.Mesh(shoreGeo, shoreMat);
  shoreSlopeMesh.position.y = 0.0;
  shoreSlopeMesh.receiveShadow = true;
  scene.add(shoreSlopeMesh);

  const BOAT_SLOTS = [
    { x: 0, z: 12.6, rotY: Math.PI },
    { x: -12.6, z: 4.5, rotY: Math.PI * 0.62 },
    { x: -9.8, z: -6.4, rotY: Math.PI * 0.25 },
    { x: 9.8, z: -6.4, rotY: -Math.PI * 0.25 },
    { x: 12.6, z: 4.5, rotY: -Math.PI * 0.62 }
  ];

  function isClearOfBoats(x, z, propRadius) {
    const minSep = 2.6 + (propRadius || 1.0);
    for (let i = 0; i < BOAT_SLOTS.length; i++) {
      const d = Math.hypot(x - BOAT_SLOTS[i].x, z - BOAT_SLOTS[i].z);
      if (d < minSep) return false;
    }
    return true;
  }

  const stagePropsGroup = new THREE.Group();
  scene.add(stagePropsGroup);
  let stageCustomDisposables = [];

  function enableShadowsRecursive(obj, cast, receive) {
    obj.traverse((child) => {
      if (child.isMesh) {
        if (cast !== undefined) child.castShadow = cast;
        if (receive !== undefined) child.receiveShadow = receive;
      }
    });
  }

  function clearStageProps() {
    while (stagePropsGroup.children.length > 0) {
      stagePropsGroup.remove(stagePropsGroup.children[0]);
    }
    stageCustomDisposables.forEach((d) => {
      if (d && typeof d.dispose === "function") d.dispose();
    });
    stageCustomDisposables = [];
  }

  function buildStageScenery(stage) {
    clearStageProps();
    waterMat.color.setHex(stage.waterColor);
    outerOceanMat.color.setHex(stage.deepColor);
    shoreMat.color.setHex(stage.sandColor);
    skyDomeMat.color.setHex(stage.skyColor);
    scene.background.setHex(stage.skyColor);
    scene.fog.color.setHex(stage.skyColor);

    const isletCoords = [
      [-17.8, -11.5],
      [17.8, -11.5],
      [-19.6, 8.8],
      [19.6, 8.8]
    ];

    const iceMat = new THREE.MeshStandardMaterial({ color: 0x80d8ff, roughness: 0.1, metalness: 0.75, emissive: 0x004d73 });
    const candyPinkMat = new THREE.MeshStandardMaterial({ color: 0xff4081, roughness: 0.2, emissive: 0x440022 });
    const candyCyanMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.2, emissive: 0x003344 });
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff3d00, emissive: 0xdd2c00, roughness: 0.4 });
    stageCustomDisposables.push(iceMat, candyPinkMat, candyCyanMat, lavaMat);

    isletCoords.forEach(([ix, iz], idx) => {
      const islet = new THREE.Mesh(SHARED.islandConeGeo, shoreMat);
      islet.position.set(ix, 0.75, iz);
      islet.castShadow = true;
      islet.receiveShadow = true;
      stagePropsGroup.add(islet);

      if (stage.theme === "frost") {
        for (let c = 0; c < 3; c++) {
          const spire = new THREE.Mesh(SHARED.crystalGeo, iceMat);
          spire.scale.set(0.75, 1.8 - c * 0.3, 0.75);
          spire.position.set(ix + (c - 1) * 0.7, 2.2, iz + (c % 2) * 0.4);
          spire.castShadow = true;
          stagePropsGroup.add(spire);
        }
      } else if (stage.theme === "candy") {
        const stick = new THREE.Mesh(SHARED.palmTrunkGeo, MATS.white);
        stick.position.set(ix, 2.3, iz);
        stick.castShadow = true;
        const disc = new THREE.Mesh(SHARED.lollipopDiscGeo, idx % 2 === 0 ? candyPinkMat : candyCyanMat);
        disc.rotation.x = Math.PI / 2;
        disc.position.set(ix, 3.8, iz);
        disc.castShadow = true;
        stagePropsGroup.add(stick, disc);
      } else if (stage.theme === "volcano") {
        const torch = new THREE.Mesh(SHARED.palmTrunkGeo, MATS.charredWood);
        torch.position.set(ix, 2.3, iz);
        torch.castShadow = true;
        const flame = new THREE.Mesh(SHARED.crystalGeo, lavaMat);
        flame.scale.set(0.65, 0.95, 0.65);
        flame.position.set(ix, 3.9, iz);
        stagePropsGroup.add(torch, flame);
      } else if (stage.theme === "royal") {
        const obelisk = new THREE.Mesh(SHARED.pillarGeo, MATS.goldMetal);
        obelisk.scale.set(0.85, 0.9, 0.85);
        obelisk.position.set(ix, 2.5, iz);
        obelisk.castShadow = true;
        const gem = new THREE.Mesh(SHARED.crystalGeo, MATS.rubyRed);
        gem.scale.set(0.55, 0.55, 0.55);
        gem.position.set(ix, 4.8, iz);
        stagePropsGroup.add(obelisk, gem);
      } else {
        const trunk = new THREE.Mesh(SHARED.palmTrunkGeo, MATS.palmTrunk);
        trunk.position.set(ix, 2.35, iz);
        trunk.castShadow = true;
        stagePropsGroup.add(trunk);
        const leafMat = stage.theme === "blossom" ? MATS.sakuraLeaf : MATS.palmLeaf;
        for (let f = 0; f < 4; f++) {
          const frond = new THREE.Mesh(SHARED.palmLeafGeo, leafMat);
          frond.position.set(ix + Math.cos((f * Math.PI) / 2) * 0.75, 3.65, iz + Math.sin((f * Math.PI) / 2) * 0.75);
          frond.rotation.z = 0.35;
          frond.rotation.y = (f * Math.PI) / 2;
          frond.castShadow = true;
          stagePropsGroup.add(frond);
        }
      }
    });

    if (stage.theme === "coral") {
      const archColors = [0xff4081, 0xffeb3b, 0x00e676, 0x00e5ff];
      archColors.forEach((col, i) => {
        const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.25, metalness: 0.4, emissive: col, emissiveIntensity: 0.22 });
        stageCustomDisposables.push(mat);
        const arch = new THREE.Mesh(SHARED.torusArchGeo, mat);
        arch.position.set(0, 0.4 + i * 0.42, -13.4 - i * 0.25);
        arch.castShadow = true;
        stagePropsGroup.add(arch);
      });
    } else if (stage.theme === "lighthouse") {
      const redStripeMat = new THREE.MeshStandardMaterial({ color: 0xff5252, roughness: 0.3 });
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffff00, toneMapped: false });
      stageCustomDisposables.push(redStripeMat, beaconMat);
      for (let seg = 0; seg < 4; seg++) {
        const segMesh = new THREE.Mesh(SHARED.islandConeGeo, seg % 2 === 0 ? redStripeMat : MATS.white);
        const sc = 0.85 - seg * 0.14;
        segMesh.scale.set(sc, 1.05, sc);
        segMesh.position.set(0, 1.1 + seg * 1.45, -13.8);
        segMesh.castShadow = true;
        stagePropsGroup.add(segMesh);
      }
      const beacon = new THREE.Mesh(SHARED.crystalGeo, beaconMat);
      beacon.position.set(0, 7.2, -13.8);
      stagePropsGroup.add(beacon);
    } else if (stage.theme === "candy") {
      const candyMats = [candyPinkMat, candyCyanMat, MATS.goldMetal];
      for (let i = 0; i < 6; i++) {
        const px = (i - 2.5) * 3.1;
        const pz = -12.6 - Math.abs(i - 2.5) * 0.45;
        if (!isClearOfBoats(px, pz, 1.2)) continue;
        const stick = new THREE.Mesh(SHARED.pillarGeo, MATS.white);
        stick.scale.set(0.45, 0.85, 0.45);
        stick.position.set(px, 1.9, pz);
        stick.castShadow = true;
        const swirl = new THREE.Mesh(SHARED.lollipopDiscGeo, candyMats[i % candyMats.length]);
        swirl.rotation.x = Math.PI / 2;
        swirl.position.set(px, 3.8, pz);
        swirl.castShadow = true;
        stagePropsGroup.add(stick, swirl);
      }
    } else if (stage.theme === "frost") {
      for (let i = 0; i < 7; i++) {
        const px = (i - 3) * 3.6;
        const pz = -13.0 - (i % 2) * 1.2;
        if (!isClearOfBoats(px, pz, 1.4)) continue;
        const crystal = new THREE.Mesh(SHARED.crystalGeo, iceMat);
        crystal.scale.set(1.2, 2.5 + (i % 3) * 0.65, 1.2);
        crystal.position.set(px, 2.2, pz);
        crystal.castShadow = true;
        stagePropsGroup.add(crystal);
      }
    } else if (stage.theme === "volcano") {
      const volcano = new THREE.Mesh(SHARED.volcanoConeGeo, MATS.charredWood);
      volcano.position.set(0, 2.8, -14.8);
      volcano.castShadow = true;
      stagePropsGroup.add(volcano);

      const crater = new THREE.Mesh(SHARED.medallionRingGeo, lavaMat);
      crater.rotation.x = Math.PI / 2;
      crater.scale.set(1.8, 1.8, 1.8);
      crater.position.set(0, 5.6, -14.8);
      stagePropsGroup.add(crater);

      for (let e = -2; e <= 2; e++) {
        const ember = new THREE.Mesh(SHARED.crystalGeo, lavaMat);
        ember.scale.set(0.55, 0.55, 0.55);
        ember.position.set(e * 3.2, 3.6 + Math.abs(e) * 0.6, -13.4);
        stagePropsGroup.add(ember);
      }
    } else if (stage.theme === "blossom") {
      const padMat = new THREE.MeshStandardMaterial({ color: 0x69f0ae, roughness: 0.5 });
      const flowerMat = new THREE.MeshStandardMaterial({ color: 0xff80ab, emissive: 0x880e4f, emissiveIntensity: 0.25 });
      stageCustomDisposables.push(padMat, flowerMat);
      const padCoords = [
        [-14.6, -2.2],
        [14.6, -2.2],
        [-5.8, -11.4],
        [5.8, -11.4],
        [0, -12.6]
      ];
      padCoords.forEach(([px, pz]) => {
        if (!isClearOfBoats(px, pz, 1.6)) return;
        const pad = new THREE.Mesh(SHARED.lotusPadGeo, padMat);
        pad.position.set(px, 0.36, pz);
        pad.receiveShadow = true;
        stagePropsGroup.add(pad);
        const bloom = new THREE.Mesh(SHARED.crystalGeo, flowerMat);
        bloom.scale.set(0.55, 0.45, 0.55);
        bloom.position.set(px, 0.72, pz);
        bloom.castShadow = true;
        stagePropsGroup.add(bloom);
      });
    } else if (stage.theme === "pirate") {
      const galleonGroup = new THREE.Group();
      galleonGroup.position.set(0, 0.8, -13.8);
      galleonGroup.rotation.z = 0.08;

      const mainDeck = new THREE.Mesh(SHARED.chestBaseGeo, MATS.chestWood);
      mainDeck.scale.set(7.5, 2.2, 2.6);
      galleonGroup.add(mainDeck);

      const sternCabin = new THREE.Mesh(SHARED.chestBaseGeo, MATS.chestWood);
      sternCabin.scale.set(2.6, 3.2, 2.4);
      sternCabin.position.set(-2.4, 0.8, 0);
      galleonGroup.add(sternCabin);

      [-1.4, 1.6].forEach((mx) => {
        const mast = new THREE.Mesh(SHARED.rodGeo, MATS.palmTrunk);
        mast.scale.set(2.2, 2.1, 2.2);
        mast.position.set(mx, 3.8, 0);
        const sail = new THREE.Mesh(SHARED.sailGeo, MATS.white);
        sail.position.set(mx, 4.2, 0.25);
        sail.rotation.y = 0.12;
        galleonGroup.add(mast, sail);
      });

      enableShadowsRecursive(galleonGroup, true, true);
      stagePropsGroup.add(galleonGroup);
    } else if (stage.theme === "royal") {
      const crownGroup = new THREE.Group();
      crownGroup.position.set(0, 1.2, -13.6);

      const band = new THREE.Mesh(SHARED.crownBandGeo, MATS.goldMetal);
      crownGroup.add(band);

      for (let s = 0; s < 7; s++) {
        const ang = (s / 7) * Math.PI * 2;
        const sx = Math.cos(ang) * 2.95;
        const sz = Math.sin(ang) * 2.95;
        const spike = new THREE.Mesh(SHARED.hornGeo, MATS.goldMetal);
        spike.scale.set(2.8, 3.2, 2.8);
        spike.position.set(sx, 1.5, sz);
        const jewel = new THREE.Mesh(SHARED.bobberSphereGeo, s % 2 === 0 ? MATS.rubyRed : candyCyanMat);
        jewel.scale.set(0.85, 0.85, 0.85);
        jewel.position.set(sx, 2.6, sz);
        crownGroup.add(spike, jewel);
      }
      enableShadowsRecursive(crownGroup, true, true);
      stagePropsGroup.add(crownGroup);
    }
  }

  // Player Targeting Reticle on Water (depthTest: true, depthWrite: false, polygonOffset)
  const aimReticleGroup = new THREE.Group();
  const aimOuterMesh = new THREE.Mesh(SHARED.aimRingGeo, MATS.aimRingMat);
  aimOuterMesh.rotation.x = -Math.PI / 2;
  const aimInnerMesh = new THREE.Mesh(SHARED.aimInnerGeo, MATS.aimInnerMat);
  aimInnerMesh.rotation.x = -Math.PI / 2;
  aimReticleGroup.add(aimOuterMesh, aimInnerMesh);
  aimReticleGroup.position.set(0, 0.28, 1.5);
  scene.add(aimReticleGroup);

  // 256-Slot Pooled 3D Instanced Particle Burst System (Gravity -18, Inherited Velocity, Oldest-Slot Recycling)
  const PARTICLE_COUNT = 256;
  const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const particleMesh = new THREE.InstancedMesh(SHARED.particleGeo, particleMat, PARTICLE_COUNT);
  particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(particleMesh);

  const particleSlots = [];
  const dummyMat4 = new THREE.Matrix4();
  const dummyColor = new THREE.Color();
  const dummyPos = new THREE.Vector3();
  const dummyQuat = new THREE.Quaternion();
  const dummyScale = new THREE.Vector3();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    dummyScale.set(0, 0, 0);
    dummyMat4.compose(dummyPos, dummyQuat, dummyScale);
    particleMesh.setMatrixAt(i, dummyMat4);
    particleMesh.setColorAt(i, dummyColor.setHex(0xffffff));
    particleSlots.push({
      active: false,
      age: 0,
      maxAge: 0.6,
      x: 0, y: -10, z: 0,
      vx: 0, vy: 0, vz: 0,
      baseScale: 1.0
    });
  }
  particleMesh.instanceMatrix.needsUpdate = true;
  if (particleMesh.instanceColor) particleMesh.instanceColor.needsUpdate = true;
  let nextParticleSlot = 0;

  function emitParticleBurst(x, y, z, count, colorHex, speedScale, upBoost, baseScale) {
    dummyColor.setHex(colorHex || 0xffffff);
    const n = count || 16;
    const sp = speedScale || 4.5;
    const up = upBoost || 6.2;
    for (let i = 0; i < n; i++) {
      const idx = nextParticleSlot;
      nextParticleSlot = (nextParticleSlot + 1) % PARTICLE_COUNT;
      const p = particleSlots[idx];
      p.active = true;
      p.age = 0;
      p.maxAge = 0.48 + Math.random() * 0.35;
      p.x = x + (Math.random() - 0.5) * 0.45;
      p.y = y + Math.random() * 0.25;
      p.z = z + (Math.random() - 0.5) * 0.45;
      const ang = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const horiz = (0.35 + Math.random() * 0.65) * sp;
      p.vx = Math.cos(ang) * horiz;
      p.vz = Math.sin(ang) * horiz;
      p.vy = up * (0.55 + Math.random() * 0.65);
      p.baseScale = (baseScale || 1.0) * (0.75 + Math.random() * 0.5);
      particleMesh.setColorAt(idx, dummyColor);
    }
    if (particleMesh.instanceColor) particleMesh.instanceColor.needsUpdate = true;
  }

  // Pooled 3D Splash Rings (depthTest: true, depthWrite: false, polygonOffset)
  const splashPool = [];
  for (let i = 0; i < 16; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0,
      depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false
    });
    const mesh = new THREE.Mesh(SHARED.splashRingGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    splashPool.push({ mesh, mat, active: false, age: 0, maxAge: 0.65, x: 0, z: 0, maxScale: 3.0 });
  }

  function spawnSplash(x, z, colorHex, maxScale, dropletCount) {
    const item = splashPool.find((s) => !s.active) || splashPool.reduce((a, b) => (a.age > b.age ? a : b));
    item.active = true;
    item.age = 0;
    item.maxAge = 0.65;
    item.maxScale = maxScale || 3.0;
    item.x = x;
    item.z = z;
    item.mat.color.setHex(colorHex || 0xffffff);
    item.mat.opacity = 0.9;
    const wy = waveHeight(x, z, totalElapsed);
    item.mesh.position.set(x, wy + 0.26, z);
    item.mesh.scale.set(0.4, 0.4, 0.4);
    item.mesh.visible = true;
    emitParticleBurst(x, wy + 0.25, z, dropletCount || 16, colorHex || 0xb3e5fc, 4.2, 6.0, 0.95);
  }

  // 40-Slot 5-Point Star ExtrudeGeometry Coin Pool (Recycles Oldest Active Coin, Flies to HUD/Live Boat & Counts Score Up on Arrival!)
  const COIN_POOL_SIZE = 40;
  const coinPool = [];
  for (let i = 0; i < COIN_POOL_SIZE; i++) {
    const mesh = new THREE.Mesh(SHARED.starCoinGeo, MATS.goldMetal);
    mesh.castShadow = true;
    mesh.visible = false;
    scene.add(mesh);
    coinPool.push({
      mesh,
      active: false,
      age: 0,
      dur: 0.68,
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      racer: null,
      ptsChunk: 0
    });
  }

  const unprojTmp = new THREE.Vector3();
  const dirTmp = new THREE.Vector3();
  function getPlayerHudScoreWorldPoint(outVec) {
    const chipEntry = leaderboardChips[0];
    const targetEl = (chipEntry && chipEntry.chip) || playerScoreNumEl;
    if (targetEl && canvas) {
      const rect = targetEl.getBoundingClientRect();
      const cRect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const ndcX = ((cx - cRect.left) / Math.max(1, cRect.width)) * 2 - 1;
      const ndcY = -((cy - cRect.top) / Math.max(1, cRect.height)) * 2 + 1;
      unprojTmp.set(ndcX, ndcY, 0.5).unproject(camera);
      dirTmp.subVectors(unprojTmp, camera.position).normalize();
      outVec.copy(camera.position).addScaledVector(dirTmp, 12.0);
      return outVec;
    }
    return outVec.set(0, 3.2, 12.6);
  }

  function allocateCoinSlot() {
    for (let i = 0; i < coinPool.length; i++) {
      if (!coinPool[i].active) return coinPool[i];
    }
    // Recycle oldest active coin after immediately crediting its pending points
    let oldest = coinPool[0];
    for (let i = 1; i < coinPool.length; i++) {
      if (coinPool[i].age > oldest.age) oldest = coinPool[i];
    }
    if (oldest.racer && oldest.ptsChunk > 0) {
      oldest.racer.score += oldest.ptsChunk;
      oldest.racer.pendingScore = Math.max(0, (oldest.racer.pendingScore || 0) - oldest.ptsChunk);
      oldest.ptsChunk = 0;
    }
    return oldest;
  }

  function spawnFlyingCoins(fromX, fromZ, racer, totalPoints, count) {
    const n = Math.max(1, Math.min(6, count || 3));
    const baseChunk = Math.floor(totalPoints / n);
    let remainder = totalPoints - baseChunk * n;
    racer.pendingScore = (racer.pendingScore || 0) + totalPoints;

    for (let i = 0; i < n; i++) {
      const c = allocateCoinSlot();
      const ptsForThisCoin = baseChunk + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      c.active = true;
      c.age = 0;
      c.dur = 0.52 + i * 0.06;
      c.stepIndex = i;
      c.racer = racer;
      c.ptsChunk = ptsForThisCoin;
      c.start.set(fromX + (Math.random() - 0.5) * 0.9, 0.65, fromZ + (Math.random() - 0.5) * 0.9);
      if (racer.isPlayer) {
        getPlayerHudScoreWorldPoint(c.end);
      } else {
        c.end.set(racer.boatGroup.position.x, 2.3, racer.boatGroup.position.z);
      }
      c.mesh.position.copy(c.start);
      c.mesh.visible = true;
    }
  }

  function flushAllPendingCoins() {
    for (let i = 0; i < coinPool.length; i++) {
      const c = coinPool[i];
      if (c.active && c.racer && c.ptsChunk > 0) {
        c.racer.score += c.ptsChunk;
        c.racer.pendingScore = Math.max(0, (c.racer.pendingScore || 0) - c.ptsChunk);
        c.ptsChunk = 0;
      }
      c.active = false;
      c.mesh.visible = false;
    }
  }

  // Water Pedal VFX Meshes (Multi-Ring Counter-Rotating 3D Vortex & Golden Net Dome with depthTest: true, depthWrite: false, polygonOffset)
  const whirlpoolMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.85,
    depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false
  });
  const whirlpoolInnerMat = new THREE.MeshBasicMaterial({
    color: 0x84ffff, wireframe: true, transparent: true, opacity: 0.92,
    depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, toneMapped: false
  });
  const whirlpoolMesh = new THREE.Group();
  const whirlpoolOuterRing = new THREE.Mesh(SHARED.whirlpoolRingGeo, whirlpoolMat);
  whirlpoolOuterRing.rotation.x = Math.PI / 2;
  const whirlpoolInnerRing = new THREE.Mesh(SHARED.whirlpoolRingGeo, whirlpoolInnerMat);
  whirlpoolInnerRing.rotation.x = Math.PI / 2;
  whirlpoolInnerRing.scale.set(0.58, 0.58, 1.35);
  const whirlpoolCoreRing = new THREE.Mesh(SHARED.aimRingGeo, whirlpoolInnerMat);
  whirlpoolCoreRing.rotation.x = -Math.PI / 2;
  whirlpoolCoreRing.scale.set(1.2, 1.2, 1.2);
  whirlpoolMesh.add(whirlpoolOuterRing, whirlpoolInnerRing, whirlpoolCoreRing);
  whirlpoolMesh.visible = false;
  scene.add(whirlpoolMesh);

  const superNetMat = new THREE.MeshBasicMaterial({
    color: 0xffd740, side: THREE.DoubleSide, wireframe: true, transparent: true, opacity: 0.9,
    depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, toneMapped: false
  });
  const superNetMesh = new THREE.Group();
  const superNetDisk = new THREE.Mesh(SHARED.netDiskGeo, superNetMat);
  superNetDisk.rotation.x = -Math.PI / 2;
  const superNetDome = new THREE.Mesh(SHARED.jellyDomeGeo, superNetMat);
  superNetDome.scale.set(4.5, 2.2, 4.5);
  superNetMesh.add(superNetDisk, superNetDome);
  superNetMesh.visible = false;
  scene.add(superNetMesh);

  // Constant-Thickness Propagating Shockwave Ring (0.65u world thickness updated per frame)
  const SHOCK_SEGMENTS = 48;
  const shockRingDynGeo = new THREE.RingGeometry(0.6, 1.25, SHOCK_SEGMENTS, 1);
  shockRingDynGeo.rotateX(-Math.PI / 2);
  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0xff4081, side: THREE.DoubleSide, transparent: true, opacity: 0.9,
    depthTest: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, toneMapped: false
  });
  const shockwaveMesh = new THREE.Mesh(shockRingDynGeo, shockwaveMat);
  shockwaveMesh.visible = false;
  scene.add(shockwaveMesh);

  function updateShockwaveRingVertices(cx, cz, radius, elapsedSec) {
    const innerR = Math.max(0.2, radius - 0.32);
    const outerR = radius + 0.33;
    const posAttr = shockRingDynGeo.attributes.position;
    const arr = posAttr.array;
    const stride = SHOCK_SEGMENTS + 1;
    for (let j = 0; j < stride; j++) {
      const ang = (j / SHOCK_SEGMENTS) * Math.PI * 2;
      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);

      // Inner ring vertex
      const ix = cosA * innerR;
      const iz = sinA * innerR;
      const iIdx = j * 3;
      arr[iIdx] = ix;
      arr[iIdx + 1] = waveHeight(cx + ix, cz + iz, elapsedSec) + 0.28;
      arr[iIdx + 2] = iz;

      // Outer ring vertex
      const ox = cosA * outerR;
      const oz = sinA * outerR;
      const oIdx = (j + stride) * 3;
      arr[oIdx] = ox;
      arr[oIdx + 1] = waveHeight(cx + ox, cz + oz, elapsedSec) + 0.28;
      arr[oIdx + 2] = oz;
    }
    posAttr.needsUpdate = true;
  }

  // Species-Specific 3D Smiling Critter Figure Builder
  function buildCritterFigure(critter, bodyMat, trimMat) {
    const fig = new THREE.Group();
    fig.position.set(0, 1.38, -0.15);

    const headBody = new THREE.Mesh(SHARED.critterBodyGeo, bodyMat);
    fig.add(headBody);

    const eyeL = new THREE.Mesh(SHARED.eyeWhiteGeo, MATS.white);
    eyeL.position.set(-0.24, 0.16, 0.58);
    const eyeR = new THREE.Mesh(SHARED.eyeWhiteGeo, MATS.white);
    eyeR.position.set(0.24, 0.16, 0.58);
    const pupL = new THREE.Mesh(SHARED.eyePupilGeo, MATS.pupil);
    pupL.position.set(-0.24, 0.16, 0.67);
    const pupR = new THREE.Mesh(SHARED.eyePupilGeo, MATS.pupil);
    pupR.position.set(0.24, 0.16, 0.67);
    fig.add(eyeL, eyeR, pupL, pupR);

    const smile = new THREE.Mesh(SHARED.smileArcGeo, MATS.smileBlack);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.02, 0.62);
    fig.add(smile);

    if (critter.id === "catnap") {
      const earL = new THREE.Mesh(SHARED.critterEarGeo, bodyMat);
      earL.position.set(-0.42, 0.68, 0);
      earL.rotation.z = 0.22;
      const earR = new THREE.Mesh(SHARED.critterEarGeo, bodyMat);
      earR.position.set(0.42, 0.68, 0);
      earR.rotation.z = -0.22;
      const moon = new THREE.Mesh(SHARED.moonCharmGeo, MATS.goldMetal);
      moon.position.set(0, -0.34, 0.58);
      fig.add(earL, earR, moon);
    } else if (critter.id === "dogday") {
      const flopL = new THREE.Mesh(SHARED.roundEarGeo, trimMat);
      flopL.scale.set(0.65, 1.55, 0.85);
      flopL.position.set(-0.66, 0.08, 0.05);
      flopL.rotation.z = 0.28;
      const flopR = new THREE.Mesh(SHARED.roundEarGeo, trimMat);
      flopR.scale.set(0.65, 1.55, 0.85);
      flopR.position.set(0.66, 0.08, 0.05);
      flopR.rotation.z = -0.28;
      const sunBadge = new THREE.Mesh(SHARED.roundEarGeo, MATS.goldMetal);
      sunBadge.scale.set(0.7, 0.7, 0.35);
      sunBadge.position.set(0, -0.34, 0.58);
      fig.add(flopL, flopR, sunBadge);
    } else if (critter.id === "bobby") {
      const earL = new THREE.Mesh(SHARED.roundEarGeo, bodyMat);
      earL.position.set(-0.48, 0.56, 0);
      const earR = new THREE.Mesh(SHARED.roundEarGeo, bodyMat);
      earR.position.set(0.48, 0.56, 0);
      const heart = new THREE.Mesh(SHARED.roundEarGeo, MATS.rubyRed);
      heart.scale.set(0.75, 0.68, 0.35);
      heart.position.set(0, -0.34, 0.58);
      fig.add(earL, earR, heart);
    } else if (critter.id === "craftycorn") {
      const earL = new THREE.Mesh(SHARED.critterEarGeo, bodyMat);
      earL.position.set(-0.38, 0.64, 0);
      const earR = new THREE.Mesh(SHARED.critterEarGeo, bodyMat);
      earR.position.set(0.38, 0.64, 0);
      const horn = new THREE.Mesh(SHARED.hornGeo, MATS.goldMetal);
      horn.position.set(0, 0.82, 0.28);
      horn.rotation.x = 0.35;
      fig.add(earL, earR, horn);
    } else if (critter.id === "hoppy") {
      const earL = new THREE.Mesh(SHARED.bunnyEarGeo, bodyMat);
      earL.position.set(-0.32, 0.88, 0);
      earL.rotation.z = 0.12;
      const earR = new THREE.Mesh(SHARED.bunnyEarGeo, bodyMat);
      earR.position.set(0.32, 0.88, 0);
      earR.rotation.z = -0.12;
      fig.add(earL, earR);
    } else if (critter.id === "kickin") {
      const beak = new THREE.Mesh(SHARED.beakGeo, MATS.orangeBeak);
      beak.rotation.x = Math.PI * 0.5;
      beak.position.set(0, 0.08, 0.78);
      const comb = new THREE.Mesh(SHARED.critterEarGeo, MATS.rubyRed);
      comb.scale.set(0.8, 0.9, 1.5);
      comb.position.set(0, 0.72, 0.05);
      fig.add(beak, comb);
    } else if (critter.id === "picky") {
      const earL = new THREE.Mesh(SHARED.roundEarGeo, bodyMat);
      earL.position.set(-0.44, 0.56, 0.05);
      const earR = new THREE.Mesh(SHARED.roundEarGeo, bodyMat);
      earR.position.set(0.44, 0.56, 0.05);
      const snout = new THREE.Mesh(SHARED.snoutGeo, MATS.pinkSnout);
      snout.rotation.x = Math.PI * 0.5;
      snout.position.set(0, 0.06, 0.68);
      fig.add(earL, earR, snout);
    } else if (critter.id === "bubba") {
      const earL = new THREE.Mesh(SHARED.discEarGeo, bodyMat);
      earL.rotation.x = Math.PI * 0.5;
      earL.rotation.z = 0.25;
      earL.position.set(-0.72, 0.18, 0);
      const earR = new THREE.Mesh(SHARED.discEarGeo, bodyMat);
      earR.rotation.x = Math.PI * 0.5;
      earR.rotation.z = -0.25;
      earR.position.set(0.72, 0.18, 0);
      const trunk = new THREE.Mesh(SHARED.trunkArcGeo, bodyMat);
      trunk.rotation.y = Math.PI * 0.5;
      trunk.position.set(0, -0.02, 0.68);
      fig.add(earL, earR, trunk);
    }

    enableShadowsRecursive(fig, true, true);
    return fig;
  }

  const racersGroup = new THREE.Group();
  scene.add(racersGroup);

  function createBoatRacer(slotIndex, critter, isPlayer) {
    const slot = BOAT_SLOTS[slotIndex];
    const boatGroup = new THREE.Group();
    boatGroup.position.set(slot.x, 0.35, slot.z);
    boatGroup.rotation.y = slot.rotY;

    const hullMat = new THREE.MeshStandardMaterial({ color: critter.color, roughness: 0.28, metalness: 0.25 });
    const bodyMat = new THREE.MeshStandardMaterial({ color: critter.bodyColor, roughness: 0.3, metalness: 0.2 });
    const trimMat = new THREE.MeshStandardMaterial({ color: critter.boatTrim, roughness: 0.35, metalness: 0.15 });
    const portraitMat = new THREE.MeshBasicMaterial({
      map: critterTextures[critter.id] || fallbackTextures[critter.id],
      side: THREE.FrontSide,
      fog: false,
      toneMapped: false
    });

    const boatShadow = new THREE.Mesh(SHARED.blobShadowGeo, MATS.blobShadowMat);
    boatShadow.rotation.x = -Math.PI / 2;
    boatShadow.scale.set(1.85, 2.75, 1.0);
    boatShadow.position.set(0, -0.16, 0);
    boatGroup.add(boatShadow);

    const hull = new THREE.Mesh(SHARED.hullGeo, hullMat);
    hull.scale.set(1.0, 1.0, 1.55);
    hull.position.y = 0.35;
    boatGroup.add(hull);

    const gunwale = new THREE.Mesh(SHARED.gunwaleGeo, MATS.navyGunwale);
    gunwale.rotation.x = Math.PI / 2;
    gunwale.scale.set(1.02, 1.56, 1.0);
    gunwale.position.y = 0.78;
    boatGroup.add(gunwale);

    const inner = new THREE.Mesh(SHARED.innerBowlGeo, trimMat);
    inner.scale.set(0.95, 1.0, 1.42);
    inner.position.y = 0.62;
    boatGroup.add(inner);

    const seat = new THREE.Mesh(SHARED.seatGeo, MATS.white);
    seat.position.set(0, 0.78, -0.2);
    boatGroup.add(seat);

    const figureGroup = buildCritterFigure(critter, bodyMat, trimMat);
    boatGroup.add(figureGroup);

    const medallionGroup = new THREE.Group();
    medallionGroup.position.set(0, 3.15, 0);
    const ring = new THREE.Mesh(SHARED.medallionRingGeo, isPlayer ? MATS.goldMetal : trimMat);
    const face = new THREE.Mesh(SHARED.medallionFaceGeo, portraitMat);
    face.position.z = 0.06;
    medallionGroup.add(ring, face);
    boatGroup.add(medallionGroup);

    const rodPivot = new THREE.Group();
    rodPivot.position.set(0.55, 1.45, 0.45);
    const rodMesh = new THREE.Mesh(SHARED.rodGeo, MATS.rodCarbon);
    rodMesh.position.set(0, 1.35, 0.75);
    rodMesh.rotation.x = Math.PI * 0.28;
    rodPivot.add(rodMesh);
    boatGroup.add(rodPivot);

    enableShadowsRecursive(boatGroup, true, true);
    boatShadow.castShadow = false;
    ring.castShadow = false;
    ring.receiveShadow = false;
    face.castShadow = false;
    face.receiveShadow = false;

    const bobberGroup = new THREE.Group();
    const bSphere = new THREE.Mesh(SHARED.bobberSphereGeo, isPlayer ? MATS.bobberGold : MATS.bobberRed);
    const bTop = new THREE.Mesh(SHARED.bobberTopGeo, MATS.white);
    bTop.position.y = 0.42;
    bSphere.castShadow = true;
    bTop.castShadow = true;
    bobberGroup.add(bSphere, bTop);
    bobberGroup.visible = false;
    scene.add(bobberGroup);

    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const lineMat = new THREE.LineBasicMaterial({ color: isPlayer ? 0xffff8d : 0xffffff, transparent: true, opacity: 0.85 });
    const lineObj = new THREE.Line(lineGeo, lineMat);
    lineObj.frustumCulled = false;
    lineObj.visible = false;
    scene.add(lineObj);

    racersGroup.add(boatGroup);

    const AI_TIERS = [
      null,
      { label: "Ace", scoreMult: 1.02, cdMult: 0.90, valueWeight: 1.15 },
      { label: "Contender", scoreMult: 0.90, cdMult: 1.00, valueWeight: 0.92 },
      { label: "Steady", scoreMult: 0.78, cdMult: 1.12, valueWeight: 0.74 },
      { label: "Rookie", scoreMult: 0.66, cdMult: 1.25, valueWeight: 0.55 }
    ];
    const aiTier = AI_TIERS[slotIndex] || AI_TIERS[2];

    return {
      slotIndex,
      isPlayer,
      aiTier,
      critter,
      hullMat,
      bodyMat,
      trimMat,
      portraitMat,
      figureGroup,
      score: 0,
      pendingScore: 0,
      catches: 0,
      boatGroup,
      baseRotY: slot.rotY,
      medallionGroup,
      rodPivot,
      rodMesh,
      bobberGroup,
      lineGeo,
      lineObj,
      disposables: [hullMat, bodyMat, trimMat, portraitMat, lineGeo, lineMat],
      hookState: "idle",
      hookTimer: 0,
      castFrom: new THREE.Vector3(),
      castTarget: new THREE.Vector3(),
      bobberPos: new THREE.Vector3(),
      bobberJerkX: 0,
      bobberJerkZ: 0,
      tugTimer: 0,
      rollAngle: 0,
      rollVel: 0,
      pitchAngle: 0,
      pitchVel: 0,
      hopTimer: 0,
      shockHitId: 0,
      hookedFish: null,
      aiCooldown: (0.75 + slotIndex * 0.42) * (aiTier ? aiTier.cdMult : 1.0),
      stunTimer: 0
    };
  }

  function clearRacers() {
    state.racers.forEach((r) => {
      racersGroup.remove(r.boatGroup);
      scene.remove(r.bobberGroup);
      scene.remove(r.lineObj);
      r.disposables.forEach((d) => d.dispose());
    });
    state.racers = [];
  }

  // Swimming 3D Fish Pool with Real 3D Velocity, Separation & Scoop/Rise States
  const fishGroup = new THREE.Group();
  scene.add(fishGroup);

  function createFishEntity(typeDef, colorHex, index) {
    const root = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: typeDef.kind === "whale" || typeDef.kind === "chest" ? 0.18 : 0.28,
      metalness: typeDef.kind === "whale" || typeDef.kind === "chest" ? 0.78 : 0.25,
      emissive: colorHex,
      emissiveIntensity: 0.16
    });

    const fShadow = new THREE.Mesh(SHARED.blobShadowGeo, MATS.blobShadowMat);
    fShadow.rotation.x = -Math.PI / 2;
    fShadow.scale.set(0.75, 1.15, 1.0);
    fShadow.position.y = -0.14;
    root.add(fShadow);

    let tailMesh = null;
    if (typeDef.kind === "chest") {
      const base = new THREE.Mesh(SHARED.chestBaseGeo, MATS.chestWood);
      const lid = new THREE.Mesh(SHARED.chestLidGeo, mat);
      lid.rotation.z = Math.PI / 2;
      lid.position.y = 0.34;
      root.add(base, lid);
    } else if (typeDef.kind === "jelly") {
      const dome = new THREE.Mesh(SHARED.jellyDomeGeo, MATS.jellyMat);
      root.add(dome);
      for (let t = 0; t < 4; t++) {
        const tent = new THREE.Mesh(SHARED.jellyTentacleGeo, MATS.jellyMat);
        tent.position.set(Math.cos((t * Math.PI) / 2) * 0.25, -0.35, Math.sin((t * Math.PI) / 2) * 0.25);
        root.add(tent);
      }
    } else if (typeDef.kind === "starfish") {
      for (let a = 0; a < 5; a++) {
        const arm = new THREE.Mesh(SHARED.starArmGeo, mat);
        const angle = (a / 5) * Math.PI * 2;
        arm.rotation.x = Math.PI / 2;
        arm.rotation.z = angle;
        arm.position.set(Math.sin(angle) * 0.32, 0, Math.cos(angle) * 0.32);
        root.add(arm);
      }
    } else {
      const body = new THREE.Mesh(SHARED.fishBodyGeo, mat);
      body.scale.set(0.82, 0.72, 1.35);
      root.add(body);

      tailMesh = new THREE.Mesh(SHARED.fishTailGeo, mat);
      tailMesh.rotation.x = -Math.PI / 2;
      tailMesh.position.set(0, 0, -0.92);
      root.add(tailMesh);

      const dorsal = new THREE.Mesh(SHARED.finGeo, mat);
      dorsal.position.set(0, 0.48, -0.1);
      root.add(dorsal);

      const eyeL = new THREE.Mesh(SHARED.eyeWhiteGeo, MATS.white);
      eyeL.position.set(-0.36, 0.14, 0.52);
      const eyeR = new THREE.Mesh(SHARED.eyeWhiteGeo, MATS.white);
      eyeR.position.set(0.36, 0.14, 0.52);
      const pupL = new THREE.Mesh(SHARED.eyePupilGeo, MATS.pupil);
      pupL.position.set(-0.44, 0.14, 0.58);
      const pupR = new THREE.Mesh(SHARED.eyePupilGeo, MATS.pupil);
      pupR.position.set(0.44, 0.14, 0.58);
      root.add(eyeL, eyeR, pupL, pupR);
    }

    enableShadowsRecursive(root, true, false);
    fShadow.castShadow = false;

    const s = typeDef.scale;
    root.scale.set(s, s, s);
    fishGroup.add(root);

    const angle = (index * 1.37) % (Math.PI * 2);
    const radius = 1.8 + (index % 7) * 1.15;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * (radius * 0.68) - 0.6;
    const heading = angle + Math.PI * 0.5;
    const spd = typeDef.speed * (0.88 + (index % 4) * 0.08);

    root.position.set(x, 0.22, z);

    return {
      typeDef,
      root,
      tailMesh,
      mat,
      colorHex,
      x,
      z,
      vx: Math.sin(heading) * spd,
      vz: Math.cos(heading) * spd,
      heading,
      speed: spd,
      wigglePhase: index * 0.9,
      hookedBy: null,
      scoopTimer: 0,
      scoopRacer: null,
      scoopStart: new THREE.Vector3(),
      riseYOffset: 0,
      riseVel: 0,
      shockHitId: 0,
      respawnTimer: 0
    };
  }

  function clearFishes() {
    state.fishes.forEach((f) => {
      fishGroup.remove(f.root);
      if (f.mat) f.mat.dispose();
    });
    state.fishes = [];
  }

  function respawnFish(fish, forceGolden) {
    fish.hookedBy = null;
    fish.scoopTimer = 0;
    fish.scoopRacer = null;
    fish.respawnTimer = 0;
    const ang = Math.random() * Math.PI * 2;
    const rad = 1.6 + Math.random() * 7.5;
    fish.x = Math.cos(ang) * rad;
    fish.z = Math.sin(ang) * (rad * 0.68) - 0.4;
    fish.heading = ang + (Math.random() > 0.5 ? 1.4 : -1.4);
    fish.vx = Math.sin(fish.heading) * fish.speed;
    fish.vz = Math.cos(fish.heading) * fish.speed;
    fish.riseYOffset = -0.9;
    fish.riseVel = 3.2;
    const s = fish.typeDef.scale * (forceGolden ? 1.15 : 1.0);
    fish.root.scale.set(s, s, s);
    fish.root.position.set(fish.x, waveHeight(fish.x, fish.z, totalElapsed) + 0.22 + fish.riseYOffset, fish.z);
    fish.root.visible = true;
  }

  function populateLagoonFishes(stage) {
    clearFishes();
    const total = stage.fishCount;
    const mix = stage.fishMix || ["whale", "chest", "rainbow", "goldfish", "starfish"];
    const pal = stage.fishPalette || {};
    for (let i = 0; i < total; i++) {
      let kind = mix[i % mix.length];
      if (i > 2 && kind === "whale") kind = mix[(i + 2) % mix.length];
      const typeDef = FISH_TYPES[kind] || FISH_TYPES.rainbow;
      const colorList = pal[typeDef.kind] || [0xff5252, 0x40c4ff, 0xffd740];
      const col = colorList[i % colorList.length];
      state.fishes.push(createFishEntity(typeDef, col, i));
    }
    for (let j = 0; j < stage.jellyCount; j++) {
      state.fishes.push(createFishEntity(FISH_TYPES.jelly, 0xe040fb, total + j));
    }
  }

  const tempProj = new THREE.Vector3();
  function spawnFloatingPopup(worldX, worldY, worldZ, text) {
    tempProj.set(worldX, worldY, worldZ);
    tempProj.project(camera);
    const sx = (tempProj.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-tempProj.y * 0.5 + 0.5) * window.innerHeight;
    const el = document.createElement("div");
    el.className = "floating-pop";
    el.style.left = `${Math.max(40, Math.min(window.innerWidth - 40, sx))}px`;
    el.style.top = `${Math.max(65, Math.min(window.innerHeight - 90, sy))}px`;
    el.textContent = text;
    fxLayer.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 950);
  }

  let leaderboardChips = [];

  function buildLeaderboardDOM() {
    leaderboardEl.innerHTML = "";
    leaderboardChips = state.racers.map((r) => {
      const chip = document.createElement("div");
      chip.className = `racer-chip ${r.isPlayer ? "is-player" : ""}`;
      const medalSpan = document.createElement("span");
      medalSpan.className = "racer-medal";
      medalSpan.textContent = "🥇";
      const img = document.createElement("img");
      img.src = r.critter.icon;
      img.alt = r.critter.name;
      const barWrap = document.createElement("div");
      barWrap.className = "racer-mini-bar";
      const barFill = document.createElement("div");
      barFill.className = "racer-mini-fill";
      barWrap.appendChild(barFill);
      const scoreSpan = document.createElement("span");
      scoreSpan.className = "racer-score";
      scoreSpan.textContent = "0";
      chip.append(medalSpan, img, barWrap, scoreSpan);
      leaderboardEl.appendChild(chip);
      return { racer: r, chip, img, medalSpan, barFill, scoreSpan };
    });
  }

  function updateStaticStageBadge() {
    const stage = STAGES[state.stageIndex];
    const playerCritter = CRITTERS[state.critterIndex] || CRITTERS[0];
    if (hudCritterAvatar.getAttribute("src") !== playerCritter.icon) {
      hudCritterAvatar.setAttribute("src", playerCritter.icon);
    }
    hudStageIcon.textContent = stage.icon;
    stageDotsEl.innerHTML = STAGES.map((s, idx) => {
      const cls = idx === state.stageIndex ? "stage-dot active" : state.stageStars[idx] > 0 ? "stage-dot cleared" : "stage-dot";
      return `<span class="${cls}"></span>`;
    }).join("");
  }

  function clearHeldInputs() {
    state.keys.left = false;
    state.keys.right = false;
    state.keys.up = false;
    state.keys.down = false;
    const leftBtn = document.getElementById("btn-aim-left");
    const rightBtn = document.getElementById("btn-aim-right");
    if (leftBtn) leftBtn.classList.remove("pressed");
    if (rightBtn) rightBtn.classList.remove("pressed");
    if (castBtnEl) castBtnEl.classList.remove("pressed");
    ["pedal-1", "pedal-2", "pedal-3"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.remove("pressed", "cd-shake");
    });
  }

  function resetTransientPoolsAndVFX() {
    clearHeldInputs();
    for (let i = 0; i < splashPool.length; i++) {
      splashPool[i].active = false;
      splashPool[i].mesh.visible = false;
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleSlots[i].active = false;
      dummyScale.set(0, 0, 0);
      dummyMat4.compose(dummyPos.set(0, -10, 0), dummyQuat, dummyScale);
      particleMesh.setMatrixAt(i, dummyMat4);
    }
    particleMesh.instanceMatrix.needsUpdate = true;
    if (fxLayer) {
      fxLayer.innerHTML = "";
    }
    state.pedals.forEach((p) => {
      p.activeTimer = 0;
    });
    whirlpoolMesh.visible = false;
    superNetMesh.visible = false;
    shockwaveMesh.visible = false;
  }

  function setupStage(stageIdx) {
    const clampedIdx = Math.max(0, Math.min(STAGES.length - 1, stageIdx));
    state.stageIndex = clampedIdx;
    const stage = STAGES[clampedIdx];

    flushAllPendingCoins();
    resetTransientPoolsAndVFX();
    state.timeLeft = state.duration;
    state.fever = 0;
    state.feverTimer = 0;
    state.combo = 1;
    state.comboTimer = 0;
    state.trauma = 0;
    state.camKick.set(0, 0, 0);
    state.camKickVel.set(0, 0, 0);
    state.aimX = 0;
    state.aimZ = 1.5;
    state.pedals.forEach((p) => {
      p.cd = 0;
      p.activeTimer = 0;
    });

    buildStageScenery(stage);
    clearRacers();

    const playerCritter = CRITTERS[state.critterIndex] || CRITTERS[0];
    const rivalPool = CRITTERS.filter((_, idx) => idx !== state.critterIndex);
    const chosenRacers = [playerCritter];
    for (let i = 0; i < 4; i++) {
      chosenRacers.push(rivalPool[(clampedIdx + i) % rivalPool.length]);
    }
    chosenRacers.forEach((critter, slotIdx) => {
      state.racers.push(createBoatRacer(slotIdx, critter, slotIdx === 0));
    });

    populateLagoonFishes(stage);
    buildLeaderboardDOM();
    updateStaticStageBadge();
    updateHUD();
    renderStageRail();
    fitCamera();
  }

  function getRodTipWorld(racer, outVec) {
    racer.rodMesh.updateMatrixWorld();
    outVec.set(0, 1.5, 0);
    racer.rodMesh.localToWorld(outVec);
    return outVec;
  }

  function triggerPlayerCastOrReel() {
    if (state.mode !== "playing") return;
    const player = state.racers[0];
    if (!player) return;

    if (player.hookState === "idle") {
      player.hookState = "casting";
      player.hookTimer = 0;
      player.pitchVel -= 0.85;
      getRodTipWorld(player, player.castFrom);
      player.castTarget.set(state.aimX, waveHeight(state.aimX, state.aimZ, totalElapsed) + 0.22, state.aimZ);
      player.bobberPos.copy(player.castFrom);
      player.bobberGroup.position.copy(player.bobberPos);
      player.bobberGroup.visible = true;
      player.lineObj.visible = true;
      SFX.cast();
    } else if (player.hookState === "waiting") {
      tryLatchFishForRacer(player, 2.35);
      player.hookState = "reeling";
      player.hookTimer = 0;
      player.pitchVel += 0.65;
      SFX.splash();
    } else if (player.hookState === "reeling") {
      // Weight-scaled tap boost + line tug feedback!
      const w = player.hookedFish ? player.hookedFish.typeDef.weight : 1.0;
      player.hookTimer += 0.14 / w;
      player.pitchVel += 0.45 * Math.min(2.0, w);
      player.rollVel += (Math.random() - 0.5) * 0.6;
      SFX.tug();
    }
  }

  function tryLatchFishForRacer(racer, radius) {
    if (racer.hookedFish) return true;
    let bestFish = null;
    let bestDist = radius;
    for (let i = 0; i < state.fishes.length; i++) {
      const f = state.fishes[i];
      if (!f.root.visible || f.hookedBy || f.scoopTimer > 0) continue;
      const dx = f.x - racer.bobberPos.x;
      const dz = f.z - racer.bobberPos.z;
      const d = Math.hypot(dx, dz);
      // Allow jellyfish to zap waiting AI bobbers if they swim directly into them!
      if (!racer.isPlayer && f.typeDef.kind === "jelly") {
        if (racer.hookState === "waiting" && d < 0.92) {
          bestDist = d;
          bestFish = f;
        }
        continue;
      }
      if (d < bestDist) {
        bestDist = d;
        bestFish = f;
      }
    }
    if (bestFish) {
      if (bestFish.typeDef.kind === "jelly") {
        bestFish.root.visible = false;
        bestFish.respawnTimer = 4.0;
        racer.hookState = "zapped";
        racer.hookTimer = 0.88;
        racer.rollVel += 1.8;
        racer.pitchVel -= 1.2;
        if (racer.isPlayer) {
          state.combo = 1;
          addTrauma(0.4, (Math.random() - 0.5) * 0.6, 0.5);
          SFX.zap();
        } else {
          racer.stunTimer = 1.1;
        }
        spawnSplash(racer.bobberPos.x, racer.bobberPos.z, 0xe040fb, 3.0, 20);
        emitParticleBurst(racer.bobberPos.x, 0.5, racer.bobberPos.z, 22, 0xe040fb, 5.8, 7.2, 1.1);
        spawnFloatingPopup(racer.bobberPos.x, 1.4, racer.bobberPos.z, "🪼⚡");
        return false;
      }
      bestFish.hookedBy = racer;
      racer.hookedFish = bestFish;
      racer.hookState = "reeling";
      racer.hookTimer = 0;
      racer.tugTimer = 0.16;
      const w = bestFish.typeDef.weight;
      racer.pitchVel += 0.55 * w;
      racer.rollVel += (Math.random() > 0.5 ? 1 : -1) * 0.45 * w;
      spawnSplash(bestFish.x, bestFish.z, 0xffff00, 2.8, 18);
      if (racer.isPlayer) SFX.bite();
      return true;
    }
    return false;
  }

  // Sector-Aware, Non-Overlapping AI Rival Target Picker with Stage-Scaled Scatter & Velocity Lead
  function selectAiCastTarget(racer, stage, elapsedSec, outVec) {
    const bx = racer.boatGroup.position.x;
    const bz = racer.boatGroup.position.z;
    const tier = racer.aiTier || { scoreMult: 0.85, valueWeight: 0.85 };
    let bestFish = null;
    let bestScore = -1e9;

    for (let i = 0; i < state.fishes.length; i++) {
      const f = state.fishes[i];
      if (!f.root.visible || f.hookedBy || f.scoopTimer > 0 || f.typeDef.kind === "jelly") continue;

      const distToBoat = Math.hypot(f.x - bx, f.z - bz);
      // Value preference grows with stage.id and rival tier
      const valScore = (f.typeDef.points / 110) * (0.25 + stage.id * 0.13) * tier.valueWeight;
      let score = valScore * 4.2 - distToBoat * 1.15;

      // Avoid other rivals' active cast targets so all 4 boats spread across the lagoon!
      for (let rIdx = 1; rIdx < state.racers.length; rIdx++) {
        const other = state.racers[rIdx];
        if (other === racer || other.hookState === "idle") continue;
        const sep = Math.hypot(f.x - other.castTarget.x, f.z - other.castTarget.z);
        if (sep < 3.0) {
          score -= (3.0 - sep) * 14.0;
        }
      }

      score += Math.sin(elapsedSec * 2.3 + i * 1.7 + racer.slotIndex) * 1.6;
      if (score > bestScore) {
        bestScore = score;
        bestFish = f;
      }
    }

    const scatterAmp = Math.max(0.24, (1.55 - stage.id * 0.15) * (1.85 - tier.scoreMult * 0.75));
    const scatterX = (Math.random() - 0.5) * 2 * scatterAmp;
    const scatterZ = (Math.random() - 0.5) * 2 * scatterAmp;

    if (bestFish) {
      const leadSec = 0.22 + stage.id * 0.025;
      const tx = Math.max(-9.6, Math.min(9.6, bestFish.x + bestFish.vx * leadSec + scatterX));
      const tz = Math.max(-6.8, Math.min(6.4, bestFish.z + bestFish.vz * leadSec + scatterZ));
      outVec.set(tx, waveHeight(tx, tz, elapsedSec) + 0.2, tz);
    } else {
      const fallbackX = Math.max(-8.5, Math.min(8.5, bx * 0.45 + scatterX * 2));
      const fallbackZ = Math.max(-6.0, Math.min(5.5, bz * 0.45 + scatterZ * 2));
      outVec.set(fallbackX, waveHeight(fallbackX, fallbackZ, elapsedSec) + 0.2, fallbackZ);
    }
    return outVec;
  }

  function triggerRainbowFever() {
    state.fever = 100;
    state.feverTimer = 7.0;
    addTrauma(0.42, 0, -0.4);
    SFX.feverChime();
    const pBoat = state.racers[0] ? state.racers[0].boatGroup.position : { x: 0, z: 12.6 };
    emitParticleBurst(pBoat.x, 1.6, pBoat.z - 1.0, 28, 0xffeb3b, 6.2, 7.8, 1.25);
    spawnFloatingPopup(0, 2.5, 2, "🌈🔥 x2!");
  }

  function completeCatch(racer, fish) {
    const stage = STAGES[state.stageIndex];
    // True 2.0x catch multiplier during Rainbow Fever Mode for player; stage & tier calibration for AI rivals!
    let pts = fish.typeDef.points;
    if (racer.isPlayer) {
      const feverMult = state.feverTimer > 0 ? 2.0 : 1.0;
      const comboMult = 1 + (state.combo - 1) * 0.12;
      pts = Math.round(fish.typeDef.points * feverMult * comboMult);
    } else {
      const stageAiMult = 0.44 + stage.id * 0.072;
      const tierMult = racer.aiTier ? racer.aiTier.scoreMult : 0.85;
      const player = state.racers[0];
      const playerTotal = player ? player.score + (player.pendingScore || 0) : 0;
      const rivalTotal = racer.score + (racer.pendingScore || 0);
      // Gentle catch-up rubber-banding on early stages so Stage 1 is a joyful 3-star win for kids!
      let rubberBand = 1.0;
      if (stage.id <= 3 && rivalTotal > playerTotal + stage.targetScore * 0.14) {
        rubberBand = 0.52;
      } else if (stage.id <= 6 && rivalTotal > playerTotal + stage.targetScore * 0.24) {
        rubberBand = 0.72;
      }
      pts = Math.max(25, Math.round(fish.typeDef.points * stageAiMult * tierMult * rubberBand));
    }
    racer.catches += 1;
    racer.hopTimer = 0.52;

    const isBig = fish.typeDef.kind === "whale" || fish.typeDef.kind === "chest";
    const coinCount = isBig ? 6 : 3;

    // Emit 3D gold star sparkle burst at catch location
    emitParticleBurst(fish.x, 0.8, fish.z, isBig ? 28 : 18, 0xffd700, isBig ? 6.0 : 4.5, 7.2, isBig ? 1.25 : 1.0);

    // Launch 5-point Star ExtrudeGeometry coins that count score up on arrival!
    spawnFlyingCoins(fish.x, fish.z, racer, pts, coinCount);

    // Boat landing spring impulse
    racer.pitchVel -= 0.5 * fish.typeDef.weight;
    racer.rollVel += (Math.random() - 0.5) * 0.7 * fish.typeDef.weight;

    if (racer.isPlayer) {
      state.combo = Math.min(5, state.combo + 1);
      state.comboTimer = 5.5;
      if (state.feverTimer <= 0) {
        state.fever = Math.min(100, state.fever + (fish.typeDef.kind === "whale" ? 38 : 24));
        if (state.fever >= 100) {
          triggerRainbowFever();
        }
      }
      addTrauma(isBig ? 0.45 : 0.25, isBig ? (fish.x * 0.04) : 0, isBig ? -0.45 : -0.15);
      SFX.catchFish(isBig);
      spawnFloatingPopup(
        racer.boatGroup.position.x,
        2.5,
        racer.boatGroup.position.z - 1.5,
        `${fish.typeDef.emoji} +${pts}`
      );
    }

    fish.hookedBy = null;
    fish.scoopTimer = 0;
    fish.scoopRacer = null;
    fish.root.visible = false;
    fish.respawnTimer = 1.6 + Math.random() * 1.4;
    racer.hookedFish = null;

    const totalPlayerScore = racer.score + (racer.pendingScore || 0);
    if (racer.isPlayer && totalPlayerScore >= stage.targetScore * 1.45 && state.timeLeft < 45) {
      finishStage();
    }
  }

  // 3 Power Pedals with Rainbow Fever Synergy (+12 Fever) & Cooldown Shake Feedback
  function activatePedal(pedalIdx) {
    if (state.mode !== "playing") return false;
    const p = state.pedals[pedalIdx];
    const btn = pedalBtnEls[pedalIdx];
    if (!p) return false;
    if (p.cd > 0) {
      if (btn) {
        btn.classList.remove("cd-shake");
        void btn.offsetWidth;
        btn.classList.add("cd-shake");
        setTimeout(() => btn.classList.remove("cd-shake"), 300);
      }
      SFX.tone(150, 0.08, "sawtooth", 0.06, 110);
      return false;
    }

    p.cd = p.maxCd;
    SFX.pedal(pedalIdx);

    // Power Pedal activation builds +12 Rainbow Fever gauge!
    if (state.feverTimer <= 0) {
      state.fever = Math.min(100, state.fever + 12);
      if (state.fever >= 100) {
        triggerRainbowFever();
      }
    }

    const player = state.racers[0];
    const centerX = player && player.bobberGroup.visible ? player.bobberPos.x : state.aimX;
    const centerZ = player && player.bobberGroup.visible ? player.bobberPos.z : state.aimZ;
    const wy = waveHeight(centerX, centerZ, totalElapsed);

    if (pedalIdx === 0) {
      // 🌪️ Whirlpool Magnet Force Field (Multi-ring counter-rotating 3D vortex)
      p.activeTimer = 3.5;
      whirlpoolMesh.position.set(centerX, wy + 0.28, centerZ);
      whirlpoolMesh.visible = true;
      spawnSplash(centerX, centerZ, 0x00e5ff, 4.2, 24);
      if (player && player.hookState === "idle") {
        triggerPlayerCastOrReel();
      }
      spawnFloatingPopup(centerX, 1.8, centerZ, "🌪️🧲");
    } else if (pedalIdx === 1) {
      // ⚡ Golden Super Net: 3D golden dome & ring lifts up to 3 nearby fish along a 3D scoop arc!
      p.activeTimer = 0.9;
      superNetMesh.position.set(centerX, wy + 0.29, centerZ);
      superNetMesh.scale.set(0.35, 0.35, 0.35);
      superNetMesh.visible = true;
      spawnSplash(centerX, centerZ, 0xffd740, 4.6, 24);
      addTrauma(0.32, 0, -0.25);

      const candidates = state.fishes
        .filter((f) => f.root.visible && !f.hookedBy && f.scoopTimer <= 0 && f.typeDef.kind !== "jelly")
        .map((f) => ({ f, d: Math.hypot(f.x - centerX, f.z - centerZ) }))
        .filter((item) => item.d <= 5.4)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);

      candidates.forEach(({ f }) => {
        f.scoopTimer = 0.36;
        f.scoopRacer = player;
        f.scoopStart.set(f.x, wy + 0.22, f.z);
        emitParticleBurst(f.x, wy + 0.3, f.z, 14, 0xffea00, 4.2, 6.8, 0.95);
      });
      spawnFloatingPopup(centerX, 2.0, centerZ, `⚡🕸️ x${Math.max(1, candidates.length)}`);
    } else if (pedalIdx === 2) {
      // 💥 Propagating Depth Shockwave Impulse Wave from Player Boat!
      p.activeTimer = 1.15;
      state.shockWaveId += 1;
      const bx = player ? player.boatGroup.position.x : 0;
      const bz = player ? player.boatGroup.position.z - 1.2 : 11.4;
      state.shockOrigin.set(bx, waveHeight(bx, bz, totalElapsed) + 0.28, bz);
      state.shockRadius = 1.0;
      shockwaveMesh.position.set(bx, 0, bz);
      updateShockwaveRingVertices(bx, bz, state.shockRadius, totalElapsed);
      shockwaveMat.opacity = 0.92;
      shockwaveMesh.visible = true;
      addTrauma(0.60, 0, 0.65);

      // Surface a hidden/respawning chest (or the farthest unhooked chest) from y = -1.2 with a rising bob & splash!
      const hiddenChest =
        state.fishes.find((f) => f.typeDef.kind === "chest" && !f.root.visible) ||
        state.fishes.filter((f) => f.typeDef.kind === "chest" && !f.hookedBy && f.scoopTimer <= 0).sort((a, b) => b.z - a.z)[0];
      if (hiddenChest) {
        hiddenChest.x = state.aimX;
        hiddenChest.z = state.aimZ;
        hiddenChest.vx = 0;
        hiddenChest.vz = 0;
        hiddenChest.riseYOffset = -1.25;
        hiddenChest.riseVel = 4.2;
        hiddenChest.respawnTimer = 0;
        hiddenChest.shockHitId = state.shockWaveId;
        hiddenChest.root.position.set(hiddenChest.x, wy - 1.0, hiddenChest.z);
        hiddenChest.root.visible = true;
        spawnSplash(hiddenChest.x, hiddenChest.z, 0xffd700, 3.6, 20);
      }
      spawnFloatingPopup(state.aimX, 2.1, state.aimZ, "💥🧰");
    }
    return true;
  }

  const tmpTip = new THREE.Vector3();
  const feverRainbowPalette = [0xff4081, 0xffeb3b, 0x00e676, 0x00e5ff, 0xd500f9];
  let totalElapsed = 0;

  function updateSimulation(dt, elapsedSec) {
    if (state.mode !== "playing") return;

    const stage = STAGES[state.stageIndex];
    state.timeLeft = Math.max(0, state.timeLeft - dt);

    if (state.comboTimer > 0) {
      state.comboTimer -= dt;
      if (state.comboTimer <= 0) state.combo = 1;
    }
    const feverActive = state.feverTimer > 0;
    if (feverActive) {
      state.feverTimer = Math.max(0, state.feverTimer - dt);
      state.fever = (state.feverTimer / 7.0) * 100;
      const hue = (elapsedSec * 1.4) % 1.0;
      lurePointLight.color.setHSL(hue, 1.0, 0.58);
      const pBoat = state.racers[0];
      if (pBoat && Math.random() < 0.65) {
        const rCol = feverRainbowPalette[Math.floor(elapsedSec * 12) % feverRainbowPalette.length];
        emitParticleBurst(
          pBoat.boatGroup.position.x + (Math.random() - 0.5) * 1.8,
          pBoat.boatGroup.position.y + 0.35,
          pBoat.boatGroup.position.z - 0.6,
          2,
          rCol,
          2.8,
          4.2,
          0.85
        );
      }
    } else {
      lurePointLight.color.setHex(0xffe57f);
    }

    // Update Pedals & Propagating Shockwave Wavefront
    state.pedals.forEach((p, idx) => {
      if (p.cd > 0) p.cd = Math.max(0, p.cd - dt);
      if (p.activeTimer > 0) {
        p.activeTimer = Math.max(0, p.activeTimer - dt);
        if (idx === 0) {
          whirlpoolOuterRing.rotation.z += dt * 7.5;
          whirlpoolInnerRing.rotation.z -= dt * 11.2;
          whirlpoolCoreRing.rotation.z += dt * 14.0;
          const wy = waveHeight(whirlpoolMesh.position.x, whirlpoolMesh.position.z, elapsedSec);
          whirlpoolMesh.position.y = wy + 0.28;
          whirlpoolInnerRing.position.y = 0.14 + Math.sin(elapsedSec * 9.0) * 0.08;
          if (Math.random() < 0.75) {
            const ang = Math.random() * Math.PI * 2;
            const rad = 0.6 + Math.random() * 1.9;
            emitParticleBurst(
              whirlpoolMesh.position.x + Math.cos(ang) * rad,
              wy + 0.28,
              whirlpoolMesh.position.z + Math.sin(ang) * rad,
              2,
              0x00e5ff,
              2.6,
              4.0,
              0.78
            );
          }
          const player = state.racers[0];
          if (player && player.hookState === "waiting") {
            tryLatchFishForRacer(player, 2.85);
          }
          if (p.activeTimer <= 0) whirlpoolMesh.visible = false;
        } else if (idx === 1) {
          const prog = 1 - p.activeTimer / 0.9;
          const s = 1.45 - prog * 0.85;
          superNetMesh.scale.set(s, 0.45 + Math.sin(prog * Math.PI) * 0.95, s);
          superNetMesh.rotation.y += dt * 6.5;
          superNetMesh.position.y = waveHeight(superNetMesh.position.x, superNetMesh.position.z, elapsedSec) + 0.29 + prog * 0.55;
          if (p.activeTimer <= 0) superNetMesh.visible = false;
        } else if (idx === 2) {
          const progressFrac = 1 - p.activeTimer / 1.15;
          state.shockRadius = 1.0 + progressFrac * 24.5;
          const ox = state.shockOrigin.x;
          const oz = state.shockOrigin.z;
          updateShockwaveRingVertices(ox, oz, state.shockRadius, elapsedSec);
          shockwaveMat.opacity = (p.activeTimer / 1.15) * 0.92;

          // Emit foam particles along the expanding shockwave front
          if (Math.random() < 0.85) {
            const fang = (Math.random() - 0.5) * Math.PI * 1.1 - Math.PI * 0.5;
            const fx = ox + Math.cos(fang) * state.shockRadius;
            const fz = oz + Math.sin(fang) * state.shockRadius;
            if (Math.hypot(fx, fz) < 16.2) {
              emitParticleBurst(fx, waveHeight(fx, fz, elapsedSec) + 0.25, fz, 3, 0xffffff, 2.6, 3.8, 0.75);
            }
          }

          // Apply wavefront impulse to fish & jellies as distance <= state.shockRadius (once per target!)
          const curWaveId = state.shockWaveId;
          for (let fIdx = 0; fIdx < state.fishes.length; fIdx++) {
            const f = state.fishes[fIdx];
            if (!f.root.visible || f.shockHitId === curWaveId) continue;
            const dx = f.x - ox;
            const dz = f.z - oz;
            const dist = Math.hypot(dx, dz);
            if (dist <= state.shockRadius) {
              f.shockHitId = curWaveId;
              if (f.typeDef.kind === "jelly") {
                spawnSplash(f.x, f.z, 0xe040fb, 2.6, 18);
                emitParticleBurst(f.x, 0.5, f.z, 20, 0xe040fb, 5.5, 6.8, 1.1);
                SFX.shockHit();
                f.root.visible = false;
                f.respawnTimer = 6.5;
              } else if (!f.hookedBy && f.scoopTimer <= 0) {
                const falloff = Math.max(0.28, 1 - dist / 26.0);
                const nx = dist > 0.01 ? dx / dist : 0;
                const nz = dist > 0.01 ? dz / dist : -1;
                f.vx += nx * 9.0 * falloff;
                f.vz += nz * 9.0 * falloff;
                f.heading = Math.atan2(f.vx, f.vz);
              }
            }
          }

          // Apply wavefront impulse to rival boats & knock off active rival bobbers when wavefront reaches them!
          for (let rIdx = 1; rIdx < state.racers.length; rIdx++) {
            const rv = state.racers[rIdx];
            if (rv.shockHitId === curWaveId) continue;
            const rDist = Math.hypot(rv.boatGroup.position.x - ox, rv.boatGroup.position.z - oz);
            if (rDist <= state.shockRadius) {
              rv.shockHitId = curWaveId;
              rv.stunTimer = 2.2;
              rv.rollVel += (rv.boatGroup.position.x < 0 ? -1 : 1) * 2.2;
              rv.pitchVel += 1.65;
              SFX.shockHit();
              spawnFloatingPopup(rv.boatGroup.position.x, 2.4, rv.boatGroup.position.z, "💫");
              if (rv.hookState !== "idle") {
                if (rv.hookedFish) {
                  rv.hookedFish.hookedBy = null;
                  rv.hookedFish = null;
                }
                spawnSplash(rv.bobberPos.x, rv.bobberPos.z, 0xff4081, 2.2, 12);
                rv.hookState = "idle";
                rv.bobberGroup.visible = false;
                rv.lineObj.visible = false;
                rv.aiCooldown = 1.4;
              }
            }
          }

          if (p.activeTimer <= 0) shockwaveMesh.visible = false;
        }
      }
    });

    const aimSpeed = 12.5;
    if (state.keys.left) state.aimX = Math.max(-11.8, state.aimX - aimSpeed * dt);
    if (state.keys.right) state.aimX = Math.min(11.8, state.aimX + aimSpeed * dt);
    if (state.keys.up) state.aimZ = Math.max(-8.4, state.aimZ - aimSpeed * dt);
    if (state.keys.down) state.aimZ = Math.min(7.2, state.aimZ + aimSpeed * dt);

    const aimWaveY = waveHeight(state.aimX, state.aimZ, elapsedSec);
    aimReticleGroup.position.set(state.aimX, aimWaveY + 0.28, state.aimZ);
    aimOuterMesh.rotation.z += dt * 1.8;
    const pulse = 1.0 + Math.sin(elapsedSec * 6.0) * 0.1;
    aimReticleGroup.scale.set(pulse, 1, pulse);
    lurePointLight.position.set(state.aimX, aimWaveY + 1.0, state.aimZ);

    const player = state.racers[0];
    if (player) {
      const targetBoatX = Math.max(-9.0, Math.min(9.0, state.aimX * 0.68));
      player.boatGroup.position.x += (targetBoatX - player.boatGroup.position.x) * Math.min(1, dt * 6.5);
      player.boatGroup.rotation.y = Math.PI - (state.aimX - player.boatGroup.position.x) * 0.045;
    }

    // Update Swimming 3D Fishes with Real Velocity, Drag, Separation, Swirling Whirlpool & Boat Hull Repulsion
    const whirlpoolActive = state.pedals[0].activeTimer > 0;
    const wpX = whirlpoolMesh.position.x;
    const wpZ = whirlpoolMesh.position.z;
    const dragFactor = Math.exp(-2.2 * dt);

    for (let i = 0; i < state.fishes.length; i++) {
      const f = state.fishes[i];
      if (!f.root.visible) {
        if (f.respawnTimer > 0) {
          f.respawnTimer -= dt;
          if (f.respawnTimer <= 0) {
            respawnFish(f, state.feverTimer > 0);
          }
        }
        continue;
      }

      // Golden shimmer on non-jelly fish during Rainbow Fever Mode!
      if (f.mat && f.typeDef.kind !== "jelly") {
        if (feverActive) {
          f.mat.emissive.setHex(0xffd700);
          f.mat.emissiveIntensity = 0.45 + Math.sin(elapsedSec * 10.0 + i) * 0.12;
        } else {
          f.mat.emissive.setHex(f.colorHex);
          f.mat.emissiveIntensity = 0.16;
        }
      }

      // Super Net Scoop Arc with golden sparkle trail
      if (f.scoopTimer > 0) {
        f.scoopTimer -= dt;
        const t = Math.min(1, 1 - f.scoopTimer / 0.36);
        const destRacer = f.scoopRacer || player;
        f.x = THREE.MathUtils.lerp(f.scoopStart.x, destRacer.boatGroup.position.x, t * 0.65);
        f.z = THREE.MathUtils.lerp(f.scoopStart.z, destRacer.boatGroup.position.z, t * 0.65);
        f.root.position.set(f.x, f.scoopStart.y + Math.sin(t * Math.PI) * 2.6, f.z);
        f.root.rotation.y += dt * 15.0;
        if (Math.random() < 0.6) {
          emitParticleBurst(f.x, f.root.position.y, f.z, 2, 0xffd700, 2.0, 3.0, 0.75);
        }
        if (f.scoopTimer <= 0) {
          completeCatch(destRacer, f);
        }
        continue;
      }

      if (f.hookedBy) {
        f.x = f.hookedBy.bobberPos.x + f.hookedBy.bobberJerkX;
        f.z = f.hookedBy.bobberPos.z + f.hookedBy.bobberJerkZ;
        f.root.position.set(f.x, f.hookedBy.bobberPos.y - 0.1, f.z);
        f.root.rotation.y += dt * (10.0 + f.typeDef.weight * 2.5);
        continue;
      }

      // Rising chest / respawn vertical spring
      if (f.riseYOffset < 0 || Math.abs(f.riseVel) > 0.01) {
        const kRise = 28.0;
        const cRise = 6.5;
        const accY = -kRise * f.riseYOffset - cRise * f.riseVel;
        f.riseVel += accY * dt;
        f.riseYOffset += f.riseVel * dt;
        if (Math.abs(f.riseYOffset) < 0.01 && Math.abs(f.riseVel) < 0.02) {
          f.riseYOffset = 0;
          f.riseVel = 0;
        }
      }

      f.wigglePhase += dt * (4.5 + Math.hypot(f.vx, f.vz));
      if (f.tailMesh) {
        f.tailMesh.rotation.y = Math.sin(f.wigglePhase * 2.2) * 0.42;
      }

      // Velocity integration: drag + propulsion along heading
      f.vx = f.vx * dragFactor + Math.sin(f.heading) * f.speed * 2.2 * dt;
      f.vz = f.vz * dragFactor + Math.cos(f.heading) * f.speed * 2.2 * dt;

      // Swirling Whirlpool Force Field: inward pull ∝ 1/max(r, 1) + tangential swirl, speed capped at 7.0 u/s
      if (whirlpoolActive && f.typeDef.kind !== "jelly") {
        const dx = wpX - f.x;
        const dz = wpZ - f.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 8.2 && dist > 0.05) {
          const rClamped = Math.max(dist, 1.0);
          const nx = dx / dist;
          const nz = dz / dist;
          // Tangential unit vector (-nz, nx) for counter-clockwise vortex orbit
          const tx = -nz;
          const tz = nx;
          const pullMag = (14.5 / rClamped) * dt;
          const swirlMag = (11.0 / Math.sqrt(rClamped)) * dt;
          f.vx += nx * pullMag + tx * swirlMag;
          f.vz += nz * pullMag + tz * swirlMag;
        }
      }

      // Fish-to-Fish Separation (prevents stacking into a single point!)
      for (let j = i + 1; j < state.fishes.length; j++) {
        const o = state.fishes[j];
        if (!o.root.visible || o.hookedBy || o.scoopTimer > 0) continue;
        const sx = f.x - o.x;
        const sz = f.z - o.z;
        const minSep = 0.9 * (f.typeDef.scale + o.typeDef.scale);
        const d = Math.hypot(sx, sz);
        if (d < minSep && d > 0.001) {
          const push = ((minSep - d) / minSep) * 14.0 * dt;
          const ux = sx / d;
          const uz = sz / d;
          f.vx += ux * push;
          f.vz += uz * push;
          o.vx -= ux * push;
          o.vz -= uz * push;
        }
      }

      // Boat Hull Capsule Repulsion (prevents fish & long whales from ever clipping into rival bows!)
      const fishRadius = 0.85 * f.typeDef.scale;
      for (let bIdx = 0; bIdx < state.racers.length; bIdx++) {
        const boat = state.racers[bIdx].boatGroup.position;
        const bdx = f.x - boat.x;
        const bdz = f.z - boat.z;
        const bDist = Math.hypot(bdx, bdz);
        const minHullClear = 2.65 + fishRadius;
        if (bDist < minHullClear && bDist > 0.001) {
          const nx = bdx / bDist;
          const nz = bdz / bDist;
          const pen = minHullClear - bDist;
          f.x += nx * pen;
          f.z += nz * pen;
          const vn = f.vx * nx + f.vz * nz;
          if (vn < 0) {
            f.vx -= 1.8 * vn * nx;
            f.vz -= 1.8 * vn * nz;
          }
          f.vx += nx * 4.5 * dt;
          f.vz += nz * 4.5 * dt;
        }
      }

      // Cap velocity at 7.0 u/s
      const curSpd = Math.hypot(f.vx, f.vz);
      if (curSpd > 7.0) {
        f.vx = (f.vx / curSpd) * 7.0;
        f.vz = (f.vz / curSpd) * 7.0;
      }

      f.x += f.vx * dt;
      f.z += f.vz * dt;

      // Keep inside inner lagoon swim ellipse (10.4 x 7.4) so fish stay clear of outer boat ring
      const normEllip = Math.hypot(f.x / 10.4, (f.z + 0.3) / 7.4);
      if (normEllip > 1.0) {
        const toCenterAngle = Math.atan2(-f.x, -0.3 - f.z) + (Math.random() - 0.5) * 0.45;
        f.heading = toCenterAngle;
        const targetSpd = Math.max(f.speed, curSpd * 0.85);
        f.vx = Math.sin(toCenterAngle) * targetSpd;
        f.vz = Math.cos(toCenterAngle) * targetSpd;
        f.x /= normEllip;
        f.z = (f.z + 0.3) / normEllip - 0.3;
      } else if (curSpd > 0.25) {
        f.heading = Math.atan2(f.vx, f.vz);
      }

      const wy = waveHeight(f.x, f.z, elapsedSec);
      f.root.position.set(
        f.x,
        wy + (f.typeDef.kind === "chest" ? 0.18 : 0.22 + Math.sin(f.wigglePhase) * 0.05) + f.riseYOffset,
        f.z
      );
      f.root.rotation.y = f.heading;
    }

    // Update All 5 Racers (Damped-Spring Boat Heel/Pitch, Lively 3D Critter Hop/Wobble, AI Sector Targeting & Boat Yaw)
    state.racers.forEach((r, idx) => {
      const bx = r.boatGroup.position.x;
      const bz = r.boatGroup.position.z;
      const bWave = waveHeight(bx, bz, elapsedSec);

      // Damped spring integration for boat roll & pitch (θ'' = -kθ - cθ')
      const kSpring = 38.0;
      const cSpring = 5.4;
      r.rollVel += (-kSpring * r.rollAngle - cSpring * r.rollVel) * dt;
      r.rollAngle += r.rollVel * dt;
      r.pitchVel += (-kSpring * r.pitchAngle - cSpring * r.pitchVel) * dt;
      r.pitchAngle += r.pitchVel * dt;

      r.boatGroup.position.y = bWave + 0.34 + Math.sin(elapsedSec * 2.6 + idx * 1.3) * 0.05;
      r.boatGroup.rotation.z = Math.sin(elapsedSec * 2.1 + idx) * 0.028 + r.rollAngle;
      r.boatGroup.rotation.x = r.pitchAngle;

      // Animate 3D Critter figure celebratory hop on catch & dizzy wobble on stun/zap!
      if (r.figureGroup) {
        if (r.hopTimer > 0) {
          r.hopTimer = Math.max(0, r.hopTimer - dt);
          const hopProg = 1 - r.hopTimer / 0.52;
          r.figureGroup.position.y = 1.38 + Math.sin(hopProg * Math.PI) * 0.45;
          r.figureGroup.rotation.y = Math.sin(hopProg * Math.PI * 2) * 0.32;
          r.figureGroup.rotation.z = 0;
        } else if (r.stunTimer > 0 || r.hookState === "zapped") {
          r.figureGroup.position.y = 1.38;
          r.figureGroup.rotation.z = Math.sin(elapsedSec * 22 + idx) * 0.28;
          r.figureGroup.rotation.y = Math.cos(elapsedSec * 16 + idx) * 0.22;
        } else {
          r.figureGroup.position.y = 1.38 + Math.sin(elapsedSec * 3.4 + idx) * 0.03;
          r.figureGroup.rotation.y = Math.sin(elapsedSec * 1.8 + idx) * 0.06;
          r.figureGroup.rotation.z = 0;
        }
      }

      if (!r.isPlayer) {
        // Smoothly yaw rival boat toward active castTarget (clamped near slot's baseRotY)
        let targetYaw = r.baseRotY;
        if (r.hookState !== "idle") {
          const desiredYaw = Math.atan2(r.castTarget.x - bx, r.castTarget.z - bz);
          let diff = desiredYaw - r.baseRotY;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          targetYaw = r.baseRotY + Math.max(-0.46, Math.min(0.46, diff));
        }
        r.boatGroup.rotation.y += (targetYaw - r.boatGroup.rotation.y) * Math.min(1, dt * 5.0);

        if (r.stunTimer > 0) {
          r.stunTimer -= dt;
        } else if (r.hookState === "idle") {
          r.aiCooldown -= dt;
          if (r.aiCooldown <= 0) {
            r.hookState = "casting";
            r.hookTimer = 0;
            r.pitchVel -= 0.55;
            getRodTipWorld(r, r.castFrom);
            selectAiCastTarget(r, stage, elapsedSec, r.castTarget);
            r.bobberPos.copy(r.castFrom);
            r.bobberGroup.visible = true;
            r.lineObj.visible = true;
          }
        }
      }

      if (r.hookState === "casting") {
        r.hookTimer += dt * 2.85;
        const t = Math.min(1, r.hookTimer);
        r.bobberPos.lerpVectors(r.castFrom, r.castTarget, t);
        r.bobberPos.y += Math.sin(t * Math.PI) * 3.8;
        r.bobberJerkX = 0;
        r.bobberJerkZ = 0;
        r.rodMesh.rotation.x = Math.PI * 0.28 - Math.sin(t * Math.PI) * 0.22;
        if (t >= 1) {
          r.hookState = "waiting";
          r.hookTimer = 0;
          spawnSplash(r.bobberPos.x, r.bobberPos.z, r.isPlayer ? 0xffea00 : 0xffffff, 2.5, 16);
          if (r.isPlayer) SFX.splash();
          tryLatchFishForRacer(r, r.isPlayer ? 2.4 : 1.55 + stage.id * 0.04);
        }
      } else if (r.hookState === "waiting") {
        r.hookTimer += dt;
        r.bobberPos.y = waveHeight(r.bobberPos.x, r.bobberPos.z, elapsedSec) + 0.2 + Math.sin(elapsedSec * 5.0 + idx) * 0.05;
        r.bobberJerkX *= Math.exp(-8 * dt);
        r.bobberJerkZ *= Math.exp(-8 * dt);
        r.rodMesh.rotation.x = Math.PI * 0.28;
        r.rodMesh.rotation.z = 0;
        tryLatchFishForRacer(r, r.isPlayer ? 2.25 : 1.50 + stage.id * 0.04);
        const maxWait = r.isPlayer ? 2.8 : 1.75;
        if (r.hookTimer >= maxWait) {
          r.hookState = "reeling";
          r.hookTimer = 0;
        }
      } else if (r.hookState === "reeling") {
        const fishWeight = r.hookedFish ? r.hookedFish.typeDef.weight : 1.0;
        const feverReelBoost = r.isPlayer && feverActive ? 1.35 : 1.0;
        const aiStageReel = 1.35 + stage.id * 0.055;
        const baseReel = (r.isPlayer ? 2.35 : aiStageReel) * feverReelBoost;
        const reelSpeed = baseReel / fishWeight;
        r.hookTimer += dt * reelSpeed;
        const t = Math.min(1, r.hookTimer);

        // Periodic line tension lateral jerks & rod bend scaled by fish weight!
        if (r.hookedFish) {
          r.tugTimer -= dt;
          if (r.tugTimer <= 0) {
            r.tugTimer = 0.16 + Math.random() * 0.12;
            const jerkAmp = 0.22 * fishWeight;
            r.bobberJerkX = (Math.random() - 0.5) * 2 * jerkAmp;
            r.bobberJerkZ = (Math.random() - 0.5) * 2 * jerkAmp;
            r.rollVel += r.bobberJerkX * 0.9;
            r.pitchVel += 0.28 * fishWeight;
          }
          r.bobberJerkX *= Math.exp(-6.0 * dt);
          r.bobberJerkZ *= Math.exp(-6.0 * dt);
          r.rodMesh.rotation.x = Math.PI * 0.28 + 0.14 * fishWeight + Math.sin(elapsedSec * 18) * 0.04 * fishWeight;
          r.rodMesh.rotation.z = r.bobberJerkX * 0.45;
        } else {
          r.bobberJerkX = 0;
          r.bobberJerkZ = 0;
          r.rodMesh.rotation.x = Math.PI * 0.28;
          r.rodMesh.rotation.z = 0;
        }

        getRodTipWorld(r, tmpTip);
        r.bobberPos.lerpVectors(r.castTarget, tmpTip, t);
        r.bobberPos.y = waveHeight(r.bobberPos.x, r.bobberPos.z, elapsedSec) + 0.22 + Math.sin(t * Math.PI) * 1.4;
        if (t >= 1) {
          r.rodMesh.rotation.x = Math.PI * 0.28;
          r.rodMesh.rotation.z = 0;
          r.bobberJerkX = 0;
          r.bobberJerkZ = 0;
          if (r.hookedFish) {
            completeCatch(r, r.hookedFish);
          } else if (!r.isPlayer) {
            const tierMult = r.aiTier ? r.aiTier.scoreMult : 0.85;
            const trickle = Math.round(stage.aiRate * (0.9 + stage.id * 0.08) * tierMult);
            r.score += trickle;
          }
          r.hookState = "idle";
          r.bobberGroup.visible = false;
          r.lineObj.visible = false;
          const cdMult = r.aiTier ? r.aiTier.cdMult : 1.0;
          r.aiCooldown = Math.max(0.75, (2.45 - stage.id * 0.15) * cdMult + Math.random() * 0.35);
        }
      } else if (r.hookState === "zapped") {
        r.hookTimer -= dt;
        r.rodMesh.rotation.z = Math.sin(elapsedSec * 35) * 0.18;
        if (r.hookTimer <= 0) {
          r.rodMesh.rotation.z = 0;
          r.hookState = "idle";
          r.bobberGroup.visible = false;
          r.lineObj.visible = false;
          if (!r.isPlayer) r.aiCooldown = 1.1;
        }
      }

      if (r.bobberGroup.visible) {
        r.bobberGroup.position.set(
          r.bobberPos.x + r.bobberJerkX,
          r.bobberPos.y,
          r.bobberPos.z + r.bobberJerkZ
        );
        getRodTipWorld(r, tmpTip);
        const posArr = r.lineGeo.attributes.position.array;
        posArr[0] = tmpTip.x;
        posArr[1] = tmpTip.y;
        posArr[2] = tmpTip.z;
        posArr[3] = r.bobberGroup.position.x;
        posArr[4] = r.bobberGroup.position.y + 0.2;
        posArr[5] = r.bobberGroup.position.z;
        r.lineGeo.attributes.position.needsUpdate = true;
      }
    });

    if (state.timeLeft <= 0) {
      finishStage();
    }
  }

  function updateVisualEffects(dt, elapsedSec) {
    // 1) Animate Water Vertices
    const posAttr = waterGeo.attributes.position;
    const arr = posAttr.array;
    for (let i = 0; i < arr.length; i += 3) {
      const bx = waterBasePos[i];
      const bz = waterBasePos[i + 2];
      arr[i + 1] = waveHeight(bx, bz, elapsedSec);
    }
    posAttr.needsUpdate = true;
    waterGeo.computeVertexNormals();

    // 2) Update 256-Slot Pooled 3D Particle Burst System (Gravity -18)
    let anyParticleUpdated = false;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particleSlots[i];
      if (!p.active) continue;
      anyParticleUpdated = true;
      p.age += dt;
      if (p.age >= p.maxAge) {
        p.active = false;
        dummyScale.set(0, 0, 0);
        dummyMat4.compose(dummyPos.set(0, -10, 0), dummyQuat, dummyScale);
        particleMesh.setMatrixAt(i, dummyMat4);
      } else {
        p.vy -= 18.0 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        const lifeFrac = 1 - p.age / p.maxAge;
        const sc = p.baseScale * lifeFrac;
        dummyPos.set(p.x, p.y, p.z);
        dummyScale.set(sc, sc, sc);
        dummyMat4.compose(dummyPos, dummyQuat, dummyScale);
        particleMesh.setMatrixAt(i, dummyMat4);
      }
    }
    if (anyParticleUpdated) {
      particleMesh.instanceMatrix.needsUpdate = true;
    }

    // 3) Update Splash Rings
    for (let i = 0; i < splashPool.length; i++) {
      const s = splashPool[i];
      if (!s.active) continue;
      s.age += dt;
      if (s.age >= s.maxAge) {
        s.active = false;
        s.mesh.visible = false;
      } else {
        const p = s.age / s.maxAge;
        const sc = 0.4 + p * s.maxScale;
        s.mesh.position.y = waveHeight(s.x, s.z, elapsedSec) + 0.26;
        s.mesh.scale.set(sc, sc, sc);
        s.mat.opacity = (1 - p) * 0.85;
      }
    }

    // 4) Update 40-Slot Flying Star Coins (Live Target Tracking + Score Count-Up & Chip Bounce on Arrival!)
    for (let i = 0; i < coinPool.length; i++) {
      const c = coinPool[i];
      if (!c.active) continue;
      c.age += dt;
      if (c.racer) {
        if (c.racer.isPlayer) {
          getPlayerHudScoreWorldPoint(c.end);
        } else {
          c.end.set(c.racer.boatGroup.position.x, 2.3, c.racer.boatGroup.position.z);
        }
      }
      if (c.age >= c.dur) {
        c.active = false;
        c.mesh.visible = false;
        if (c.racer && c.ptsChunk > 0) {
          c.racer.score += c.ptsChunk;
          c.racer.pendingScore = Math.max(0, (c.racer.pendingScore || 0) - c.ptsChunk);
          c.ptsChunk = 0;
          if (c.racer.isPlayer) {
            SFX.coinTick(c.stepIndex || 0);
            const entry = leaderboardChips[0];
            if (entry && entry.chip) {
              entry.chip.style.transform = "scale(1.16)";
              setTimeout(() => {
                if (entry.chip) entry.chip.style.transform = "";
              }, 110);
            }
          }
        }
      } else {
        const t = c.age / c.dur;
        c.mesh.position.lerpVectors(c.start, c.end, t);
        c.mesh.position.y += Math.sin(t * Math.PI) * 3.0;
        c.mesh.rotation.y += dt * 11;
        c.mesh.rotation.z += dt * 5;
      }
    }

    // 5) Trauma-Based Camera Shake (Smooth Time-Based 17/23/31 Hz Sine Noise + Rotation Offsets after lookAt!)
    const kCam = 42.0;
    const cCam = 7.0;
    state.camKickVel.x += (-kCam * state.camKick.x - cCam * state.camKickVel.x) * dt;
    state.camKickVel.y += (-kCam * state.camKick.y - cCam * state.camKickVel.y) * dt;
    state.camKickVel.z += (-kCam * state.camKick.z - cCam * state.camKickVel.z) * dt;
    state.camKick.addScaledVector(state.camKickVel, dt);

    camera.position.copy(baseCamPos).add(state.camKick);
    camera.lookAt(baseCamLook);

    if (state.trauma > 0) {
      state.trauma = Math.max(0, state.trauma - 1.4 * dt);
      const shake = state.trauma * state.trauma;
      const ph = state.shakePhase;
      const w1 = elapsedSec * 17.0 * Math.PI * 2;
      const w2 = elapsedSec * 23.0 * Math.PI * 2;
      const w3 = elapsedSec * 31.0 * Math.PI * 2;

      const noiseYaw = (Math.sin(w1 + ph) * 0.5 + Math.sin(w2 + ph * 1.7) * 0.35 + Math.cos(w3 + ph * 2.3) * 0.15);
      const noisePitch = (Math.cos(w1 + ph * 1.3) * 0.5 + Math.sin(w3 + ph * 0.7) * 0.35 + Math.cos(w2 + ph * 2.1) * 0.15);
      const noiseRoll = (Math.sin(w2 + ph * 0.9) * 0.55 + Math.cos(w3 + ph * 1.5) * 0.45);

      camera.rotation.y += noiseYaw * 0.025 * shake;
      camera.rotation.x += noisePitch * 0.025 * shake;
      camera.rotation.z += noiseRoll * 0.04 * shake;
    }

    orientBillboards();
  }

  // Zero-Churn HUD & Leaderboard Update
  const RANK_MEDALS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
  const RANK_STARS = ["⭐⭐⭐", "⭐⭐", "⭐", "0⭐", "0⭐"];

  function getSortedStandings() {
    return state.racers
      .slice()
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.score > 0 && (b.catches || 0) !== (a.catches || 0)) {
          return (b.catches || 0) - (a.catches || 0);
        }
        if (a.isPlayer && a.score === 0) return 1;
        if (b.isPlayer && b.score === 0) return -1;
        return a.slotIndex - b.slotIndex;
      });
  }

  const markerBronzeEl = document.querySelector(".m-bronze");
  const markerSilverEl = document.querySelector(".m-silver");
  const markerGoldEl = document.querySelector(".m-gold");
  const btnAimLeftEl = document.getElementById("btn-aim-left");
  const btnAimRightEl = document.getElementById("btn-aim-right");
  const pedalBtnEls = [
    document.getElementById("pedal-1"),
    document.getElementById("pedal-2"),
    document.getElementById("pedal-3")
  ];

  function flashButtonPress(el, durationMs) {
    if (!el) return;
    el.classList.add("pressed");
    setTimeout(() => {
      el.classList.remove("pressed");
    }, durationMs || 140);
  }

  function updateHUD() {
    const stage = STAGES[state.stageIndex];
    const pctTime = Math.max(0, Math.min(100, (state.timeLeft / state.duration) * 100));
    timerFillEl.style.width = `${pctTime}%`;
    timerNumEl.textContent = String(Math.ceil(state.timeLeft));

    const player = state.racers[0];
    const pScore = player ? player.score : 0;
    const scorePct = Math.min(100, (pScore / stage.targetScore) * 100);
    playerScoreNumEl.textContent = String(pScore);
    scoreFillEl.style.width = `${scorePct}%`;

    // Dynamic reached classes on bronze / silver / gold gauge markers
    if (markerBronzeEl) markerBronzeEl.classList.toggle("reached", scorePct >= 45);
    if (markerSilverEl) markerSilverEl.classList.toggle("reached", scorePct >= 72);
    if (markerGoldEl) markerGoldEl.classList.toggle("reached", scorePct >= 94);

    // Rainbow Fever active state on cockpit & combo pill
    const feverActive = state.feverTimer > 0;
    feverFillEl.style.width = `${Math.min(100, state.fever)}%`;
    comboBadgeEl.textContent = feverActive ? "🌈x2" : `x${state.combo}`;
    comboBadgeEl.classList.toggle("fever-pill", feverActive);
    if (bottomCockpitEl) {
      bottomCockpitEl.classList.toggle("fever-active", feverActive);
    }

    if (player && (player.hookState === "waiting" || player.hookState === "reeling")) {
      castBtnEl.classList.add("reeling");
      castIconEl.textContent = "🌀";
    } else {
      castBtnEl.classList.remove("reeling");
      castIconEl.textContent = "🎣";
    }

    // Power Pedals: .is-active, .is-ready, .on-cooldown + cooldown height overlay
    state.pedals.forEach((p, idx) => {
      const btn = pedalBtnEls[idx];
      if (!btn) return;
      const isAct = p.activeTimer > 0;
      const isCd = p.cd > 0 && !isAct;
      const isRdy = p.cd <= 0 && !isAct;
      btn.classList.toggle("is-active", isAct);
      btn.classList.toggle("on-cooldown", isCd);
      btn.classList.toggle("is-ready", isRdy);
      const ov = btn.querySelector(".pedal-cd-overlay");
      if (ov) {
        ov.style.height = `${(p.cd / p.maxCd) * 100}%`;
      }
    });

    const sorted = getSortedStandings();
    const maxScore = Math.max(stage.targetScore, sorted[0] ? sorted[0].score : 1);
    sorted.forEach((r, rankIdx) => {
      const entry = leaderboardChips[r.slotIndex];
      if (!entry) return;
      const w = Math.max(10, Math.min(100, Math.round((r.score / maxScore) * 100)));
      entry.chip.style.order = String(rankIdx);
      entry.medalSpan.textContent = RANK_MEDALS[rankIdx];
      entry.barFill.style.width = `${w}%`;
      entry.scoreSpan.textContent = String(r.score);
    });
  }

  function renderStageRail() {
    stageRailEl.innerHTML = STAGES.map((s, idx) => {
      const unlocked = idx <= state.unlockedStage;
      const active = idx === state.stageIndex;
      const stars = state.stageStars[idx] || 0;
      return `
        <button class="rail-pill ${active ? "active" : ""} ${unlocked ? "" : "locked"}" data-stage="${idx}" aria-label="Stage ${idx + 1}">
          <span>${unlocked ? s.icon : "🔒"}</span>
          ${stars > 0 ? `<span class="rail-stars">${"⭐".repeat(stars)}</span>` : ""}
        </button>
      `;
    }).join("");

    stageRailEl.querySelectorAll(".rail-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-stage"));
        if (idx <= state.unlockedStage) {
          startStage(idx);
        }
      });
    });
  }

  let critterCardBtns = [];
  let stageCardBtns = [];

  function initMenuPickers() {
    critterPickerEl.innerHTML = "";
    critterCardBtns = CRITTERS.map((c, idx) => {
      const btn = document.createElement("button");
      btn.className = `picker-card ${idx === state.critterIndex ? "selected" : ""}`;
      btn.setAttribute("data-critter", String(idx));
      btn.setAttribute("aria-label", c.name);
      btn.title = c.name;
      btn.innerHTML = `<img src="${c.icon}" alt="${c.name}" /><span class="picker-emoji">${c.emoji}</span>`;
      btn.addEventListener("click", () => selectCritter(idx));
      critterPickerEl.appendChild(btn);
      return btn;
    });

    stagePickerEl.innerHTML = "";
    stageCardBtns = STAGES.map((s, idx) => {
      const btn = document.createElement("button");
      btn.className = "picker-card";
      btn.setAttribute("data-stage", String(idx));
      btn.setAttribute("aria-label", `Lagoon ${idx + 1}`);
      btn.addEventListener("click", () => {
        if (idx <= state.unlockedStage) selectStage(idx);
      });
      stagePickerEl.appendChild(btn);
      return btn;
    });

    syncMenuPickersState();
  }

  function syncMenuPickersState() {
    critterCardBtns.forEach((btn, idx) => {
      btn.classList.toggle("selected", idx === state.critterIndex);
    });
    stageCardBtns.forEach((btn, idx) => {
      const unlocked = idx <= state.unlockedStage;
      const stars = state.stageStars[idx] || 0;
      btn.classList.toggle("selected", idx === state.stageIndex);
      btn.classList.toggle("locked", !unlocked);
      btn.innerHTML = `
        <span class="picker-emoji">${unlocked ? STAGES[idx].icon : "🔒"}</span>
        <span class="picker-stars">${stars > 0 ? "⭐".repeat(stars) : "☆☆☆"}</span>
      `;
    });
  }

  function finishStage(forcedRank) {
    flushAllPendingCoins();
    resetTransientPoolsAndVFX();
    state.mode = "podium";

    if (typeof forcedRank === "number" && forcedRank >= 1 && forcedRank <= 5) {
      const player = state.racers[0];
      const others = state.racers.slice(1);
      others.forEach((o, idx) => {
        o.score = 1200 - idx * 220;
        o.catches = Math.max(1, 12 - idx * 2);
      });
      if (forcedRank === 1) {
        player.score = 1550;
        player.catches = 16;
      } else if (forcedRank === 2) {
        player.score = 1100;
        player.catches = 11;
      } else if (forcedRank === 3) {
        player.score = 880;
        player.catches = 9;
      } else if (forcedRank === 4) {
        player.score = 650;
        player.catches = 6;
      } else {
        player.score = 220;
        player.catches = 2;
      }
    }

    const finalStandings = getSortedStandings();
    const playerRank = finalStandings.findIndex((r) => r.isPlayer) + 1;
    const starsEarned = playerRank === 1 ? 3 : playerRank === 2 ? 2 : playerRank === 3 ? 1 : 0;
    const qualified = playerRank <= 3;

    state.lastRank = playerRank;
    state.lastStars = starsEarned;

    if (qualified) {
      state.stageStars[state.stageIndex] = Math.max(state.stageStars[state.stageIndex] || 0, starsEarned);
      if (state.stageIndex < STAGES.length - 1) {
        state.unlockedStage = Math.max(state.unlockedStage, state.stageIndex + 1);
      }
      progress.unlockedStage = state.unlockedStage;
      progress.stars = state.stageStars.slice();
      saveProgress(progress);
    }

    const podiumCardEl = overlayPodium.querySelector(".podium-card");
    const podiumBannerEl = document.getElementById("podium-status-banner");
    overlayPodium.classList.toggle("is-defeat", !qualified);
    overlayPodium.classList.toggle("is-victory", qualified);
    if (podiumCardEl) {
      podiumCardEl.classList.toggle("is-defeat", !qualified);
      podiumCardEl.classList.toggle("is-victory", qualified);
    }
    if (podiumBannerEl) {
      podiumBannerEl.classList.toggle("is-defeat", !qualified);
      podiumBannerEl.classList.toggle("is-victory", qualified);
    }

    podiumMedalEl.textContent = RANK_MEDALS[playerRank - 1] || "5️⃣";
    podiumStarsEl.textContent = starsEarned > 0 ? "⭐".repeat(starsEarned) : "😢 💔 0⭐";
    btnNextStage.style.display = qualified && state.stageIndex < STAGES.length - 1 ? "flex" : "none";

    podiumStandingsEl.innerHTML = finalStandings
      .map((r, i) => {
        const rowQualClass = i < 3 ? "qualified" : "eliminated";
        const rowStars = RANK_STARS[i] || "0⭐";
        const catchCount = r.catches || 0;
        return `
        <div class="podium-row ${rowQualClass} ${r.isPlayer ? "is-player" : ""}" data-rank="${i + 1}">
          <div class="podium-row-left">
            <span class="emoji-icon">${RANK_MEDALS[i]}</span>
            <img src="${r.critter.icon}" alt="${r.critter.name}" />
            <span class="emoji-icon">${r.critter.emoji}</span>
            <span class="podium-row-stars ${i < 3 ? "stars-qual" : "stars-elim"}">${rowStars}</span>
          </div>
          <div class="podium-row-right">
            <span class="podium-catches" title="Fish Caught">🎣 ${catchCount}</span>
            <span class="hud-num">🐟 ${r.score}</span>
          </div>
        </div>
      `;
      })
      .join("");

    overlayMenu.classList.remove("active");
    overlayPodium.classList.add("active");
    updateStaticStageBadge();
    syncMenuPickersState();
    updateHUD();
    renderStageRail();
    SFX.fanfare(qualified);
  }

  function selectCritter(idx) {
    if (idx < 0 || idx >= CRITTERS.length) return;
    state.critterIndex = idx;
    progress.selectedCritter = idx;
    saveProgress(progress);

    const critter = CRITTERS[idx];
    const player = state.racers[0];
    if (player) {
      player.critter = critter;
      player.hullMat.color.setHex(critter.color);
      player.bodyMat.color.setHex(critter.bodyColor);
      player.trimMat.color.setHex(critter.boatTrim);
      player.portraitMat.map = critterTextures[critter.id] || fallbackTextures[critter.id];
      player.portraitMat.needsUpdate = true;
      if (player.figureGroup) {
        player.boatGroup.remove(player.figureGroup);
      }
      player.figureGroup = buildCritterFigure(critter, player.bodyMat, player.trimMat);
      player.boatGroup.add(player.figureGroup);
      if (leaderboardChips[0] && leaderboardChips[0].img) {
        leaderboardChips[0].img.src = critter.icon;
        leaderboardChips[0].img.alt = critter.name;
      }
    }
    updateStaticStageBadge();
    syncMenuPickersState();
    orientBillboards();
  }

  function selectStage(idx) {
    if (idx < 0 || idx >= STAGES.length || idx > state.unlockedStage) return;
    state.stageIndex = idx;
    setupStage(idx);
    syncMenuPickersState();
  }

  function startStage(idx) {
    const targetIdx = typeof idx === "number" ? Math.max(0, Math.min(state.unlockedStage, idx)) : state.stageIndex;
    setupStage(targetIdx);
    state.mode = "playing";
    overlayMenu.classList.remove("active");
    overlayPodium.classList.remove("active", "is-defeat", "is-victory");
    fitCamera();
  }

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  const waterPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hitPoint = new THREE.Vector3();

  function updateAimFromClientXY(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);
    if (raycaster.ray.intersectPlane(waterPlane, hitPoint)) {
      state.aimX = Math.max(-11.8, Math.min(11.8, hitPoint.x));
      state.aimZ = Math.max(-8.4, Math.min(7.2, hitPoint.z));
    }
  }

  canvas.addEventListener("pointermove", (e) => {
    if (state.mode !== "playing") return;
    updateAimFromClientXY(e.clientX, e.clientY);
  });

  canvas.addEventListener("pointerdown", (e) => {
    if (state.mode !== "playing") return;
    updateAimFromClientXY(e.clientX, e.clientY);
    flashButtonPress(castBtnEl, 140);
    triggerPlayerCastOrReel();
  });

  window.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
      state.keys.left = true;
      if (btnAimLeftEl) btnAimLeftEl.classList.add("pressed");
    } else if (e.code === "ArrowRight" || e.code === "KeyD") {
      state.keys.right = true;
      if (btnAimRightEl) btnAimRightEl.classList.add("pressed");
    } else if (e.code === "ArrowUp" || e.code === "KeyW") state.keys.up = true;
    else if (e.code === "ArrowDown" || e.code === "KeyS") state.keys.down = true;
    else if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      flashButtonPress(castBtnEl, 140);
      if (state.mode === "menu") startStage(state.stageIndex);
      else if (state.mode === "playing") triggerPlayerCastOrReel();
      else if (state.mode === "podium") {
        const qualified = state.lastRank >= 1 && state.lastRank <= 3;
        if (qualified && state.stageIndex < STAGES.length - 1 && state.stageIndex + 1 <= state.unlockedStage) {
          startStage(state.stageIndex + 1);
        } else {
          startStage(state.stageIndex);
        }
      }
    } else if (e.code === "Digit1" || e.code === "Numpad1") {
      flashButtonPress(pedalBtnEls[0], 150);
      activatePedal(0);
      updateHUD();
    } else if (e.code === "Digit2" || e.code === "Numpad2") {
      flashButtonPress(pedalBtnEls[1], 150);
      activatePedal(1);
      updateHUD();
    } else if (e.code === "Digit3" || e.code === "Numpad3") {
      flashButtonPress(pedalBtnEls[2], 150);
      activatePedal(2);
      updateHUD();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
      state.keys.left = false;
      if (btnAimLeftEl) btnAimLeftEl.classList.remove("pressed");
    } else if (e.code === "ArrowRight" || e.code === "KeyD") {
      state.keys.right = false;
      if (btnAimRightEl) btnAimRightEl.classList.remove("pressed");
    } else if (e.code === "ArrowUp" || e.code === "KeyW") state.keys.up = false;
    else if (e.code === "ArrowDown" || e.code === "KeyS") state.keys.down = false;
  });

  function bindHoldButton(btnId, keyProp) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const stop = () => {
      state.keys[keyProp] = false;
      btn.classList.remove("pressed");
    };
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      state.keys[keyProp] = true;
      btn.classList.add("pressed");
    });
    btn.addEventListener("pointerup", stop);
    btn.addEventListener("pointercancel", stop);
    btn.addEventListener("pointerleave", stop);
  }
  bindHoldButton("btn-aim-left", "left");
  bindHoldButton("btn-aim-right", "right");

  castBtnEl.addEventListener("pointerdown", () => castBtnEl.classList.add("pressed"));
  castBtnEl.addEventListener("pointerup", () => castBtnEl.classList.remove("pressed"));
  castBtnEl.addEventListener("pointerleave", () => castBtnEl.classList.remove("pressed"));
  castBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    flashButtonPress(castBtnEl, 140);
    triggerPlayerCastOrReel();
  });

  [0, 1, 2].forEach((idx) => {
    const btn = pedalBtnEls[idx];
    if (btn) {
      btn.addEventListener("pointerdown", () => btn.classList.add("pressed"));
      btn.addEventListener("pointerup", () => btn.classList.remove("pressed"));
      btn.addEventListener("pointerleave", () => btn.classList.remove("pressed"));
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        flashButtonPress(btn, 150);
        activatePedal(idx);
        updateHUD();
      });
    }
  });

  btnPlay.addEventListener("click", () => startStage(state.stageIndex));
  document.getElementById("btn-retry").addEventListener("click", () => startStage(state.stageIndex));
  btnNextStage.addEventListener("click", () => {
    if (state.stageIndex < STAGES.length - 1 && state.stageIndex + 1 <= state.unlockedStage) {
      startStage(state.stageIndex + 1);
    }
  });

  document.getElementById("btn-home").addEventListener("click", () => {
    flushAllPendingCoins();
    resetTransientPoolsAndVFX();
    state.mode = "menu";
    syncMenuPickersState();
    overlayPodium.classList.remove("active", "is-defeat", "is-victory");
    overlayMenu.classList.add("active");
    updateHUD();
  });

  document.getElementById("btn-audio").addEventListener("click", () => {
    SFX.muted = !SFX.muted;
    document.getElementById("audio-icon").textContent = SFX.muted ? "🔇" : "🔊";
  });

  window.addEventListener("blur", clearHeldInputs);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearHeldInputs();
  });
  window.addEventListener("resize", fitCamera);
  window.addEventListener("orientationchange", () => {
    setTimeout(fitCamera, 80);
  });

  // Initialize Scene & Menu
  initMenuPickers();
  setupStage(0);
  fitCamera();

  let lastTime = performance.now();
  let hudTick = 0;

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    totalElapsed += dt;

    updateSimulation(dt, totalElapsed);
    updateVisualEffects(dt, totalElapsed);

    hudTick += dt;
    if (hudTick >= 0.1) {
      hudTick = 0;
      updateHUD();
    }

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  // Expose QA & Automation Hook
  window.critterGame = {
    state,
    CRITTERS,
    STAGES,
    renderer,
    scene,
    camera,
    waveHeight,
    fitCamera,
    orientBillboards,
    deltaE76,
    addTrauma,
    selectCritter,
    selectStage,
    startStage,
    castOrReel: triggerPlayerCastOrReel,
    aimAt(x, z) {
      state.aimX = Math.max(-11.8, Math.min(11.8, x));
      state.aimZ = Math.max(-8.4, Math.min(7.2, z));
    },
    usePedal: activatePedal,
    forceFinish: finishStage,
    fastForward(seconds, botStrategy) {
      const steps = Math.max(1, Math.round(seconds * 30));
      const stepDt = seconds / steps;
      for (let i = 0; i < steps; i++) {
        if (state.mode !== "playing") break;
        totalElapsed += stepDt;
        if (botStrategy === "skilled") {
          const player = state.racers[0];
          if (player && player.hookState === "idle") {
            const best = state.fishes
              .filter((f) => f.root.visible && !f.hookedBy && f.scoopTimer <= 0 && f.typeDef.kind !== "jelly")
              .sort((a, b) => b.typeDef.points - a.typeDef.points)[0];
            if (best) {
              state.aimX = best.x;
              state.aimZ = best.z;
            }
            triggerPlayerCastOrReel();
          } else if (player && player.hookState === "reeling" && i % 3 === 0) {
            triggerPlayerCastOrReel();
          }
          if (state.pedals[0].cd <= 0) activatePedal(0);
          if (state.pedals[1].cd <= 0) activatePedal(1);
        } else if (botStrategy === "pedalsOnly") {
          if (state.pedals[0].cd <= 0) activatePedal(0);
          if (state.pedals[1].cd <= 0) activatePedal(1);
          if (state.pedals[2].cd <= 0) activatePedal(2);
        }
        updateSimulation(stepDt, totalElapsed);
        updateVisualEffects(stepDt, totalElapsed);
      }
      updateHUD();
      renderer.render(scene, camera);
      return this.getSnapshot();
    },
    getSnapshot() {
      return {
        mode: state.mode,
        stageIndex: state.stageIndex,
        critterIndex: state.critterIndex,
        unlockedStage: state.unlockedStage,
        stageStars: state.stageStars.slice(),
        timeLeft: Number(state.timeLeft.toFixed(2)),
        lastRank: state.lastRank,
        lastStars: state.lastStars,
        trauma: Number(state.trauma.toFixed(3)),
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        standings: getSortedStandings().map((r, i) => ({
          rank: i + 1,
          id: r.critter.id,
          name: r.critter.name,
          isPlayer: r.isPlayer,
          score: r.score,
          pendingScore: r.pendingScore || 0,
          catches: r.catches
        }))
      };
    }
  };
})();
