import { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
  /** Accent colour for the eyebrow label */
  tone?: "leaf" | "ember" | "water";
}

const toneClass = {
  leaf: "text-leaf-bright",
  ember: "text-ember-bright",
  water: "text-water-bright",
};

/** Standard section shell: consistent rhythm, anchored for the nav. */
export default function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  tone = "leaf",
}: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <p className={`eyebrow ${toneClass[tone]}`}>{eyebrow}</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-mist sm:text-4xl">
            {title}
          </h2>
          {lede && <p className="mt-4 max-w-2xl text-base text-fog sm:text-lg">{lede}</p>}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
