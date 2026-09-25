/**
 * Particle wordmark.
 *
 * Renders text into an offscreen canvas, samples it on a grid, and draws each
 * sample as a dot. Dots are pushed away from the pointer and spring back home.
 * The loop sleeps when everything is at rest, so an idle page costs nothing.
 *
 *   ParticleWordmark(el, { lines: ["CALLUM THOMAS"], family: '"Inter Tight"', ... })
 *
 * The element gets its height from the text, so give it a width and let it be.
 */
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Screenshot hooks for the mockups: ?still skips the intro, ?poke=0.4,0.5
  // parks a fake cursor at that fraction of the wordmark, ?intro=0.3 freezes
  // the depth intro at that point in its timeline.
  const q = new URLSearchParams(location.search);

  function ParticleWordmark(el, options) {
    const o = Object.assign(
      {
        lines: ["CALLUM THOMAS"],
        narrowLines: ["CALLUM", "THOMAS"],
        narrowBelow: 640,
        family: '"Inter Tight", system-ui, sans-serif',
        weight: 800,
        tracking: -0.02, // em
        lineGap: 0.16, // em, between lines
        pad: 18, // px around the text so scattered dots have room
        gap: 6, // px between samples
        dot: 1.9, // dot radius (or half-size for squares)
        shape: "circle",
        color: "#161614",
        hot: "#F0461E", // colour of a displaced dot
        radius: 96, // pointer influence radius
        force: 5.5,
        spring: 0.055,
        damping: 0.84,
        ring: true,
        ringColor: null,
        intro: "scatter", // "scatter" | "rain" | "depth" | false
        // Material fatigue. Stirring the word wears it out: the springs go
        // soft (slower and slower recovery) and the most stressed dots yield,
        // settling on the nearest free grid spot for good. Off by default.
        entropy: false,
        yieldMin: 26, // stress every dot can take before it might yield
        yieldMean: 70, // mean extra stress on top of that (exponential spread)
        maxYield: 0.12, // never let more than this share of dots go
        maxDrift: 2, // a yielded dot settles at most this many grid spots from home
        wearHalfLife: 30000, // ms for wear to halve when left alone
        onEntropy: null, // ({ moved, total, wear }) => void
      },
      options
    );

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.touchAction = "pan-y";
    el.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let W = 0,
      H = 0,
      dpr = 1,
      pts = [],
      raf = 0,
      builtFor = -1,
      visible = false,
      introPending = !!o.intro && !reduced && !q.has("still") && !q.has("poke");
    const ptr = { x: -9999, y: -9999, inside: false };
    // Fatigue state: grid geometry for snapping, and which grid spots are taken.
    let gx0 = 0,
      gy0 = 0,
      cols = 0,
      rows = 0,
      occ = new Set(),
      wear = 0,
      wearAt = 0,
      moved = 0,
      pending = 0; // yielded, still coasting, not yet settled
    const key = (x, y) => Math.round((y - gy0) / o.gap) * 100000 + Math.round((x - gx0) / o.gap);
    const stressLimit = () => o.yieldMin - Math.log(1 - Math.random()) * o.yieldMean;

    function build() {
      const width = Math.round(el.clientWidth);
      if (!width || width === builtFor) return;
      builtFor = width;
      const lines = width < o.narrowBelow ? o.narrowLines : o.lines;

      // Fit the widest line to the available width.
      const m = document.createElement("canvas").getContext("2d");
      const setFont = (px) => {
        m.font = `${o.weight} ${px}px ${o.family}`;
        if ("letterSpacing" in m) m.letterSpacing = `${o.tracking * px}px`;
      };
      setFont(100);
      const widest = Math.max(...lines.map((l) => m.measureText(l).width));
      const size = Math.floor((100 * (width - o.pad * 2)) / widest);
      setFont(size);
      const probe = m.measureText("H");
      const cap = Math.ceil(probe.actualBoundingBoxAscent);
      const gapPx = Math.round(o.lineGap * size);

      W = width;
      H = cap * lines.length + gapPx * (lines.length - 1) + o.pad * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.height = H + "px";

      // Draw the text once, then sample it.
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const c = off.getContext("2d");
      c.font = `${o.weight} ${size}px ${o.family}`;
      if ("letterSpacing" in c) c.letterSpacing = `${o.tracking * size}px`;
      c.fillStyle = "#000";
      c.textBaseline = "alphabetic";
      c.textAlign = "center";
      lines.forEach((line, i) => {
        c.fillText(line, W / 2, o.pad + cap + i * (cap + gapPx));
      });
      const data = c.getImageData(0, 0, W, H).data;

      pts = [];
      const g = o.gap;
      const x0 = ((W % g) + g) / 2;
      gx0 = x0;
      gy0 = g / 2;
      cols = Math.floor((W - x0) / g) + 1;
      rows = Math.floor((H - gy0) / g) + 1;
      wear = 0;
      moved = 0;
      pending = 0;
      // Only keep samples inside each line's cap band, so the overshoot of
      // round letters (C, O, S) doesn't leave stray dots below the baseline.
      const bands = lines.map((_, i) => {
        const base = o.pad + cap + i * (cap + gapPx);
        return [base - cap - 0.5, base + 0.5];
      });
      const inBand = (y) => bands.some(([a, b]) => y >= a && y <= b);
      for (let y = g / 2; y < H; y += g) {
        if (!inBand(y)) continue;
        for (let x = x0; x < W; x += g) {
          if (data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3] > 110) {
            pts.push({ hx: x, hy: y, ox: x, oy: y, x, y, vx: 0, vy: 0, s: 0, lim: stressLimit(), free: false, moved: false });
          }
        }
      }

      occ = new Set(pts.map((p) => key(p.hx, p.hy)));
      if (introPending && o.intro === "depth") {
        for (const p of pts) p.d = Math.random(); // each dot's small head start
      } else if (introPending) {
        for (const p of pts) {
          if (o.intro === "rain") {
            p.x = p.hx + (Math.random() - 0.5) * 30;
            p.y = p.hy - H - Math.random() * H * 1.5;
          } else {
            p.x = Math.random() * W;
            p.y = Math.random() * H;
          }
        }
      }
      if (introPending && o.intro === "depth") renderIntro(q.has("intro") ? Number(q.get("intro")) : 0);
      else draw();
      if (visible && introPending && !q.has("intro")) start();
      if (q.has("stir") && o.entropy) {
        const n = Number(q.get("stir")) || 1;
        for (let i = 0; i < n; i++) {
          const yf = 0.3 + 0.4 * ((i * 0.37) % 1);
          for (let t = 0; t <= 1; t += 0.012) {
            const x = (i % 2 ? 1 - t : t) * W,
              y = H * (yf + 0.18 * Math.sin(t * 9 + i));
            const px = ptr.x;
            Object.assign(ptr, { x, y, inside: true });
            if (t > 0) stir(Math.abs(x - px) + 3);
            step();
          }
        }
        ptr.inside = false;
        for (let i = 0; i < 6000 && step() > 0.03; i++);
        draw();
        report();
      }
      if (q.has("poke")) {
        const [fx, fy] = q.get("poke").split(",").map(Number);
        Object.assign(ptr, { x: fx * W, y: fy * H, inside: true });
        for (let i = 0; i < 14; i++) step();
        draw();
      }
    }

    // Wear heals on its own: it halves every wearHalfLife ms of being left alone.
    function heal() {
      const now = performance.now();
      if (wearAt) wear *= Math.pow(0.5, (now - wearAt) / o.wearHalfLife);
      wearAt = now;
    }

    // The pointer travelling through the word is what wears it out.
    function stir(dist) {
      if (!o.entropy) return;
      heal();
      wear = Math.min(1, wear + dist / (W * 10));
    }

    let reported = false;
    function report() {
      if (!o.onEntropy || reported) return;
      reported = true;
      setTimeout(() => {
        reported = false;
        o.onEntropy({ moved, total: pts.length, wear });
      }, 120);
    }

    // A yielded dot has come to rest: give it the nearest free grid spot, for good.
    // It moves in the direction it was pushed, but never more than maxDrift
    // spots from home, so the letters deform rather than scatter.
    function settle(p) {
      p.free = false;
      pending--;
      const lim = o.maxDrift,
        clamp = (v) => Math.max(-lim, Math.min(lim, v));
      const cx = Math.round((p.ox - gx0) / o.gap) + clamp(Math.round((p.x - p.ox) / o.gap)),
        cy = Math.round((p.oy - gy0) / o.gap) + clamp(Math.round((p.y - p.oy) / o.gap));
      for (let r = 0; r <= 2; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const ix = cx + dx,
              iy = cy + dy;
            if (ix < 0 || iy < 0 || ix >= cols || iy >= rows) continue;
            const nx = gx0 + ix * o.gap,
              ny = gy0 + iy * o.gap,
              k = key(nx, ny);
            if (occ.has(k) && k !== key(p.hx, p.hy)) continue; // its own spot counts as free
            occ.delete(key(p.hx, p.hy));
            occ.add(k);
            p.hx = nx;
            p.hy = ny;
            const was = p.moved;
            p.moved = nx !== p.ox || ny !== p.oy;
            moved += (p.moved ? 1 : 0) - (was ? 1 : 0);
            p.s = 0;
            p.lim = stressLimit() * 1.5; // a dot that has moved once is sturdier
            report();
            return;
          }
        }
      }
      // Nowhere free nearby: it limps home after all.
    }

    // Returns the largest remaining offset or speed, so the loop knows when to sleep.
    function step() {
      const R = o.radius,
        R2 = R * R;
      // Springs go soft as the word wears: from snappy to honey-slow.
      const k = o.entropy ? o.spring * (1 - 0.94 * wear) : o.spring;
      const canYield = o.entropy && moved + pending < pts.length * o.maxYield;
      let worst = 0;
      for (const p of pts) {
        if (ptr.inside) {
          const dx = p.x - ptr.x,
            dy = p.y - ptr.y,
            d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / R) * o.force;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
            // Every hit adds stress, and a worn word takes more of it.
            if (o.entropy && !p.free) p.s += f * (0.25 + wear);
          }
        }
        if (p.free) {
          // Yielded: no spring any more, it just coasts to a stop.
          p.vx *= o.damping;
          p.vy *= o.damping;
        } else {
          p.vx = (p.vx + (p.hx - p.x) * k) * o.damping;
          p.vy = (p.vy + (p.hy - p.y) * k) * o.damping;
        }
        p.x += p.vx;
        p.y += p.vy;
        const off = Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y),
          speed = Math.abs(p.vx) + Math.abs(p.vy);
        if (p.free) {
          if (speed < 0.08) settle(p);
          worst = Math.max(worst, 1);
          continue;
        }
        // Stress relaxes between hits. Only sustained abuse gets past a dot's limit.
        if (o.entropy) {
          p.s *= 0.97;
          if (canYield && p.s > p.lim) {
            p.free = true;
            pending++;
          }
        }
        worst = Math.max(worst, off * 0.1, speed);
      }
      return worst;
    }

    // Put every dot back where it started, and forget the wear.
    function restore() {
      for (const p of pts) {
        p.hx = p.ox;
        p.hy = p.oy;
        p.free = false;
        p.moved = false;
        p.s = 0;
        p.lim = stressLimit();
      }
      occ = new Set(pts.map((p) => key(p.hx, p.hy)));
      wear = 0;
      moved = 0;
      pending = 0;
      report();
      start();
    }

    function dotPath(path, x, y, r) {
      if (o.shape === "square") path.rect(x - r, y - r, r * 2, r * 2);
      else {
        path.moveTo(x + r, y);
        path.arc(x, y, r, 0, Math.PI * 2);
      }
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const rest = new Path2D(),
        hot = new Path2D();
      for (const p of pts) {
        const off = Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y);
        dotPath(off > 2.5 || p.moved || p.free ? hot : rest, p.x, p.y, o.dot);
      }
      ctx.fillStyle = o.color;
      ctx.fill(rest);
      ctx.fillStyle = o.hot;
      ctx.fill(hot);

      if (o.ring && ptr.inside) {
        ctx.strokeStyle = o.ringColor || o.color;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, o.radius * 0.42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = o.ringColor || o.color;
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // "depth" intro: the whole word glides forward from a distance (small,
    // soft, faint) while each dot fades in with a slight random lag. Pure
    // easing, no springs, so nothing overshoots or bounces.
    const DUR = o.introDuration || 1900,
      LAG = 0.35; // max per-dot delay, as a fraction of DUR
    const ease = (x) => 1 - Math.pow(1 - x, 4);
    let t0 = 0;

    function renderIntro(k) {
      const g = ease(Math.min(k, 1));
      canvas.style.transform = `scale(${0.8 + 0.2 * g})`;
      canvas.style.filter = g < 0.999 ? `blur(${(1 - g) * 7}px)` : "";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = o.color;
      const buckets = Array.from({ length: 9 }, () => new Path2D());
      for (const p of pts) {
        const a = ease(Math.max(0, Math.min(1, (k * (1 + LAG) - p.d * LAG) / 1)));
        if (a <= 0) continue;
        dotPath(buckets[Math.round(a * 8)], p.x, p.y, o.dot * (0.5 + 0.5 * a));
      }
      buckets.forEach((path, i) => {
        if (!i) return;
        ctx.globalAlpha = i / 8;
        ctx.fill(path);
      });
      ctx.globalAlpha = 1;
    }

    function introFrame(now) {
      if (!t0) t0 = now;
      const k = (now - t0) / DUR;
      if (k < 1) {
        renderIntro(k);
        raf = requestAnimationFrame(introFrame);
        return;
      }
      canvas.style.transform = "";
      canvas.style.filter = "";
      introPending = false;
      raf = 0;
      draw();
    }

    function frame() {
      const e = step();
      draw();
      if (e < 0.03 && !ptr.inside) {
        raf = 0;
        introPending = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (!pts.length) return; // not built yet; build() starts the intro itself
      if (introPending && o.intro === "depth") {
        if (!raf) raf = requestAnimationFrame(introFrame);
        return;
      }
      if (reduced && !introPending) return draw();
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function local(e) {
      const r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    }

    if (!reduced) {
      canvas.addEventListener("pointermove", (e) => {
        if (introPending && o.intro === "depth") return; // let it land first
        const px = ptr.x,
          py = ptr.y,
          was = ptr.inside;
        local(e);
        if (was) stir(Math.hypot(ptr.x - px, ptr.y - py));
        ptr.inside = true;
        canvas.style.cursor = o.ring ? "none" : "";
        start();
      });
      canvas.addEventListener("pointerleave", () => {
        ptr.inside = false;
        start();
      });
      // Taps on touch screens give a single burst instead of a hover.
      canvas.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse") return;
        local(e);
        for (const p of pts) {
          const dx = p.x - ptr.x,
            dy = p.y - ptr.y,
            d = Math.hypot(dx, dy) || 1;
          if (d < o.radius * 1.6) {
            const f = (1 - d / (o.radius * 1.6)) * 22;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        start();
      });
    }

    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && introPending && !q.has("intro")) start();
    }, { threshold: 0.25 }).observe(el);

    // Never sample before the web font is in, or the canvas falls back to a
    // serif and the resize guard below would stop it ever being redrawn.
    let t = 0,
      fontsOk = false;
    new ResizeObserver(() => {
      if (!fontsOk) return;
      clearTimeout(t);
      t = setTimeout(build, 80);
    }).observe(el);

    const fontReady = document.fonts
      ? document.fonts.load(`${o.weight} 100px ${o.family}`, "CALLUM THOMAS").catch(() => {})
      : Promise.resolve();
    fontReady.then(() => {
      fontsOk = true;
      builtFor = -1;
      build();
    });

    return { restore };
  }

  window.ParticleWordmark = ParticleWordmark;
})();
