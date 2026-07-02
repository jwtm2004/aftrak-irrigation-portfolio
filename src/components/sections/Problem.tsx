import Section from "../Section";
import Reveal from "../Reveal";
import { problem, assets } from "../../data";

const painPoints = [
  {
    title: "Dry spells, not droughts",
    body: "Yield loss in Malawi is driven less by total seasonal rainfall than by intra-seasonal dry spells — five or more consecutive days below a critical rainfall threshold, striking inside otherwise adequate wet seasons.",
  },
  {
    title: "The worst possible timing",
    body: "Dry spells hit hardest during moisture-sensitive crop stages — flowering and early yield formation — where even brief water stress causes irreversible yield loss in smallholder maize.",
  },
  {
    title: "No workable option",
    body: "Bucket irrigation is back-breaking and doesn't scale. Petrol pumps add fuel cost and dependency. Drip and sprinkler systems demand pressure, filtration and capital that smallholders don't have.",
  },
];

export default function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="01 · The problem"
      title="Rain-fed farming, one dry spell from a failed harvest"
      lede={problem.gap}
      tone="ember"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {painPoints.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <div className="card h-full">
              <h3 className="font-display text-lg font-semibold text-mist">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fog">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid items-stretch gap-4 md:grid-cols-2">
        <Reveal>
          <div className="card h-full border-ember/30">
            <p className="eyebrow text-ember-bright">The Malawi context</p>
            <ul className="mt-4 space-y-3">
              {problem.malawiContext.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-fog">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-fog">
              Aftrak is running micro-tractor trials in Malawi today — which makes
              it the natural first deployment context for a towed irrigation
              implement.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <figure className="h-full">
            <img
              src={assets.render.path}
              alt={assets.render.label}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-xl border border-edge object-cover md:aspect-auto md:h-full"
            />
            <figcaption className="mt-2 font-mono text-xs text-fog/70">
              Concept visualisation of the system deployed in-field
              (AI-assisted render — the lab prototype is shown in section 04)
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
