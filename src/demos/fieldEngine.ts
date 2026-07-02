/**
 * fieldEngine.ts — top-down field-coverage simulation.
 *
 * The tractor + trailer sweeps serpentine passes along 25 m rows,
 * laying a 2 m wetted strip at 5 km/h (real report parameters). Each
 * completed strip pass deposits depthPerCoverage = 1.6 mm / coverages
 * (per-configuration measured value), so the pass counters, cumulative
 * depth and elapsed operating time all track the real numbers.
 * Time is accelerated by a user-selectable multiplier; the elapsed-time
 * counter always shows *real* operating minutes.
 */

export interface FieldConfigInput {
  /** Coverages of a 250 m² zone to reach the 1.6 mm event */
  coveragesTo16mm: number;
  /** Number of 250 m² zones (1 = single zone, 4 = 0.1 ha field, 8 = 0.2 ha) */
  zones: number;
  /** Sim-speed multiplier (e.g. 150 = 150× real time) */
  speedMult: number;
}

export interface FieldStats {
  zone: number; // current zone (1-based)
  zones: number;
  coverages: number; // completed coverages of current zone
  coveragesTarget: number;
  depthMm: number; // cumulative depth on current zone
  targetDepthMm: number;
  elapsedMin: number; // real operating minutes (all zones)
  done: boolean;
}

/* Real operating parameters (report Section 5.4) */
const SPEED_MS = 5 / 3.6; // 5 km/h
const STRIP_W = 2; // m wetted strip
const ZONE_L = 25; // m, pass length
const ZONE_W = 10; // m -> 5 strips per zone
const STRIPS = ZONE_W / STRIP_W;
const TARGET_MM = 1.6;

export class FieldEngine {
  private ctx: CanvasRenderingContext2D;
  private cfg!: FieldConfigInput;

  // sim state
  private zone = 0;
  private strip = 0;
  private dir = 1; // 1 = travelling +x, -1 = -x
  private x = 0; // metres along the current strip
  private elapsed = 0; // real seconds of operation
  private depths: number[][] = []; // [zone][strip] mm
  private coverages: number[] = [];
  private done = false;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas not supported");
    this.ctx = ctx;
  }

  setConfig(cfg: FieldConfigInput) {
    this.cfg = cfg;
    this.reset();
  }

  updateSpeed(speedMult: number) {
    if (this.cfg) this.cfg.speedMult = speedMult;
  }

  reset() {
    this.zone = 0;
    this.strip = 0;
    this.dir = 1;
    this.x = 0;
    this.elapsed = 0;
    this.done = false;
    this.depths = Array.from({ length: this.cfg.zones }, () =>
      Array(STRIPS).fill(0),
    );
    this.coverages = Array(this.cfg.zones).fill(0);
  }

  get depthPerCoverage(): number {
    return TARGET_MM / this.cfg.coveragesTo16mm;
  }

  stats(): FieldStats {
    const depth =
      this.depths[Math.min(this.zone, this.cfg.zones - 1)].reduce((a, b) => a + b, 0) /
      STRIPS;
    return {
      zone: Math.min(this.zone + 1, this.cfg.zones),
      zones: this.cfg.zones,
      coverages: this.coverages[Math.min(this.zone, this.cfg.zones - 1)],
      coveragesTarget: this.cfg.coveragesTo16mm,
      depthMm: depth,
      targetDepthMm: TARGET_MM,
      elapsedMin: this.elapsed / 60,
      done: this.done,
    };
  }

  /** Advance sim by dt (real render seconds) and draw. */
  frame(dt: number, running: boolean) {
    if (!this.cfg) return;
    if (running && !this.done) this.advance(Math.min(dt, 0.05) * this.cfg.speedMult);
    this.draw();
  }

  private advance(simDt: number) {
    let remaining = simDt;
    // Move along strips; a strip's depth deposits when its pass completes.
    while (remaining > 0 && !this.done) {
      const distLeft = ZONE_L - this.x;
      const timeLeft = distLeft / SPEED_MS;
      if (remaining < timeLeft) {
        this.x += remaining * SPEED_MS;
        this.elapsed += remaining;
        remaining = 0;
      } else {
        // strip completed
        this.elapsed += timeLeft;
        remaining -= timeLeft;
        this.depths[this.zone][this.strip] += this.depthPerCoverage;
        this.x = 0;
        this.dir *= -1;
        this.strip += 1;
        if (this.strip >= STRIPS) {
          this.strip = 0;
          this.coverages[this.zone] += 1;
          if (this.coverages[this.zone] >= this.cfg.coveragesTo16mm) {
            this.zone += 1;
            this.dir = 1;
            if (this.zone >= this.cfg.zones) {
              this.zone = this.cfg.zones - 1;
              this.done = true;
            }
          }
        }
      }
    }
  }

  /* ---- drawing ------------------------------------------------------- */

  private draw() {
    const { ctx, canvas } = this;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    // Zone layout: 1 -> 1×1, 4 -> 2×2, 8 -> 2×4 (cols × rows)
    const cols = this.cfg.zones === 1 ? 1 : 2;
    const rows = Math.ceil(this.cfg.zones / cols);
    const gap = 10;
    const pad = 14;
    const fieldW = cols * ZONE_L + (cols - 1) * (gap / 4);
    const fieldH = rows * ZONE_W + (rows - 1) * (gap / 4);
    const s = Math.min((cw - pad * 2) / fieldW, (ch - pad * 2) / fieldH);
    const ox = (cw - fieldW * s) / 2;
    const oy = (ch - fieldH * s) / 2;

    for (let z = 0; z < this.cfg.zones; z++) {
      const zc = z % cols;
      const zr = Math.floor(z / cols);
      const zx = ox + zc * (ZONE_L + gap / 4) * s;
      const zy = oy + zr * (ZONE_W + gap / 4) * s;

      // soil base
      ctx.fillStyle = "#3d2f1e";
      ctx.fillRect(zx, zy, ZONE_L * s, ZONE_W * s);
      // crop rows texture
      ctx.strokeStyle = "rgba(102,187,106,0.16)";
      ctx.lineWidth = 1;
      for (let ry = 1; ry < ZONE_W; ry += 1) {
        ctx.beginPath();
        ctx.moveTo(zx, zy + ry * s);
        ctx.lineTo(zx + ZONE_L * s, zy + ry * s);
        ctx.stroke();
      }
      // wetted strips
      for (let st = 0; st < STRIPS; st++) {
        const d = this.depths[z][st];
        if (d <= 0) continue;
        const a = Math.min(d / TARGET_MM, 1);
        ctx.fillStyle = `rgba(43,127,214,${0.12 + a * 0.55})`;
        ctx.fillRect(zx, zy + st * STRIP_W * s, ZONE_L * s, STRIP_W * s);
      }
      // partial strip currently being wetted (behind the tractor)
      if (z === this.zone && !this.done) {
        const a = Math.min(
          (this.depths[z][this.strip] + this.depthPerCoverage) / TARGET_MM,
          1,
        );
        ctx.fillStyle = `rgba(43,127,214,${0.12 + a * 0.55})`;
        const wx = this.dir === 1 ? zx : zx + (ZONE_L - this.x) * s;
        ctx.fillRect(wx, zy + this.strip * STRIP_W * s, this.x * s, STRIP_W * s);
      }
      // zone border + label
      ctx.strokeStyle = z === this.zone && !this.done ? "#43A047" : "rgba(157,176,164,0.35)";
      ctx.lineWidth = z === this.zone && !this.done ? 2 : 1;
      ctx.strokeRect(zx, zy, ZONE_L * s, ZONE_W * s);
      if (this.cfg.zones > 1) {
        ctx.fillStyle = "rgba(232,239,234,0.75)";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        // 2-day rotation: two zones irrigated per day
        ctx.fillText(`zone ${z + 1} · day ${Math.floor(z / 2) + 1}`, zx + 5, zy + 14);
      }

      // tractor
      if (z === this.zone && !this.done) {
        const ty = zy + (this.strip * STRIP_W + STRIP_W / 2) * s;
        const tx = this.dir === 1 ? zx + this.x * s : zx + (ZONE_L - this.x) * s;
        // boom (transverse line across the strip)
        ctx.strokeStyle = "#6FB3F2";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx - this.dir * 8, ty - (STRIP_W / 2) * s + 2);
        ctx.lineTo(tx - this.dir * 8, ty + (STRIP_W / 2) * s - 2);
        ctx.stroke();
        // trailer
        ctx.fillStyle = "#243028";
        ctx.fillRect(tx - this.dir * 7 - 5, ty - 5, 10, 10);
        // tractor body
        ctx.fillStyle = "#43A047";
        ctx.fillRect(tx - 4, ty - 6, 12 * this.dir, 12);
        ctx.fillStyle = "#F5862B";
        ctx.fillRect(tx + this.dir * 4, ty - 4, 4 * this.dir, 8);
      }
    }

    if (this.done) {
      ctx.fillStyle = "rgba(12,17,14,0.55)";
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = "#66BB6A";
      ctx.font = "600 18px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("1.6 mm event delivered ✓", cw / 2, ch / 2 - 4);
      ctx.fillStyle = "#9DB0A4";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillText("press Reset to run again", cw / 2, ch / 2 + 18);
    }
  }
}
