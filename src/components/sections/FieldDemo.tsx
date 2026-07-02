import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Section from "../Section";
import Reveal from "../Reveal";
import { outletConfigs, OutletConfig, fieldOps } from "../../data";
import { FieldEngine, FieldStats } from "../../demos/fieldEngine";

const PLOTS = [
  { id: 1, label: "250 m² zone", zones: 1 },
  { id: 4, label: "0.1 ha · 4 zones", zones: 4 },
  { id: 8, label: "0.2 ha · 8 zones", zones: 8 },
];
const SPEEDS = [
  { label: "60×", value: 60 },
  { label: "150×", value: 150 },
  { label: "500×", value: 500 },
];

/**
 * ⭐ Birds-eye coverage demo. The tractor sweeps 2 m strips at 5 km/h
 * (accelerated); pass counters, cumulative depth and elapsed operating
 * time are all computed from the real measured per-coverage depth.
 */
export default function FieldDemo() {
  const [outlet, setOutlet] = useState<OutletConfig>(
    outletConfigs.find((c) => c.selected)!,
  );
  const [zones, setZones] = useState(1);
  const [speed, setSpeed] = useState(150);
  const [running, setRunning] = useState(true);
  const [stats, setStats] = useState<FieldStats | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FieldEngine | null>(null);
  const runningRef = useRef(running);
  runningRef.current = running;
  const { ref: inViewRef, inView } = useInView({ threshold: 0.15 });

  /* engine + resize */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    engineRef.current = new FieldEngine(canvas);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = wrap.clientWidth;
      const h = Math.max(280, Math.min(440, w * 0.45));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  /* config changes reset the sim */
  useEffect(() => {
    engineRef.current?.setConfig({
      coveragesTo16mm: outlet.coveragesTo16mm,
      zones,
      speedMult: speed,
    });
    setRunning(true);
  }, [outlet, zones]); // eslint-disable-line react-hooks/exhaustive-deps

  /* speed changes should NOT reset progress */
  useEffect(() => {
    engineRef.current?.updateSpeed(speed);
  }, [speed]);

  /* animation loop */
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let last = performance.now();
    let statTimer = 0;
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!document.hidden) {
        engineRef.current?.frame(dt, runningRef.current);
        statTimer += dt;
        if (statTimer > 0.12) {
          statTimer = 0;
          setStats(engineRef.current?.stats() ?? null);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const chip = (active: boolean) => `chip-btn ${active ? "chip-btn-active" : ""}`;

  return (
    <Section
      id="field"
      eyebrow="06 · In the field"
      title="Watch the field fill in, pass by pass"
      lede={`The tractor lays a ${fieldOps.wettedStripM} m wetted strip at ${fieldOps.tractorSpeedKmh} km/h, building the 1.6 mm event through repeated coverages. Pick a plot and an outlet size — the pass counter makes the 3 mm advantage obvious: ~28 coverages instead of 80–91.`}
      tone="ember"
    >
      <div ref={inViewRef}>
        <Reveal>
          <div className="card overflow-hidden !p-0">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-edge px-5 py-4">
              <div role="group" aria-label="Plot size" className="flex flex-wrap gap-2">
                {PLOTS.map((p) => (
                  <button key={p.id} onClick={() => setZones(p.zones)} aria-pressed={zones === p.zones} className={chip(zones === p.zones)}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Outlet size" className="flex flex-wrap gap-2">
                {outletConfigs.map((c) => (
                  <button key={c.id} onClick={() => setOutlet(c)} aria-pressed={outlet.id === c.id} className={chip(outlet.id === c.id)}>
                    {c.label}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Simulation speed" className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-fog">sim speed</span>
                {SPEEDS.map((s) => (
                  <button key={s.value} onClick={() => setSpeed(s.value)} aria-pressed={speed === s.value} className={chip(speed === s.value)}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={() => setRunning((r) => !r)} className="chip-btn">
                  {running ? "Pause" : "Play"}
                </button>
                <button
                  onClick={() => {
                    engineRef.current?.reset();
                    setRunning(true);
                  }}
                  className="chip-btn"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div ref={wrapRef} className="w-full bg-ink/60">
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Top-down field coverage simulation: ${outlet.label} outlets need about ${outlet.coveragesTo16mm} full coverages to deliver a 1.6 millimetre irrigation event on each 250 square metre zone.`}
              />
            </div>

            {/* Live counters */}
            <div className="grid grid-cols-2 gap-4 border-t border-edge px-5 py-5 sm:grid-cols-4" aria-live="polite">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-fog">Zone</p>
                <p className="mt-1 font-display text-2xl font-semibold text-mist">
                  {stats ? `${stats.zone} / ${stats.zones}` : "—"}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-fog">Coverages</p>
                <p className="mt-1 font-display text-2xl font-semibold text-mist">
                  {stats ? `${stats.coverages} / ${stats.coveragesTarget}` : "—"}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-fog">Depth (this zone)</p>
                <p className="mt-1 font-display text-2xl font-semibold text-water-bright">
                  {stats ? stats.depthMm.toFixed(2) : "—"}
                  <span className="ml-1 text-sm text-fog">/ 1.6 mm</span>
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-fog">Operating time</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ember-bright">
                  {stats ? stats.elapsedMin.toFixed(1) : "—"}
                  <span className="ml-1 text-sm text-fog">min</span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card mt-5">
            <h3 className="font-display text-base font-semibold text-mist">
              The 2-day rotation
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fog">
              A 0.1 ha field divides into four 250 m² zones. At the 3 mm
              configuration's ~{outletConfigs[2].eventTimeMin[0]}–
              {outletConfigs[2].eventTimeMin[1]} minutes per zone event, a farmer
              irrigates two zones per day and returns to each zone every{" "}
              {fieldOps.rotationDays} days — the rotation behind the 8 → 9.73-day
              stress-buffering result. Timings shown exclude turnaround and
              refill time; the elapsed counter tracks boom-on operating time.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
