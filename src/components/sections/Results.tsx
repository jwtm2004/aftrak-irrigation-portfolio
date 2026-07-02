import { useInView } from "react-intersection-observer";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ErrorBar,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Section from "../Section";
import Reveal from "../Reveal";
import { outletConfigs, predictedVsMeasured, stressBuffering } from "../../data";

/* Shared chart cosmetics ------------------------------------------------ */
const AXIS = { stroke: "#9DB0A4", fontSize: 12, fontFamily: "JetBrains Mono" };
const GRID = "#243028";
const BAR_COLOURS = ["#9DB0A4", "#F5862B", "#43A047"]; // 1.5 / 2 / 3 mm
const tooltipStyle = {
  contentStyle: {
    background: "#131A15",
    border: "1px solid #243028",
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "Inter",
  },
  labelStyle: { color: "#E8EFEA" },
  cursor: { fill: "rgba(67,160,71,0.08)" },
};

/** Chart card that only mounts its chart once scrolled into view, so
 *  Recharts' entry animations play at the right moment. */
function ChartCard({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({ threshold: 0.25, triggerOnce: true });
  return (
    <div ref={ref} className="card flex h-full flex-col">
      <h3 className="font-display text-base font-semibold text-mist">{title}</h3>
      <div className="mt-4 h-56 w-full">{inView && children}</div>
      <p className="mt-3 text-xs leading-relaxed text-fog">{note}</p>
    </div>
  );
}

export default function Results() {
  const discharge = outletConfigs.map((c) => ({
    name: c.label,
    value: c.boomLmin,
  }));
  const split = outletConfigs.map((c) => ({
    name: c.label,
    boom: Math.round(c.boomFraction * 1000) / 10,
    ret: Math.round((1 - c.boomFraction) * 1000) / 10,
  }));
  const coverages = outletConfigs.map((c) => ({
    name: c.label,
    value: c.coveragesTo16mm,
  }));
  const eventTime = outletConfigs.map((c) => {
    const [lo, hi] = c.eventTimeMin;
    return {
      name: c.label,
      mid: (lo + hi) / 2,
      err: (hi - lo) / 2,
      range: `${lo}–${hi} min`,
    };
  });

  return (
    <Section
      id="results"
      eyebrow="03 · Results"
      title="What the lab testing showed"
      lede="Three outlet sizes, three repeat tests each, timed-mass collection in the thermofluids lab. The 3 mm configuration was the only one to meet the 1.6 mm event-depth requirement in a workable time."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <ChartCard
            title="Mean boom discharge by outlet size"
            note="Discharge jumps sharply at 3 mm — smaller outlets choke the flow the boom can usefully deliver."
          >
            <ResponsiveContainer>
              <BarChart data={discharge} margin={{ top: 18, right: 8, left: -6, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="name" tick={AXIS} axisLine={{ stroke: GRID }} tickLine={false} />
                <YAxis tick={AXIS} axisLine={false} tickLine={false} unit=" L/min" width={80} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} L/min`, "Boom discharge"]} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900}>
                  {discharge.map((_, i) => (
                    <Cell key={i} fill={BAR_COLOURS[i]} />
                  ))}
                  <LabelList dataKey="value" position="top" fill="#E8EFEA" fontSize={12} fontFamily="JetBrains Mono" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Reveal>

        <Reveal delay={0.06}>
          <ChartCard
            title="Flow split — boom vs open return (%)"
            note="At small outlets ~82% of pumped water recirculates. Only 3 mm makes boom discharge the majority path (52% / 48%)."
          >
            <ResponsiveContainer>
              <BarChart data={split} layout="vertical" margin={{ top: 4, right: 26, left: -8, bottom: 0 }}>
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={AXIS} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="name" tick={AXIS} axisLine={false} tickLine={false} width={56} />
                <Tooltip {...tooltipStyle} formatter={(v: number, k: string) => [`${v}%`, k === "boom" ? "Boom (irrigates)" : "Open return"]} />
                <Bar dataKey="boom" stackId="s" fill="#2B7FD6" radius={[4, 0, 0, 4]} isAnimationActive animationDuration={900}>
                  <LabelList dataKey="boom" position="insideRight" fill="#fff" fontSize={11} formatter={(v: number) => `${Math.round(v)}%`} />
                </Bar>
                <Bar dataKey="ret" stackId="s" fill="#243028" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Reveal>

        <Reveal>
          <ChartCard
            title="Full-zone coverages to build a 1.6 mm event (250 m²)"
            note="Every configuration reaches the same event depth from a 400 L tank — but 3 mm gets there in 28 coverages instead of 80–91."
          >
            <ResponsiveContainer>
              <BarChart data={coverages} margin={{ top: 18, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="name" tick={AXIS} axisLine={{ stroke: GRID }} tickLine={false} />
                <YAxis tick={AXIS} axisLine={false} tickLine={false} width={70} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`≈ ${v} coverages`, "To 1.6 mm"]} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900}>
                  {coverages.map((_, i) => (
                    <Cell key={i} fill={BAR_COLOURS[i]} />
                  ))}
                  <LabelList dataKey="value" position="top" fill="#E8EFEA" fontSize={12} fontFamily="JetBrains Mono" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Reveal>

        <Reveal delay={0.06}>
          <ChartCard
            title="Time to deliver a net 1.6 mm event (incl. 5–10% field loss)"
            note="44.5–47 minutes at 3 mm versus over two hours for the smaller outlets — the difference between practical and impractical for a farmer."
          >
            <ResponsiveContainer>
              <BarChart data={eventTime} margin={{ top: 18, right: 8, left: -6, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="name" tick={AXIS} axisLine={{ stroke: GRID }} tickLine={false} />
                <YAxis tick={AXIS} axisLine={false} tickLine={false} unit=" min" width={76} />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(_v: number, _k, item) => [item.payload.range, "Event time"]}
                />
                <Bar dataKey="mid" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900}>
                  {eventTime.map((_, i) => (
                    <Cell key={i} fill={BAR_COLOURS[i]} />
                  ))}
                  <ErrorBar dataKey="err" stroke="#E8EFEA" strokeWidth={1.5} width={6} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Reveal>
      </div>

      {/* Stress-buffering timeline — the agronomic payoff */}
      <Reveal>
        <div className="card mt-6 border-leaf/25">
          <h3 className="font-display text-base font-semibold text-mist">
            The agronomic payoff: days bought before crop stress
          </h3>
          <p className="mt-2 max-w-3xl text-sm text-fog">
            On sandy-loam Malawi conditions depleting at{" "}
            {stressBuffering.depletionMmDay} mm/day, soil hits the
            readily-available-water stress threshold in ~
            {stressBuffering.daysNoIrrigation} days without irrigation.
            Supplemental irrigation stretches that window:
          </p>
          <div className="mt-6 space-y-5">
            {[
              { label: "No irrigation", days: stressBuffering.daysNoIrrigation, colour: "bg-edge", text: "" },
              { label: "3 mm config · 2-day rotation", days: stressBuffering.daysTwoDayRotation, colour: "bg-leaf", text: "+1.7 days" },
              { label: "3 mm config · daily operation", days: stressBuffering.daysDaily, colour: "bg-leaf-bright", text: "+4.4 days" },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-sm text-mist">{row.label}</span>
                  <span className="font-mono text-sm text-fog">
                    {row.days.toFixed(2)} days{" "}
                    {row.text && (
                      <span className="ml-1 rounded bg-ember/15 px-1.5 py-0.5 text-xs text-ember-bright">
                        {row.text}
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-ink">
                  <div
                    className={`h-full rounded-full ${row.colour} transition-all duration-1000`}
                    style={{ width: `${(row.days / 13) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-fog">
            Sensitivity analysis across ±20% soil-parameter variation kept the
            2-day-rotation buffering gain between{" "}
            {stressBuffering.gainSensitivityDays[0]} and{" "}
            {stressBuffering.gainSensitivityDays[1]} days — the benefit holds
            across the plausible range.
          </p>
        </div>
      </Reveal>

      {/* Predicted vs measured — engineering honesty */}
      <Reveal delay={0.05}>
        <div className="card mt-6 border-ember/30">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex shrink-0 items-end gap-4 font-display">
              <div className="text-center">
                <p className="text-3xl font-semibold text-fog line-through decoration-ember/70">
                  {predictedVsMeasured.predictedLmin}
                </p>
                <p className="mt-1 font-mono text-xs text-fog">predicted L/min</p>
              </div>
              <p className="pb-4 text-2xl text-ember-bright">→</p>
              <div className="text-center">
                <p className="text-3xl font-semibold text-mist">
                  {predictedVsMeasured.measuredLmin}
                </p>
                <p className="mt-1 font-mono text-xs text-fog">measured L/min</p>
              </div>
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-mist">
                Predicted vs measured — a {predictedVsMeasured.errorPercent}%
                lesson in model humility
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                Idealised orifice theory predicted ~
                {predictedVsMeasured.predictedLmin} L/min for the 3 mm boom.{" "}
                {predictedVsMeasured.explanation}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
