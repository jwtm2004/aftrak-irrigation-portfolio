import { useState } from "react";
import Section from "../Section";
import Reveal from "../Reveal";
import { systemParts, costs, assets } from "../../data";

/**
 * Interactive system map: a stylised schematic on the left, component
 * list on the right. Hover/click/focus a component to highlight it in
 * the schematic (and vice versa). Fully keyboard-accessible — every
 * list row is a real button.
 */
export default function SystemParts() {
  const [activeId, setActiveId] = useState<string>("outlets");

  const dim = (id: string) =>
    activeId && activeId !== id ? "opacity-30" : "opacity-100";

  return (
    <Section
      id="system"
      eyebrow="04 · The system"
      title="£435.57, sourced off the shelf, built to be repaired"
      lede="Every component is commercially available from regional markets — no specialist supply chain. The pump and tank dominate the spend; the entire dribble bar (hydraulics + electrics) cost just £104.97."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Schematic */}
        <Reveal>
          <div className="card sticky top-20">
            <svg
              viewBox="0 0 520 400"
              className="w-full"
              role="img"
              aria-label="Schematic of the prototype: tank, pump, valve, tee, boom with outlets, open returns, frame, trailer and electrical circuit"
            >
              {/* trailer bed + wheels */}
              <g className={`transition-opacity duration-300 ${dim("frame")}`}>
                <rect x="70" y="300" width="380" height="14" rx="4" fill="#243028" stroke="#9DB0A4" strokeOpacity="0.5" />
                <circle cx="150" cy="332" r="18" fill="none" stroke="#9DB0A4" strokeWidth="4" strokeOpacity="0.6" />
                <circle cx="370" cy="332" r="18" fill="none" stroke="#9DB0A4" strokeWidth="4" strokeOpacity="0.6" />
                {/* removable frame members */}
                <path d="M110 300 v-64 h300 v64 M180 236 v64 M340 236 v64" fill="none" stroke="#F5862B" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* tank on frame */}
              <g className={`transition-opacity duration-300 ${dim("tank")}`}>
                <rect x="140" y="180" width="240" height="56" rx="10" fill="rgba(43,127,214,0.14)" stroke="#9DB0A4" strokeWidth="2.5" />
                <path d="M220 188 v40 M300 188 v40" stroke="#9DB0A4" strokeOpacity="0.35" strokeWidth="2" />
                <rect x="146" y="204" width="228" height="28" rx="6" fill="rgba(43,127,214,0.25)" />
              </g>

              {/* pump + valve on the supply run */}
              <g className={`transition-opacity duration-300 ${dim("pump")}`}>
                <rect x="404" y="196" width="52" height="36" rx="8" fill="#1c2b20" stroke="#43A047" strokeWidth="2.5" />
                <path d="M380 214 h24" stroke="#2B7FD6" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.6" />
              </g>
              <g className={`transition-opacity duration-300 ${dim("valve")}`}>
                <path d="M456 214 h30" stroke="#2B7FD6" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.6" />
                <circle cx="472" cy="214" r="9" fill="#131A15" stroke="#F5862B" strokeWidth="2.5" />
                <path d="M472 205 v-8" stroke="#F5862B" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* riser to boom + tee */}
              <g className={`transition-opacity duration-300 ${dim("tee")}`}>
                <path d="M486 214 h14 v-134 h-240" fill="none" stroke="#2B7FD6" strokeWidth="5" strokeOpacity="0.6" strokeLinecap="round" />
                <circle cx="260" cy="80" r="8" fill="#1B5FA8" />
              </g>

              {/* boom + outlets */}
              <g className={`transition-opacity duration-300 ${dim("boom")}`}>
                <path d="M40 80 H480" stroke="#2B7FD6" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.75" />
              </g>
              <g className={`transition-opacity duration-300 ${dim("outlets")}`}>
                {Array.from({ length: 16 }, (_, i) => 60 + i * 25).map(
                  (x) =>
                    Math.abs(x - 260) > 12 && (
                      <path key={x} d={`M${x} 86 v10`} stroke="#6FB3F2" strokeWidth="2.5" strokeLinecap="round" />
                    ),
                )}
              </g>

              {/* open returns */}
              <g className={`transition-opacity duration-300 ${dim("returns")}`}>
                <path d="M40 80 q-18 10 -18 34 v66 q0 22 24 24 l88 4" fill="none" stroke="#2B7FD6" strokeWidth="4" strokeDasharray="7 6" strokeOpacity="0.7" />
                <path d="M480 80 q18 10 18 34 v66 q0 22 -24 24 l-88 4" fill="none" stroke="#2B7FD6" strokeWidth="4" strokeDasharray="7 6" strokeOpacity="0.7" />
              </g>

              {/* electrics */}
              <g className={`transition-opacity duration-300 ${dim("electrics")}`}>
                <rect x="86" y="252" width="60" height="34" rx="6" fill="#131A15" stroke="#F5862B" strokeWidth="2" />
                <path d="M96 269 h12 m6 0 h12 m6 0 h10" stroke="#F5862B" strokeWidth="2" strokeLinecap="round" />
                <path d="M146 269 c60 -20 180 -40 258 -47" fill="none" stroke="#F5862B" strokeWidth="2" strokeDasharray="4 5" strokeOpacity="0.7" />
              </g>
            </svg>
            <p className="mt-3 text-center font-mono text-xs text-fog">
              {systemParts.find((p) => p.id === activeId)?.name ?? "Select a component"}
            </p>
          </div>
        </Reveal>

        {/* Component list */}
        <div className="space-y-2">
          {systemParts.map((part, i) => {
            const active = activeId === part.id;
            return (
              <Reveal key={part.id} delay={Math.min(i * 0.04, 0.3)}>
                <button
                  onClick={() => setActiveId(part.id)}
                  onMouseEnter={() => setActiveId(part.id)}
                  onFocus={() => setActiveId(part.id)}
                  aria-expanded={active}
                  className={`card w-full text-left transition-colors duration-200 ${
                    active ? "border-leaf/60 bg-leaf/5" : "hover:border-fog/40"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-sm font-semibold text-mist">
                      {part.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                        part.group === "hydraulic"
                          ? "bg-water/15 text-water-bright"
                          : part.group === "electrical"
                            ? "bg-ember/15 text-ember-bright"
                            : "bg-leaf/15 text-leaf-bright"
                      }`}
                    >
                      {part.group}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-fog">{part.role}</p>
                  {active && (
                    <div className="mt-3 border-t border-edge pt-3">
                      <p className="text-xs leading-relaxed text-fog">{part.spec}</p>
                      <p className="mt-2 font-mono text-xs text-ember-bright">{part.cost}</p>
                    </div>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Cost bar */}
      <Reveal>
        <div className="card mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-mist">
              Where the £{costs.totalGbp.toFixed(2)} went
            </h3>
            <p className="font-mono text-xs text-fog">report Table 13</p>
          </div>
          <div className="mt-4 flex h-6 w-full overflow-hidden rounded-full" role="img" aria-label={`Pump and tank £${costs.pumpTankGbp}, dribble bar parts £${costs.dribbleBarPartsGbp}`}>
            <div
              className="flex items-center justify-center bg-leaf text-xs font-semibold text-ink"
              style={{ width: `${costs.pumpTankSharePercent}%` }}
            >
              pump + tank · £{costs.pumpTankGbp.toFixed(2)}
            </div>
            <div
              className="flex items-center justify-center bg-ember text-xs font-semibold text-ink"
              style={{ width: `${100 - costs.pumpTankSharePercent}%` }}
            >
              £{costs.dribbleBarPartsGbp}
            </div>
          </div>
          <p className="mt-3 text-sm text-fog">
            The orange slice is the point: the dribble bar itself — all pipework,
            fittings, outlets, returns and the full electrical circuit — cost{" "}
            <span className="text-ember-bright">£{costs.dribbleBarPartsGbp}</span>.
            The expensive items (pump, tank) are generic and locally procurable.
          </p>
        </div>
      </Reveal>

      {/* Proof of work */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Reveal>
          <figure>
            <img
              src={assets.fabrication.path}
              alt={assets.fabrication.label}
              loading="lazy"
              className="aspect-video w-full rounded-xl border border-edge object-cover"
            />
            <figcaption className="mt-2 font-mono text-xs text-fog/70">
              Workshop fabrication: the removable steel mounting frame
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.08}>
          <figure>
            <a href={assets.poster.path} target="_blank" rel="noreferrer">
              <img
                src={assets.poster.path}
                alt={assets.poster.label}
                loading="lazy"
                className="aspect-video w-full rounded-xl border border-edge object-cover object-top transition-opacity hover:opacity-90"
              />
            </a>
            <figcaption className="mt-2 font-mono text-xs text-fog/70">
              Dissertation poster — click to open full size
            </figcaption>
          </figure>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <p className="mt-3 text-xs text-fog">
          Honest framing: there's no photo of me posing with the finished rig —
          the fabrication photos and poster above are the proof-of-work, exactly
          as submitted in the dissertation.
        </p>
      </Reveal>
    </Section>
  );
}
