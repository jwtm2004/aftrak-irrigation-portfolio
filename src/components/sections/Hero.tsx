import { motion } from "framer-motion";
import { identity, outletConfigs, costs, assets } from "../../data";

const selected = outletConfigs.find((c) => c.selected)!;

/** Full-height hero with an animated flowing-water line motif. */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-14"
    >
      {/* Background: soft radial washes + flowing dashed lines (CSS-animated) */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-leaf/10 blur-3xl" />
        <div className="absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-ember/10 blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path
            className="flow-line"
            d="M-50 620 C 250 560, 420 700, 700 640 S 1150 560, 1300 620"
            stroke="#2B7FD6"
            strokeWidth="2"
          />
          <path
            className="flow-line-slow"
            d="M-50 680 C 300 640, 500 760, 780 700 S 1180 640, 1300 690"
            stroke="#2B7FD6"
            strokeWidth="1.5"
          />
          <path
            className="flow-line-slow"
            d="M-50 560 C 200 520, 450 620, 720 580 S 1120 500, 1300 560"
            stroke="#43A047"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="wrap relative">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow"
        >
          Final-year MEng dissertation · 2025–26
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-mist sm:text-6xl"
        >
          {identity.projectTitle.split("Sub-Saharan")[0]}
          <span className="text-leaf-bright">Sub-Saharan Africa</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-6 max-w-2xl text-lg text-fog sm:text-xl"
        >
          {identity.positioning}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-6 font-mono text-sm text-fog"
        >
          {identity.name} · {identity.degree} · {identity.university} ·{" "}
          <span className="text-ember-bright">{identity.collaboration}</span>
        </motion.p>

        {/* Quick-fact chips: real headline numbers */}
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {[
            "400 L tank",
            "12 V DC diaphragm pump",
            `${selected.boomLmin} L/min boom discharge`,
            `£${costs.totalGbp.toFixed(2)} total build`,
            "Designed, built & lab-tested",
          ].map((fact) => (
            <li
              key={fact}
              className="rounded-full border border-edge bg-panel/70 px-4 py-1.5 font-mono text-xs text-fog"
            >
              {fact}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center gap-4"
        >
          <a
            href="#problem"
            className="group inline-flex items-center gap-3 rounded-full bg-leaf px-6 py-3 font-display text-sm font-semibold text-ink transition-colors hover:bg-leaf-bright"
          >
            Explore the project
            <motion.span
              aria-hidden
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </a>
          <a
            href={assets.report.path}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-edge px-6 py-3 font-display text-sm font-semibold text-fog transition-colors hover:border-leaf hover:text-mist"
          >
            Read the full report
            <span aria-hidden className="font-mono text-xs text-fog">PDF ↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
