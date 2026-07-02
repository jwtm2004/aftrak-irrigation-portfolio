import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Section from "../Section";
import Reveal from "../Reveal";
import { outletConfigs, OutletConfig } from "../../data";
import { FlowEngine, VIEW_W, VIEW_H } from "../../demos/flowEngine";

/**
 * ⭐ Centrepiece: animated hydraulic circuit.
 * Canvas runs only while on-screen (react-intersection-observer) and
 * pauses when the tab is hidden, so it never burns cycles off-screen.
 */
export default function FlowDemo() {
  const [config, setConfig] = useState<OutletConfig>(
    outletConfigs.find((c) => c.selected)!,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FlowEngine | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.15 });

  /* Engine lifecycle + resize ------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    engineRef.current = new FlowEngine(canvas);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = wrap.clientWidth;
      const h = (w * VIEW_H) / VIEW_W;
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

  /* Push config changes into the engine ---------------------------- */
  useEffect(() => {
    engineRef.current?.setConfig({
      totalLmin: config.boomLmin + config.returnLmin,
      boomFraction: config.boomFraction,
      sectionLminPerHole: config.sectionLminPerHole,
    });
  }, [config]);

  /* Animation loop, gated on visibility ----------------------------- */
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!document.hidden) engineRef.current?.frame(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const boomPct = Math.round(config.boomFraction * 100);
  const returnPct = 100 - boomPct;

  return (
    <Section
      id="flow"
      eyebrow="02 · How it works"
      title="One pump, sixteen outlets, and a deliberately open loop"
      lede="Water is pumped from the tank to a central tee, splits into two boom arms, and dribbles from 16 drilled outlets. Excess flow escapes through open-return hoses at both arm ends — passive pressure relief, not a leak. Outlet size decides how much water irrigates versus recirculates. Toggle it."
      tone="water"
    >
      <div ref={inViewRef}>
        <Reveal>
          <div className="card overflow-hidden !p-0">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-5 py-4">
              <div
                role="group"
                aria-label="Outlet size"
                className="flex flex-wrap gap-2"
              >
                {outletConfigs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setConfig(c)}
                    aria-pressed={config.id === c.id}
                    className={`chip-btn ${config.id === c.id ? "chip-btn-active" : ""}`}
                  >
                    {c.label} outlets
                    {c.selected && " ★"}
                  </button>
                ))}
              </div>
              <p className="font-mono text-xs text-fog">
                ★ final configuration · measured lab data
              </p>
            </div>

            {/* Canvas */}
            <div ref={wrapRef} className="relative w-full bg-ink/60">
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Animated hydraulic schematic. With ${config.label} outlets, ${boomPct}% of pumped flow discharges from the boom and ${returnPct}% returns to the tank.`}
              />
            </div>

            {/* Live stats — real measured values from data.ts */}
            <div className="grid gap-4 border-t border-edge px-5 py-5 sm:grid-cols-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-fog">
                  Mean boom discharge
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-water-bright">
                  {config.boomLmin}
                  <span className="ml-1 text-base text-fog">L/min</span>
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-mono text-xs uppercase tracking-wider text-fog">
                  Where the pumped water goes
                </p>
                <div
                  className="mt-3 flex h-5 w-full overflow-hidden rounded-full"
                  role="img"
                  aria-label={`${boomPct}% boom discharge, ${returnPct}% returned to tank`}
                >
                  <div
                    className="flex items-center justify-center bg-water text-[10px] font-semibold text-white transition-all duration-700"
                    style={{ width: `${boomPct}%` }}
                  >
                    {boomPct}%
                  </div>
                  <div
                    className="flex items-center justify-center bg-edge text-[10px] font-semibold text-fog transition-all duration-700"
                    style={{ width: `${returnPct}%` }}
                  >
                    {returnPct}%
                  </div>
                </div>
                <div className="mt-2 flex justify-between font-mono text-xs text-fog">
                  <span className="text-water-bright">→ boom (irrigates)</span>
                  <span>→ open return (recirculates)</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="card border-water/25">
              <h3 className="font-display text-base font-semibold text-mist">
                The key insight
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                At 1.5 mm and 2 mm, outlet resistance dominates: over 80% of
                pumped water recirculates instead of irrigating. Only the 3 mm
                outlets shift the majority of flow — 52% — into useful
                discharge, which is why it became the final configuration.
              </p>
            </div>
            <div className="card">
              <h3 className="font-display text-base font-semibold text-mist">
                Look closely at the dribbles
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                Outlets near the arm ends visibly dribble more than the centre —
                that end-high, centre-low pattern is a real measured finding
                (Christiansen uniformity {config.cuPercent}% for this
                configuration), reproduced here from the sectional lab data.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
