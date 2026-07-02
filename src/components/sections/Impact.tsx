import Section from "../Section";
import Reveal from "../Reveal";
import { stressBuffering, costs } from "../../data";

const stats = [
  {
    value: "+1.7",
    unit: "days",
    label: "before crop stress, on a 2-day rotation during a dry spell",
    tone: "text-leaf-bright",
  },
  {
    value: "+4.4",
    unit: "days",
    label: "under daily operation — flexibility to match crop stage and dry-spell severity",
    tone: "text-leaf-bright",
  },
  {
    value: "~£0",
    unit: "/event",
    label: "running cost once solar-charged from the Aftrak battery, vs recurring petrol spend",
    tone: "text-ember-bright",
  },
  {
    value: `£${costs.dribbleBarPartsGbp}`,
    unit: "",
    label: "of locally procurable parts to build the dribble bar — no specialist supply chain",
    tone: "text-ember-bright",
  },
];

export default function Impact() {
  return (
    <Section
      id="impact"
      eyebrow="07 · Why it matters"
      title="Buying farmers days when days decide the harvest"
      lede="Supplemental irrigation doesn't replace rain — it buys time through a dry spell. For smallholder maize, the days around flowering are exactly when brief water stress causes irreversible yield loss."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.07}>
            <div className="card h-full text-center">
              <p className={`font-display text-4xl font-bold ${s.tone}`}>
                {s.value}
                <span className="ml-1 text-lg font-medium text-fog">{s.unit}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fog">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="card mt-6">
          <p className="max-w-3xl text-sm leading-relaxed text-fog">
            Without irrigation, soil moisture under Malawi sandy-loam conditions
            reaches the stress threshold roughly{" "}
            <span className="text-mist">{stressBuffering.daysNoIrrigation} days</span>{" "}
            into a dry spell. This prototype stretched that to{" "}
            <span className="text-mist">{stressBuffering.daysTwoDayRotation} days</span>{" "}
            on a 2-day rotation and{" "}
            <span className="text-mist">{stressBuffering.daysDaily} days</span>{" "}
            with daily operation — enough to carry a crop through the typical
            5-plus-day dry spells that drive yield losses. It is a first
            engineering step toward reducing dry-spell vulnerability for
            climate-exposed farming households, not a finished product — and the
            numbers above are lab-derived predictions that field trials in
            Malawi must now confirm.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
