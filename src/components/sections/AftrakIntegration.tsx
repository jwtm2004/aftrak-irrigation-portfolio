import Section from "../Section";
import Reveal from "../Reveal";
import { aftrak, assets } from "../../data";

export default function AftrakIntegration() {
  return (
    <Section
      id="aftrak"
      eyebrow="05 · The platform"
      title="Designed around the Aftrak AFT-e1"
      lede="The prototype is an implement, not a standalone machine. It clamps to the Aftrak trailer with U-hooks — zero permanent modification — and is towed behind the AFT-e1 electric micro-tractor."
      tone="ember"
    >
      <div className="grid items-stretch gap-4 md:grid-cols-2">
        <Reveal>
          <figure className="card flex h-full flex-col items-center justify-center !bg-panel/40">
            <img
              src={assets.aftrakPlatform.path}
              alt={assets.aftrakPlatform.label}
              loading="lazy"
              className="max-h-80 w-auto rounded-lg"
            />
            <figcaption className="mt-3 font-mono text-xs text-fog/70">
              The Aftrak AFT-e1 (Aftrak, 2025)
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card h-full">
            <h3 className="font-display text-base font-semibold text-mist">
              {aftrak.platform}
            </h3>
            <ul className="mt-4 space-y-3">
              {aftrak.facts.map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-sm text-fog">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Power architecture: today vs next step */}
      <Reveal>
        <div className="card mt-6 border-ember/25">
          <h3 className="font-display text-base font-semibold text-mist">
            Power status — honest version
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fog">
            {aftrak.integrationStatus}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-edge bg-ink/50 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-fog">
                As tested (lab)
              </p>
              <p className="mt-3 font-mono text-sm text-mist">
                12 V DC supply <span className="text-fog">→</span> 25 A fuse{" "}
                <span className="text-fog">→</span> isolator{" "}
                <span className="text-fog">→</span>{" "}
                <span className="text-leaf-bright">pump</span>
              </p>
            </div>
            <div className="rounded-lg border border-dashed border-ember/40 bg-ink/50 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-ember-bright">
                Next step (field)
              </p>
              <p className="mt-3 font-mono text-sm text-mist">
                Aftrak 52 V battery <span className="text-fog">→</span>{" "}
                DC-DC conversion <span className="text-fog">→</span>{" "}
                <span className="text-leaf-bright">pump</span>{" "}
                <span className="text-fog">· solar-charged, near-zero running cost</span>
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
