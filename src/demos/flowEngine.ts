/**
 * flowEngine.ts — 2D particle animation of the prototype's hydraulic circuit.
 *
 * Schematic (virtual 1000 × 560 canvas units):
 *
 *   [left return]──┐  16 drilled outlets   ┌──[right return]
 *        ┌─────────┴───────────┬───────────┴──────────┐   ← boom @ y=150
 *        │                  central tee               │
 *        │                     │ ← supply riser       │
 *        │                  [pump]                    │
 *        │                     │                      │
 *        └────────────→ [ 400 L tank ] ←──────────────┘
 *
 * Every particle is spawned in the tank and routed to a destination:
 * one of the 16 outlets (probability = measured boom fraction, weighted
 * by the measured end-high/centre-low section pattern) or an open-return
 * path back to the tank. Switching outlet size changes the split using
 * the real measured values from data.ts — nothing is invented.
 */

export interface FlowConfigInput {
  /** Total pumped flow, L/min (boom + return measured means) */
  totalLmin: number;
  /** Fraction of pumped flow leaving via the boom outlets (0–1) */
  boomFraction: number;
  /**
   * Measured mean per-hole discharge for sections [B1-4, B5-8, B9-12, B13-16].
   * Used to weight which outlets particles leave from, reproducing the
   * end-high / centre-low pattern.
   */
  sectionLminPerHole: [number, number, number, number];
}

type Pt = { x: number; y: number };

interface Particle {
  pts: Pt[]; // polyline route
  cum: number[]; // cumulative segment lengths
  total: number; // total route length
  s: number; // distance travelled along route
  speed: number; // px/s along the pipe
  mode: "pipe" | "dribble" | "fade";
  endMode: "dribble" | "fade"; // what happens when the route ends
  x: number;
  y: number;
  vy: number;
  vx: number;
  alpha: number;
}

/* ---- fixed geometry (virtual units) --------------------------------- */

export const VIEW_W = 1000;
export const VIEW_H = 560;

const TANK = { x: 390, y: 402, w: 220, h: 108 };
const WATER_Y = TANK.y + 26; // static indicative water level
const BOOM_Y = 150;
const TEE: Pt = { x: 500, y: BOOM_Y };
const PUMP = { x: 470, y: 268, w: 60, h: 44 };

// Outlet x-positions, 8 per arm. Index 0 is nearest the tee.
const LEFT_OUTLETS = [460, 420, 380, 340, 300, 260, 220, 180];
const RIGHT_OUTLETS = [540, 580, 620, 660, 700, 740, 780, 820];

const SUPPLY: Pt[] = [
  { x: 500, y: TANK.y + 40 },
  { x: 500, y: BOOM_Y },
];
const LEFT_RETURN: Pt[] = [
  { x: 140, y: BOOM_Y },
  { x: 118, y: BOOM_Y + 22 },
  { x: 118, y: 470 },
  { x: TANK.x + 6, y: 470 },
];
const RIGHT_RETURN: Pt[] = [
  { x: 860, y: BOOM_Y },
  { x: 882, y: BOOM_Y + 22 },
  { x: 882, y: 470 },
  { x: TANK.x + TANK.w - 6, y: 470 },
];

/* ---- helpers --------------------------------------------------------- */

function buildCum(pts: Pt[]): { cum: number[]; total: number } {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  return { cum, total: cum[cum.length - 1] };
}

function pointAt(p: Particle, s: number): Pt {
  const { pts, cum } = p;
  if (s <= 0) return pts[0];
  if (s >= p.total) return pts[pts.length - 1];
  let i = 1;
  while (cum[i] < s) i++;
  const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1]);
  return {
    x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
    y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t,
  };
}

/* ---- engine ---------------------------------------------------------- */

export class FlowEngine {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private spawnAccum = 0;
  private time = 0;
  private cfg!: FlowConfigInput & { outletWeights: number[] };
  /** cached routes: 16 outlet routes + 2 return routes */
  private routes!: { pts: Pt[]; cum: number[]; total: number; end: "dribble" | "fade" }[];

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas not supported");
    this.ctx = ctx;
    this.buildRoutes();
  }

  private buildRoutes() {
    const mk = (pts: Pt[], end: "dribble" | "fade") => ({ ...buildCum(pts), pts, end });
    const routes: typeof this.routes = [];
    // outlets: supply -> tee -> along arm to the outlet x
    for (const arm of [LEFT_OUTLETS, RIGHT_OUTLETS]) {
      for (const ox of arm) {
        routes.push(mk([...SUPPLY, { x: ox, y: BOOM_Y }], "dribble"));
      }
    }
    // returns: supply -> tee -> arm end -> down and back into the tank
    routes.push(mk([...SUPPLY, ...LEFT_RETURN], "fade"));
    routes.push(mk([...SUPPLY, ...RIGHT_RETURN], "fade"));
    this.routes = routes;
  }

  setConfig(input: FlowConfigInput) {
    // Per-outlet weights from the measured section pattern:
    // outlets 0–3 (nearest tee) take the "centre" per-hole rate,
    // outlets 4–7 take the "end" rate (arms averaged, symmetric).
    const [b14, b58, b912, b1316] = input.sectionLminPerHole;
    const near = (b58 + b912) / 2;
    const far = (b14 + b1316) / 2;
    const w = [near, near, near, near, far, far, far, far];
    const sum = w.reduce((a, b) => a + b, 0);
    this.cfg = { ...input, outletWeights: w.map((v) => v / sum) };
  }

  /** Advance and draw one frame. dt in seconds. */
  frame(dt: number) {
    if (!this.cfg) return;
    dt = Math.min(dt, 0.05); // clamp tab-switch jumps
    this.time += dt;
    this.spawn(dt);
    this.step(dt);
    this.draw();
  }

  private spawn(dt: number) {
    // Visual spawn rate scales with the real total pumped flow.
    const rate = this.cfg.totalLmin * 2.4; // particles per second
    this.spawnAccum += rate * dt;
    while (this.spawnAccum >= 1 && this.particles.length < 520) {
      this.spawnAccum -= 1;
      this.particles.push(this.makeParticle());
    }
  }

  private makeParticle(): Particle {
    const r = Math.random();
    let route;
    if (r < this.cfg.boomFraction) {
      // leaves through an outlet — pick arm 50/50, outlet by measured weight
      const armOffset = Math.random() < 0.5 ? 0 : 8;
      let pick = Math.random();
      let idx = 0;
      for (let k = 0; k < 8; k++) {
        pick -= this.cfg.outletWeights[k];
        if (pick <= 0) {
          idx = k;
          break;
        }
        idx = k;
      }
      route = this.routes[armOffset + idx];
    } else {
      route = this.routes[16 + (Math.random() < 0.5 ? 0 : 1)];
    }
    return {
      pts: route.pts,
      cum: route.cum,
      total: route.total,
      s: 0,
      speed: 150 + Math.random() * 40,
      mode: "pipe",
      endMode: route.end,
      x: route.pts[0].x,
      y: route.pts[0].y,
      vy: 0,
      vx: 0,
      alpha: 0.95,
    };
  }

  private step(dt: number) {
    const alive: Particle[] = [];
    for (const p of this.particles) {
      if (p.mode === "pipe") {
        p.s += p.speed * dt;
        if (p.s >= p.total) {
          if (p.endMode === "dribble") {
            p.mode = "dribble";
            const end = p.pts[p.pts.length - 1];
            p.x = end.x + (Math.random() - 0.5) * 2;
            p.y = end.y + 6;
            p.vy = 25;
            p.vx = (Math.random() - 0.5) * 6;
          } else {
            p.mode = "fade";
            const end = p.pts[p.pts.length - 1];
            p.x = end.x;
            p.y = end.y;
          }
        } else {
          const pt = pointAt(p, p.s);
          p.x = pt.x;
          p.y = pt.y;
        }
        alive.push(p);
      } else if (p.mode === "dribble") {
        p.vy += 420 * dt; // pseudo-gravity
        p.y += p.vy * dt;
        p.x += p.vx * dt;
        p.alpha -= 1.1 * dt;
        if (p.alpha > 0 && p.y < 380) alive.push(p);
      } else {
        p.alpha -= 3.2 * dt;
        if (p.alpha > 0) alive.push(p);
      }
    }
    this.particles = alive;
  }

  /* ---- drawing ------------------------------------------------------- */

  private draw() {
    const { ctx, canvas } = this;
    const scale = canvas.width / VIEW_W / (window.devicePixelRatio || 1);
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    this.drawPipes(ctx);
    this.drawTank(ctx);
    this.drawPump(ctx);
    this.drawLabels(ctx);

    // particles on top
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.fillStyle = p.mode === "dribble" ? "#6FB3F2" : "#8FC6F7";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.mode === "dribble" ? 2.1 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private pipePath(ctx: CanvasRenderingContext2D, pts: Pt[]) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  private drawPipes(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // supply riser + returns (hoses)
    ctx.strokeStyle = "rgba(43,127,214,0.32)";
    ctx.lineWidth = 8;
    this.pipePath(ctx, SUPPLY);
    this.pipePath(ctx, LEFT_RETURN);
    this.pipePath(ctx, RIGHT_RETURN);
    // boom (PVC pipe, slightly heavier)
    ctx.strokeStyle = "rgba(43,127,214,0.42)";
    ctx.lineWidth = 11;
    this.pipePath(ctx, [
      { x: LEFT_OUTLETS[7] - 40, y: BOOM_Y },
      { x: RIGHT_OUTLETS[7] + 40, y: BOOM_Y },
    ]);
    // tee node
    ctx.fillStyle = "#1B5FA8";
    ctx.beginPath();
    ctx.arc(TEE.x, TEE.y, 7, 0, Math.PI * 2);
    ctx.fill();
    // outlet ticks
    ctx.strokeStyle = "rgba(111,179,242,0.8)";
    ctx.lineWidth = 2;
    for (const ox of [...LEFT_OUTLETS, ...RIGHT_OUTLETS]) {
      ctx.beginPath();
      ctx.moveTo(ox, BOOM_Y + 6);
      ctx.lineTo(ox, BOOM_Y + 13);
      ctx.stroke();
    }
  }

  private drawTank(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = TANK;
    // water body with a gentle animated surface
    ctx.fillStyle = "rgba(43,127,214,0.22)";
    ctx.beginPath();
    ctx.moveTo(x + 4, WATER_Y);
    for (let px = 0; px <= w - 8; px += 8) {
      ctx.lineTo(x + 4 + px, WATER_Y + Math.sin(this.time * 1.8 + px * 0.08) * 2);
    }
    ctx.lineTo(x + w - 4, y + h - 4);
    ctx.lineTo(x + 4, y + h - 4);
    ctx.closePath();
    ctx.fill();
    // shell
    ctx.strokeStyle = "rgba(157,176,164,0.7)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.stroke();
    // internal baffles (the real tank is baffled)
    ctx.strokeStyle = "rgba(157,176,164,0.25)";
    ctx.lineWidth = 2;
    for (const bx of [x + w / 3, x + (2 * w) / 3]) {
      ctx.beginPath();
      ctx.moveTo(bx, y + 14);
      ctx.lineTo(bx, y + h - 8);
      ctx.stroke();
    }
  }

  private drawPump(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = PUMP;
    // soft pulse ring to suggest the diaphragm cycling
    const pulse = (Math.sin(this.time * 6) + 1) / 2;
    ctx.strokeStyle = `rgba(67,160,71,${0.15 + pulse * 0.25})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 4, w + 8, h + 8, 10);
    ctx.stroke();
    ctx.fillStyle = "#1c2b20";
    ctx.strokeStyle = "#43A047";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();
  }

  private drawLabels(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(157,176,164,0.9)";
    ctx.font = "12px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("400 L baffled tank", TANK.x + TANK.w / 2, TANK.y + TANK.h + 22);
    ctx.fillText("12 V diaphragm pump", PUMP.x + PUMP.w / 2 + 128, PUMP.y + 27);
    ctx.fillText("central tee", TEE.x, TEE.y - 18);
    ctx.fillText("16 drilled outlets", TEE.x, BOOM_Y + 40);
    ctx.textAlign = "left";
    ctx.fillText("open return", 30, 330);
    ctx.textAlign = "right";
    ctx.fillText("open return", 970, 330);
    ctx.textAlign = "left";
  }
}
