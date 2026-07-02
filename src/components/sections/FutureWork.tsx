import Section from "../Section";
import Reveal from "../Reveal";
import { futureWork } from "../../data";

export default function FutureWork() {
  return (
    <Section
      id="future"
      eyebrow="08 · What's next"
      title="A concrete roadmap to the field"
      lede="The prototype proved the concept in the lab. These are the specific steps — from the dissertation's recommendations — that take it to a farmer's plot in Malawi."
      tone="water"
    >
      <ol className="relative space-y-4 border-l border-edge pl-6">
        {futureWork.map((item, i) => (
          <Reveal key={item.title} delay={Math.min(i * 0.05, 0.3)}>
            <li className="relative">
              <span
                aria-hidden
                className={`absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full ${
                  item.priority ? "bg-ember ring-4 ring-ember/20" : "bg-leaf"
                }`}
              />
              <div className="card">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-mist">
                    {item.title}
                  </h3>
                  {item.priority && (
                    <span className="rounded-full bg-ember/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ember-bright">
                      immediate priority
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-fog">{item.detail}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
